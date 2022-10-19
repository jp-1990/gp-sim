import {
  CreateLiveryDataType,
  LiveriesDataType,
  LiveriesResponseType,
  LiveryDataType,
  Method
} from '../../../../types';
import {
  withAuth,
  NextApiRequestWithAuth,
  NextApiResponse,
  firestore,
  Collection,
  Document,
  CountShards,
  FieldValue
} from '../../../../utils/firebase/admin';
import formidable from 'formidable';

//set bodyparser
export const config = {
  api: {
    bodyParser: false
  }
};

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<LiveriesResponseType | [] | { error: string }>
) {
  const method = req.method;
  const liveriesRef = firestore.collection(Collection.LIVERIES);
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
        const offset = page * limit;

        /*
        ORDERING LOGIC
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

        // get liveries
        // prepare query
        type Order = [string, FirebaseFirestore.OrderByDirection | undefined];
        const orders: Order[] = [];

        type Filter = [string, FirebaseFirestore.WhereFilterOp, any];
        const filters: Filter[] = [];

        let query = liveriesRef.startAfter(offset).limit(limit);
        for (const order of orders) query = query.orderBy(...order);
        for (const filter of filters) query = query.where(...filter);

        // execute
        const liveriesSnapshot = await query.get();

        // process response
        const liveries: LiveriesDataType = [];
        liveriesSnapshot.forEach((doc) => {
          const livery = doc.data() as unknown as LiveryDataType;
          liveries.push(livery);
        });

        // // find max price
        // const maxPrice = liveries.reduce((maxPrice, livery) => {
        //   if ((livery.price ?? 0) > maxPrice) return livery.price ?? 0;
        //   return maxPrice;
        // }, 0);

        // // get total count from sum of count shards
        // const countSnapshot = await countRef
        //   .doc(Document.LIVERY)
        //   .collection(Collection.SHARDS)
        //   .get();
        // let total = 0;
        // countSnapshot.forEach((doc) => {
        //   total += doc.data().count;
        // });

        return res.status(200).json({
          liveries,
          maxPrice: 0,
          total: 0,
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

        // parse req
        const parsedData = await new Promise<CreateLiveryDataType>(
          (resolve, reject) => {
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields, files) => {
              if (err) throw new Error(err);
              try {
                // check req body
                const rawData = { ...fields, ...files } as Record<string, any>;
                const properties = [
                  'car',
                  'creator',
                  'description',
                  'garage',
                  'garageKey',
                  'imageFiles',
                  'isPublic',
                  'liveryZip',
                  'price',
                  'tags',
                  'title'
                ] as const;
                for (const property of properties) {
                  if (!rawData.hasOwnProperty(property)) {
                    return res
                      .status(400)
                      .json({ error: 'malformed request body' });
                  }
                }
                rawData.creator = JSON.parse(rawData.creator);
                rawData.price = +rawData.price;
                rawData.isPublic = rawData.isPublic === 'true' ? true : false;

                resolve(rawData as CreateLiveryDataType);
              } catch (err) {
                reject(err);
              }
            });
          }
        );

        const { liveryZip, imageFiles, garage, garageKey, ...data } =
          parsedData;
        const timestamp = Date.now();
        const newLiveryRef = liveriesRef.doc();
        const newLiveryData: LiveryDataType = {
          createdAt: timestamp,
          downloads: 0,
          id: newLiveryRef.id,
          images: [],
          liveryFiles: '',
          rating: 0,
          searchHelpers: [
            ...data.tags.split(','),
            data.title,
            data.creator.displayName
          ],
          updatedAt: timestamp,
          ...data
        };

        // TODO: upload files

        // batch write create doc, increment count, add to user and garage
        const batch = firestore.batch();
        batch.set(newLiveryRef, newLiveryData);

        // increment count on random shard
        const shardId = Math.floor(Math.random() * CountShards.LIVERY);
        const shardRef = firestore
          .collection(Collection.COUNT)
          .doc(Document.LIVERY)
          .collection('shards')
          .doc(shardId.toString());
        batch.update(shardRef, { count: FieldValue.increment(1) });

        // update user doc
        const userId = newLiveryData.creator.id;
        const userRef = firestore.collection(Collection.USERS).doc(userId);
        batch.update(userRef, {
          liveries: FieldValue.arrayUnion(newLiveryRef.id)
        });

        // attempt to add to garage
        if (garage && garageKey) {
          const garageRef = firestore
            .collection(Collection.GARAGES)
            .doc(garage);
          const garageDoc = await garageRef.get();

          if (garageDoc.exists && garageDoc.data()?.key === garageKey) {
            batch.update(garageRef, {
              liveries: FieldValue.arrayUnion(newLiveryRef.id)
            });
          }
        }

        // run batch
        await batch.commit();

        return res.status(200).json([]);
      } catch (err) {
        return res.status(500).json({ error: 'internal error' });
      }
    }
  }
}

export default withAuth(handler);
