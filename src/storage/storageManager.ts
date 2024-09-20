import client from 'storage';
import {singleton} from 'tsyringe';

@singleton()
export default class StorageManager {
  set = async (key: string, field: string, value: string) => {
    await client.HSET(key, field, value);
  };

  get = async (key: string) => {
    const data = await client.HGETALL(key);
    return data;
  };
}
