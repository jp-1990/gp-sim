import {
  CreateLiveryDataType,
  LiveriesDataType,
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
  res: NextApiResponse<LiveriesDataType | LiveryDataType | { error: string }>
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
          car: Array.isArray(req.query.car)
            ? req.query.car[0]
            : req.query.car ?? '',
          created: (Array.isArray(req.query.created)
            ? req.query.created[0]
            : req.query.created ||
              'desc') as FirebaseFirestore.OrderByDirection,
          rating: Array.isArray(req.query.rating)
            ? req.query.rating[0]
            : req.query.rating ?? '',
          search: Array.isArray(req.query.search)
            ? req.query.search[0]
            : req.query.search ?? ''
        };

        const ids =
          (Array.isArray(req.query.ids) ? req.query.ids[0] : req.query.ids) ??
          '';
        const lastLiveryId =
          (Array.isArray(req.query.lastLiveryId)
            ? req.query.lastLiveryId[0]
            : req.query.lastLiveryId) ?? null;
        const limit = 12;

        const definedParams = (
          Object.keys(params) as (keyof typeof params)[]
        ).reduce((output, param) => {
          if (!params[param]) return output;
          if (param.match(/rating/)) {
            output.unshift('rating');
            return output;
          }
          if (param.match(/search/)) {
            output.unshift('search');
            return output;
          }
          output.push(param);
          return output;
        }, [] as string[]);

        type Filter = [string, FirebaseFirestore.WhereFilterOp, any];
        const filters: Record<string, Filter> = {
          car: ['car', '==', params.car],
          rating: ['rating', '>=', +params.rating],
          search: [
            'searchHelpers',
            'array-contains-any',
            [...new Set(params.search.split(' '))]
          ]
        };

        type Order = [string, FirebaseFirestore.OrderByDirection | undefined];
        const orders: Record<string, Order> = {
          created: ['createdAt', params.created],
          rating: ['rating', 'desc']
        };

        // GET LIVERIES
        // if not filtering by ids, normal query
        const liveries: LiveriesDataType = [];
        if (!ids.length) {
          // prepare query
          let query =
            liveriesRef as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

          query = query.where('deleted', '==', false);
          for (const param of definedParams) {
            if (filters[param]) query = query.where(...filters[param]);
            if (orders[param]) query = query.orderBy(...orders[param]);
          }

          if (lastLiveryId) {
            const lastLiveryDoc = await liveriesRef.doc(lastLiveryId).get();
            query = query.startAfter(lastLiveryDoc);
          }

          // execute
          const liveriesSnapshot = await query.limit(limit).get();
          // process response
          liveriesSnapshot.forEach((doc) => {
            const livery = doc.data() as unknown as LiveryDataType;
            liveries.push(livery);
          });
        }

        // if filtering by ids, fetch in batches by id and filter on server
        if (ids.length) {
          const liveriesToFetch = ids.split('&');
          let docs: (LiveryDataType | undefined)[];

          // keep fetching in batches of 'limit' and filtering until there are at least 'limit' results
          let offset = 0;
          if (lastLiveryId) offset = liveriesToFetch.indexOf(lastLiveryId) + 1;

          while (liveries.length < limit) {
            const batch = liveriesToFetch.slice(offset, offset + limit);

            docs = await Promise.all(
              batch.map((id) =>
                liveriesRef
                  .doc(id)
                  .get()
                  .then((doc) => doc.data() as LiveryDataType)
              )
            );

            docs = docs.filter((doc) => {
              if (!doc) return false;
              const filterByCar = definedParams.includes('car');
              const filterByRating = definedParams.includes('rating');
              const filterBySearch = definedParams.includes('search');

              const match = [true, true, true];
              if (filterByCar) match[0] = doc.car === params.car;
              if (filterByRating) match[1] = doc.rating >= +params.rating;
              if (filterBySearch)
                match[2] = doc.searchHelpers.some(
                  (helper: string) =>
                    params.search.split(' ').indexOf(helper) >= 0
                );

              return !match.some((match_) => !match_);
            });

            liveries.push(...(docs as LiveriesDataType));

            if (batch.length < limit) break;
            offset += limit;
          }
        }

        return res.status(200).json(liveries.slice(0, limit));
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
          rating: 0,
          searchHelpers: [
            ...data.tags.split(',').filter((tag) => tag),
            ...data.title.split(' ')
          ].map((e) => e.toLowerCase()),
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
            }${type === 'image' ? `-${i}` : ``}/${newLiveryRef.id}`;

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
            newLiveryData.searchHelpers.push(creator.displayName.toLowerCase());

            // attempt garage update
            if (garage || garageKey) {
              const garageId = garage ? garage : garageKey ? garageKey : '';
              const garageDoc = await t.get(garagesRef.doc(garageId));
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

        try {
          await res.revalidate('/liveries');
          await res.revalidate(`/liveries/${newLiveryData.id}`);
          await res.revalidate(`/profile/${uid}`);
          if (garage) {
            await res.revalidate('/garages');
            await res.revalidate(`/garages/${garage}`);
          }
          if (garageKey) {
            await res.revalidate('/garages');
            await res.revalidate(`/garages/${garageKey}`);
          }
        } catch (_) {
          // revalidation failing should not cause an error
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
