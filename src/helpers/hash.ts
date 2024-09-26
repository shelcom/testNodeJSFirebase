import crypto from 'crypto';

export enum HashType {
  password, 
  token
}

export const hash = (string: string, type: HashType): string => {
  const hash = crypto
    .pbkdf2Sync(Buffer.from(string, 'binary'), Buffer.from(process.env.SALT_VALUE, 'binary'), 1000, type === HashType.token ? 255 : 64, 'sha512')
    .toString('hex');
  return hash;
};

export const compareStrings = (string1: string, string2: string, type: HashType) => {
  const hashedString = hash(string1, type);
  return hashedString == string2;
};
