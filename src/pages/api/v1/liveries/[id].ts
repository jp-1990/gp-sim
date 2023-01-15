import formidable from 'formidable';
import { PassThrough } from 'stream';
import { pipeline } from 'stream/promises';
import {
  LiveriesDataType,
  LiveryDataType,
  Method,
  UpdateLiveryDataType
} from '../../../../types';
import { defaultLiveryImageTransform } from '../../../../utils/api/images';
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
  FieldValue,
  storage,
  StoragePath
} from '../../../../utils/firebase/admin';
import { isNotNullish, parseStringBoolean } from '../../../../utils/functions';

//set bodyparser
export const config = {
  api: {
    bodyParser: false
  }
};

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

        const liveryRef = liveriesRef.doc(liveryId);
        const currentLivery = (await liveryRef.get()).data() as LiveryDataType;

        if (req.uid !== currentLivery.creator.id) {
          return res.status(401).json({ error: 'unauthorized' });
        }

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
                ['description', 'isPublic', 'tags', 'title', 'imagesToRemove'],
                'partial'
              );

              if (!isValid)
                return res
                  .status(400)
                  .json({ error: 'malformed request body' });
              for (const key of Object.keys(rawData)) {
                if (rawData[key] === 'undefined') rawData[key] = undefined;
              }
              if (!rawData.imagesToRemove) rawData.imagesToRemove = [];
              rawData.isPublic = parseStringBoolean(rawData.isPublic);

              resolve(rawData);
            } catch (err) {
              reject(err);
            }
          });
        });

        const { imagesToRemove, ...data } = parsedData;

        const timestamp = Date.now();
        const updateLiveryData: Partial<
          Record<
            | keyof UpdateLiveryDataType
            | 'images'
            | 'updatedAt'
            | 'searchHelpers',
            any
          >
        > = {
          images: [],
          updatedAt: timestamp,
          searchHelpers: [currentLivery.creator.displayName.toLowerCase()]
        };

        // if a key has a value, add to updateData
        for (const key of Object.keys(data)) {
          const updateValue = data[key as keyof typeof data];
          if (isNotNullish(updateValue)) {
            updateLiveryData[key as keyof typeof data] = updateValue;
          }
        }

        // build new search helpers array
        let splitTitle = [...currentLivery.title.split(' ')];
        let splitTags = [...currentLivery.tags.split(',').filter((t) => t)];
        if (isNotNullish(data.title)) splitTitle = data.title.split(' ');
        if (isNotNullish(data.tags))
          splitTags = data.title.split(',').filter((t) => t);
        updateLiveryData.searchHelpers.push(
          ...[...splitTags, ...splitTitle].map((e) => e.toLowerCase())
        );

        // add images which are not being removed to updateData
        for (const image of currentLivery.images) {
          const img = (image.match(/(image-[0-9])/g) || [''])[0];
          if (imagesToRemove.length && imagesToRemove.includes(img)) continue;
          updateLiveryData.images.push(image);
        }

        const filenames = Object.keys(files);

        // ensure bucket path is clear
        const bucket = storage.bucket();
        for await (const image of imagesToRemove) {
          await bucket.deleteFiles({
            prefix: `${StoragePath.LIVERIES}${liveryId}/${image}`
          });
        }

        // upload files
        const availableFilenames = [...(imagesToRemove || [])];
        const fileArray = [];
        for (const [_, filename] of filenames.entries()) {
          if (files[filename].stream && files[filename].filename) {
            // get file path
            const filePath = `${StoragePath.LIVERIES}${liveryRef.id}/${
              availableFilenames[0]
            }/${Date.now()}`;
            const file = bucket.file(filePath);

            // upload file
            const fileWriteStream = file.createWriteStream({
              contentType: files[filename].mimetype as string
            });
            const transformStream = defaultLiveryImageTransform();

            await pipeline(
              files[filename].stream as PassThrough,
              transformStream,
              fileWriteStream
            );

            await file.makePublic();
            const url = file.publicUrl();

            updateLiveryData.images.push(url);
            fileArray.push(file);
            availableFilenames.shift();
          }
        }

        try {
          await liveryRef.update(updateLiveryData);
        } catch (err: any) {
          for (const file of fileArray) {
            await file.delete();
          }
          throw new Error(err);
        }

        const updatedLivery = {
          ...currentLivery,
          ...updateLiveryData
        };

        try {
          await res.revalidate('/liveries');
          await res.revalidate(`/liveries/${liveryId}`);
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
