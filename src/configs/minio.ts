import {parseBoolean} from '../helpers/parseBoolean';
import * as Minio from 'minio';

const client = new Minio.Client({
  endPoint: process.env.MINIO_END_POINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: parseBoolean(process.env.MINIO_IS_USE_SSL),
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const createBucketIfNeeded = async () => {
  try {
    const bucketList = await client.listBuckets();
    console.log('bucketList', bucketList);
    for (const item of bucketList) {
      if (item.name == process.env.BUCKET_NAME) {
        return;
      }
    }

    await client.makeBucket(process.env.BUCKET_NAME, process.env.BUCKET_REGION);
    console.log(`Bucket ${process.env.BUCKET_NAME} created successfully`);
  } catch (e) {
    console.log('createBucketIfNeeded error', e);
  }
};

createBucketIfNeeded();

export default client;
