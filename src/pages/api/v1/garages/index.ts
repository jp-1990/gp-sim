import formidable from 'formidable';
import { PassThrough } from 'stream';
import { pipeline } from 'stream/promises';
import {
  CreateGarageDataType,
  GarageDataType,
  GaragesDataType,
  GaragesResponseType,
  Method,
  UserDataType
} from '../../../../types';
import { defaultGarageImageTransform } from '../../../../utils/api/images';
import {
  customOnFormidablePart,
  UploadFiles,
  validateObject
} from '../../../../utils/api/uploads';
import {
  Collection,
  FieldValue,
  firestore,
  NextApiRequestWithAuth,
  NextApiResponse,
  storage,
  StoragePath,
  withAuth
} from '../../../../utils/firebase/admin';

//set bodyparser
export const config = {
  api: {
    bodyParser: false
  }
};

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<GaragesResponseType | [] | { error: string }>
) {
  const method = req.method;
  const garagesRef = firestore.collection(Collection.GARAGES);
  const usersRef = firestore.collection(Collection.USERS);

  switch (method) {
    case Method.GET: {
      try {
        // check isAuthenticated
        if (!req.isAuthenticated || !req.uid) {
          return res.status(401).json({ error: 'unauthorized' });
        }

        const params = {
          created: (Array.isArray(req.query.created)
            ? req.query.created[0]
            : req.query.created || 'asc') as FirebaseFirestore.OrderByDirection,
          ids: Array.isArray(req.query.ids)
            ? req.query.ids[0]
            : req.query.ids ?? '',
          search: Array.isArray(req.query.search)
            ? req.query.search[0]
            : req.query.search ?? ''
        };

        // search and ids filters cannot be applied to the same query
        const [definedParams, search] = (
          Object.keys(params) as (keyof typeof params)[]
        ).reduce(
          (output, key) => {
            if (!params[key]) return output;
            if (key === 'search' && output[0].includes('ids')) {
              output[1].push(key);
              return output;
            }
            if (key === 'search') {
              output[0].push(key);
              output[1].push(key);
              return output;
            }
            if (key === 'ids' && output[0].includes('search')) {
              output[0] = output[0].filter((k) => k !== 'search');
              output[0].push(key);
              output[1].push('search');
              return output;
            }
            output[0].push(key);
            return output;
          },
          [[], []] as [string[], string[]]
        );

        type Filter = [string, FirebaseFirestore.WhereFilterOp, any];
        const filters: Record<string, Filter> = {
          ids: ['id', 'in', params.ids.split(',')],
          search: [
            'searchHelpers',
            'array-contains-any',
            [...new Set(params.search.split(' '))]
          ]
        };

        type Order = [string, FirebaseFirestore.OrderByDirection | undefined];
        const orders: Record<string, Order> = {
          created: ['createdAt', params.created]
        };

        // prepare query
        let query =
          garagesRef as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
        for (const param of definedParams) {
          if (filters[param]) query = query.where(...filters[param]);
          if (orders[param]) query = query.orderBy(...orders[param]);
        }

        // execute
        const garagesSnapshot = await query.get();

        // process response
        let garages: GaragesDataType = [];
        garagesSnapshot.forEach((doc) => {
          const garage = doc.data() as unknown as GarageDataType;
          garages.push(garage);
        });

        if (search.length) {
          const searchTerms = [...new Set(params.search.split(' '))];
          // weight by number of matched terms
          const weightedSearch = garages.reduce((weighted, garage) => {
            let weight = 0;
            let searchMatch = false;
            for (const term of searchTerms) {
              if (garage.searchHelpers.includes(term.toLowerCase())) {
                weight++;
                searchMatch = true;
              }
            }
            if (searchMatch) weighted.push({ weight, garage });
            return weighted;
          }, [] as { weight: number; garage: GarageDataType }[]);

          // sort by weight and reassign to garages
          garages = weightedSearch
            .sort((a, b) => b.weight - a.weight)
            .map((e) => e.garage);
        }

        return res.status(200).json(garages);
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
        const parsedData = await new Promise<CreateGarageDataType>(
          (resolve, reject) => {
            const form = formidable({ multiples: true });
            form.onPart = customOnFormidablePart(files, form, [
              { name: 'imageFile', limit: 1 }
            ]);
            form.parse(req, (err, fields, _files) => {
              if (err) throw new Error(err);
              try {
                // check req body
                const rawData = {
                  ...fields
                } as unknown as CreateGarageDataType;
                const isValid = validateObject(
                  rawData,
                  ['description', 'title'],
                  'exact'
                );
                if (!isValid)
                  return res
                    .status(400)
                    .json({ error: 'malformed request body' });

                resolve(rawData);
              } catch (err) {
                reject(err);
              }
            });
          }
        );

        const timestamp = Date.now();
        const newGarageRef = garagesRef.doc();
        const newGarageData: GarageDataType = {
          createdAt: timestamp,
          drivers: [uid],
          id: newGarageRef.id,
          image: '',
          liveries: [],
          updatedAt: timestamp,
          searchHelpers: [...parsedData.title.split('')].map((e) =>
            e.toLowerCase()
          ),
          creator: {
            id: '',
            image: '',
            displayName: ''
          },
          ...parsedData
        };

        // upload image to storage
        const filenames = Object.keys(files);
        let file;
        for (const filename of filenames) {
          if (files[filename].stream && files[filename].filename) {
            const bucket = storage.bucket();
            file = bucket.file(`${StoragePath.GARAGES}${newGarageRef.id}`);

            const fileWriteStream = file.createWriteStream({
              contentType: 'image/webp'
            });
            const sharpTransformStream = defaultGarageImageTransform();

            await pipeline(
              files[filename].stream as PassThrough,
              sharpTransformStream,
              fileWriteStream
            );

            await file.makePublic();
            const url = file.publicUrl();
            newGarageData.image = url;
          }
        }

        // apply update
        try {
          await firestore.runTransaction(async (t) => {
            // get creator
            const creatorDoc = await t.get(usersRef.doc(uid));
            const creator = creatorDoc.data() as UserDataType | undefined;

            if (!creator) throw new Error('creator not found');

            newGarageData.creator.id = creator.id;
            newGarageData.creator.displayName = creator.displayName;
            newGarageData.creator.image = creator.image;

            // set new garage
            t.set(newGarageRef, newGarageData);

            // update user doc
            t.update(creatorDoc.ref, {
              garages: FieldValue.arrayUnion(newGarageRef.id)
            });
          });
        } catch (err: any) {
          await file?.delete();
          throw new Error(err);
        }

        return res.status(200).json([newGarageData]);
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
