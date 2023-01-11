import formidable from 'formidable';
import {
  LiveriesDataType,
  LiveryDataType,
  Method,
  UpdateLiveryDataType
} from '../../../../types';
import {
  customOnFormidablePart,
  UploadFiles,
  validateObject
} from '../../../../utils/api/uploads';
import {
  firestore,
  NextApiResponse,
  NextApiRequestWithAuth,
  Collection,
  Document,
  withAuth,
  CountShards,
  FieldValue
} from '../../../../utils/firebase/admin';

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<LiveryDataType | { [key: string]: string }>
) {
  const method = req.method;
  const liveriesRef = firestore.collection(Collection.LIVERIES);
  const garagesRef = firestore.collection(Collection.GARAGES);
  const countRef = firestore.collection(Collection.COUNT);

  switch (method) {
    case Method.GET: {
      try {
        // check req params
        const params = {
          id: req.query.id as string | undefined
        };

        if (!params.id) {
          return res.status(400).json({ error: 'malformed request params' });
        }

        const liveriesSnapshot = await liveriesRef
          .where('id', '==', params.id)
          .where('isPublic', '==', true)
          .get();

        // process response
        const liveries: LiveriesDataType = [];
        liveriesSnapshot.forEach((doc) => {
          const livery = doc.data() as unknown as LiveryDataType;
          liveries.push(livery);
        });

        return res.status(200).json(liveries[0]);
      } catch (err) {
        return res.status(500).json({ error: 'internal error' });
      }
    }

    case Method.PATCH: {
      try {
        // check isAuthenticated
        if (!req.isAuthenticated || !req.uid) {
          return res.status(401).json({ error: 'unauthorized' });
        }

        // check req params
        const params = {
          id: req.query.id as string | undefined
        };
        if (!params.id) {
          return res.status(400).json({ error: 'malformed request params' });
        }
        const liveryId = params.id;

        // parse req
        const files: UploadFiles = {};
        const parsedData = await new Promise<
          Omit<UpdateLiveryDataType, 'imageFiles'>
        >((resolve, reject) => {
          const form = formidable({ multiples: true });
          form.onPart = customOnFormidablePart(files, form, [
            { name: 'imageFiles', limit: 4 }
          ]);
          form.parse(req, (err, fields, _files) => {
            if (err) throw new Error(err);
            try {
              // check req body
              const rawData = { ...fields } as any;
              const isValid = validateObject(
                rawData,
                ['description', 'isPublic', 'price', 'tags', 'title'],
                'exact'
              );
              if (!isValid)
                return res
                  .status(400)
                  .json({ error: 'malformed request body' });
              rawData.price = +rawData.price;
              rawData.isPublic = rawData.isPublic === 'true' ? true : false;

              resolve(rawData);
            } catch (err) {
              reject(err);
            }
          });
        });

        const timestamp = Date.now();
        const liveryRef = liveriesRef.doc(liveryId);
        const updateLiveryData: Partial<
          Record<keyof UpdateLiveryDataType | 'images' | 'updatedAt', any>
        > = {
          // images: [],
          updatedAt: timestamp
        };
        for (const key of Object.keys(parsedData)) {
          const updateValue = parsedData[key as keyof typeof parsedData];
          if (updateValue !== null && updateValue !== undefined) {
            updateLiveryData[key as keyof typeof parsedData] = updateValue;
          }
        }

        // TODO: how do we do images? we need to replace the correct images, and leave the rest alone
        // const filenames = Object.keys(files);

        // // ensure bucket path is clear
        // const bucket = storage.bucket();
        // await bucket.deleteFiles({
        //   prefix: `${StoragePath.LIVERIES}${liveryId}`
        // });

        // // upload files
        // const fileArray = [];
        // for (const [i, filename] of filenames.entries()) {
        //   if (files[filename].stream && files[filename].filename) {
        //     // get file path
        //     const [type, subtype] = files[filename].mimetype?.split('/') || [];
        //     const filePath = `${StoragePath.LIVERIES}${liveryRef.id}/${
        //       type === 'image' ? type : subtype
        //     }${type === 'image' ? `-${i}` : ``}/${liveryRef.id}`;

        //     const file = bucket.file(filePath);

        //     // upload file
        //     const fileWriteStream = file.createWriteStream({
        //       contentType: files[filename].mimetype as string
        //     });
        //     const transformStream =
        //       subtype === 'zip'
        //         ? new PassThrough()
        //         : defaultLiveryImageTransform();

        //     await pipeline(
        //       files[filename].stream as PassThrough,
        //       transformStream,
        //       fileWriteStream
        //     );

        //     await file.makePublic();
        //     const url = file.publicUrl();

        //     if (type === 'image') updateLiveryData.images.push(url);

        //     fileArray.push(file);
        //   }
        // }

        let updatedLivery: LiveryDataType;
        try {
          await liveryRef.update(updateLiveryData);
          updatedLivery = (await liveryRef.get()).data() as LiveryDataType;
        } catch (err: any) {
          // for (const file of fileArray) {
          //   await file.delete();
          // }
          throw new Error(err);
        }

        try {
          await res.revalidate('/liveries');
          await res.revalidate(`/liveries/${updatedLivery.id}`);
        } catch (_) {
          // revalidation failing should not cause an error
        }

        return res.status(200).json(updatedLivery);
      } catch (err) {
        return res.status(500).json({ error: 'internal error' });
      }
    }

    case Method.DELETE: {
      try {
        // check isAuthenticated
        if (!req.isAuthenticated || !req.uid) {
          return res.status(401).json({ error: 'unauthorized' });
        }

        // check req params
        const params = {
          id: req.query.id as string | undefined
        };
        if (!params.id) {
          return res.status(400).json({ error: 'malformed request params' });
        }

        const liveryRef = liveriesRef.doc(params.id);

        const garageIdsToRevalidate = await firestore.runTransaction(
          async (t) => {
            // get livery
            const liveryDoc = await t.get(liveryRef);
            const livery = liveryDoc.data() as LiveryDataType | undefined;

            // delete only if creator id matches auth user id, and livery exists
            if (!livery || livery.creator.id !== req.uid) {
              throw new Error('unauthorized');
            }

            // get ids for garages that this livery belongs to
            const garageIds: string[] = [];
            const garagesSnapshot = await t.get(
              garagesRef.where('liveries', 'array-contains', livery.id)
            );
            garagesSnapshot.forEach((doc) => {
              garageIds.push(doc.data().id);
            });

            // decrement count on random shard
            const shardId = Math.floor(Math.random() * CountShards.LIVERY);
            const shardRef = countRef
              .doc(Document.LIVERY)
              .collection('shards')
              .doc(shardId.toString());
            t.update(shardRef, { count: FieldValue.increment(-1) });

            // mark livery as deleted
            t.update(liveryRef, { deleted: true });

            return garageIds;
          }
        );

        try {
          await res.revalidate('/liveries');
          await res.revalidate(`/liveries/${params.id}`);
          await res.revalidate(`/profile/${req.uid}`);
          if (garageIdsToRevalidate.length) await res.revalidate('/garages');
          for (const id of garageIdsToRevalidate) {
            await res.revalidate(`/garages/${id}`);
          }
        } catch (_) {
          // revalidation failing should not cause an error
        }

        return res.status(200).json({ id: params.id });
      } catch (err) {
        return res.status(500).json({ error: 'internal error' });
      }
    }
    default: {
      return res
        .status(501)
        .json({ error: 'requested endpoint does not exist' });
    }
  }
}

export default withAuth(handler);
