import {
  CreateLiveryDataType,
  LiveriesDataType,
  LiveriesResponseType,
  LiveryDataType,
  Method,
  UserDataType
} from '../../../../types';
import {
  withAuth,
  NextApiRequestWithAuth,
  NextApiResponse,
  firestore,
  Collection,
  Document,
  CountShards,
  FieldValue,
  storage,
  StoragePath
} from '../../../../utils/firebase/admin';
import formidable from 'formidable';
import {
  customOnFormidablePart,
  UploadFiles,
  validateObject
} from '../../../../utils/api/uploads';
import { PassThrough } from 'stream';
import { pipeline } from 'stream/promises';
import { defaultLiveryImageTransform } from '../../../../utils/api/images';

//set bodyparser
export const config = {
  api: {
    bodyParser: false
  }
};

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<
    LiveriesResponseType | LiveryDataType | { error: string }
  >
) {
  const method = req.method;
  const liveriesRef = firestore.collection(Collection.LIVERIES);
  const garagesRef = firestore.collection(Collection.GARAGES);
  const usersRef = firestore.collection(Collection.USERS);
  const countRef = firestore.collection(Collection.COUNT);

  switch (method) {
    case Method.GET: {
      try {
        const params = {
          car: req.query.car as string | undefined,
          created: req.query.created as string | undefined,
          ids: req.query.ids as string | undefined,
          page: req.query.page as string | undefined,
          priceMax: req.query.priceMax as string | undefined,
          priceMin: req.query.priceMin as string | undefined,
          rating: req.query.rating as string | undefined,
          search: req.query.search as string | undefined,
          user: req.query.user as string | undefined
        };
        const page = params.page ? +params.page : 0;
        const limit = 20;
        // const offset = page * limit;

        /*
        // TODO: ORDERING LOGIC
        filters:
          car
          ids
          priceMax
          priceMin
          rating
          search
          user

        ordering:
          created
          downloads = default
          price
          rating
        */

        // // get liveries
        // // prepare query
        // type Order = [string, FirebaseFirestore.OrderByDirection | undefined];
        // const orders: Order[] = [];

        // type Filter = [string, FirebaseFirestore.WhereFilterOp, any];
        // const filters: Filter[] = [];

        // let query = liveriesRef.limit(limit); //.startAfter(offset).limit(limit);
        // for (const order of orders) query = query.orderBy(...order);
        // for (const filter of filters) query = query.where(...filter);

        // execute
        const liveriesSnapshot = await liveriesRef.get();

        // process response
        const liveries: LiveriesDataType = [];
        liveriesSnapshot.forEach((doc) => {
          const livery = doc.data() as unknown as LiveryDataType;
          liveries.push(livery);
        });

        // find max price
        const maxPrice = liveries.reduce((maxPrice, livery) => {
          if ((livery.price ?? 0) > maxPrice) return livery.price ?? 0;
          return maxPrice;
        }, 0);

        // get total count from sum of count shards
        const countSnapshot = await countRef
          .doc(Document.LIVERY)
          .collection(Collection.SHARDS)
          .get();
        let total = 0;
        countSnapshot.forEach((shard) => {
          total += shard.data().count;
        });

        return res.status(200).json({
          liveries,
          maxPrice,
          total,
          perPage: limit,
          page: params.page ? +params.page : 0
        });
      } catch (err) {
        return res.status(500).json({ error: 'internal error' });
      }
    }
    case Method.POST: {
      try {
        // check isAuthenticated
        if (!req.isAuthenticated || !req.uid) {
          return res.status(401).json({ error: 'unauthorized' });
        }
        const uid = req.uid;

        // parse req
        const files: UploadFiles = {};
        const parsedData = await new Promise<
          Omit<CreateLiveryDataType, 'liveryZip' | 'imageFiles'>
        >((resolve, reject) => {
          const form = formidable({ multiples: true });
          form.onPart = customOnFormidablePart(files, form, [
            { name: 'imageFiles', limit: 4 },
            { name: 'liveryZip', limit: 1 }
          ]);
          form.parse(req, (err, fields, _files) => {
            if (err) throw new Error(err);
            try {
              // check req body
              const rawData = { ...fields } as any;
              const isValid = validateObject(
                rawData,
                [
                  'car',
                  'description',
                  'garage',
                  'garageKey',
                  'isPublic',
                  'price',
                  'tags',
                  'title'
                ],
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

        const { garage, garageKey, ...data } = parsedData;
        const timestamp = Date.now();
        const newLiveryRef = liveriesRef.doc();
        const newLiveryData: LiveryDataType = {
          createdAt: timestamp,
          creator: {
            id: uid,
            image: '',
            displayName: ''
          },
          deleted: false,
          downloads: 0,
          id: newLiveryRef.id,
          images: [],
          liveryFiles: '',
          rating: 0,
          searchHelpers: [...data.tags.split(','), data.title],
          updatedAt: timestamp,
          ...data
        };

        const filenames = Object.keys(files);

        // ensure bucket path is clear
        const bucket = storage.bucket();
        await bucket.deleteFiles({
          prefix: `${StoragePath.LIVERIES}${newLiveryRef.id}`
        });

        // upload files
        const fileArray = [];
        for (const [i, filename] of filenames.entries()) {
          if (files[filename].stream && files[filename].filename) {
            // get file path
            const [type, subtype] = files[filename].mimetype?.split('/') || [];
            const filePath = `${StoragePath.LIVERIES}${newLiveryRef.id}/${
              type === 'image' ? type : subtype
            }-${i}/${Date.now()}-${i}`;

            const file = bucket.file(filePath);

            // upload file
            const fileWriteStream = file.createWriteStream({
              contentType: files[filename].mimetype as string
            });
            const transformStream =
              subtype === 'zip'
                ? new PassThrough()
                : defaultLiveryImageTransform();

            await pipeline(
              files[filename].stream as PassThrough,
              transformStream,
              fileWriteStream
            );

            await file.makePublic();
            const url = file.publicUrl();

            if (type === 'image') newLiveryData.images.push(url);
            if (subtype === 'zip') newLiveryData.liveryFiles = url;

            fileArray.push(file);
          }
        }

        try {
          await firestore.runTransaction(async (t) => {
            // get creator
            const creatorDoc = await t.get(usersRef.doc(uid));
            const creator = creatorDoc.data() as UserDataType | undefined;

            if (!creator) throw new Error('user not found');
            newLiveryData.creator.displayName = creator.displayName;
            newLiveryData.creator.image = creator.image;
            newLiveryData.searchHelpers.push(creator.displayName);

            // attempt garage update
            if (garage && garageKey) {
              const garageDoc = await t.get(garagesRef.doc(garageKey));
              if (garageDoc.exists) {
                t.update(garageDoc.ref, {
                  liveries: FieldValue.arrayUnion(newLiveryRef.id)
                });
              }
            }

            // set livery
            t.set(newLiveryRef, newLiveryData);

            // increment count
            const shardId = Math.floor(Math.random() * CountShards.LIVERY);
            const shardRef = countRef
              .doc(Document.LIVERY)
              .collection('shards')
              .doc(shardId.toString());
            t.update(shardRef, { count: FieldValue.increment(1) });

            // update creator
            t.update(creatorDoc.ref, {
              liveries: FieldValue.arrayUnion(newLiveryRef.id)
            });
          });
        } catch (err: any) {
          for (const file of fileArray) {
            await file.delete();
          }
          throw new Error(err);
        }

        return res.status(200).json(newLiveryData);
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
