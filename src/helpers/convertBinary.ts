export const convertToBinaryFromBuffer = (buffer: Buffer) => {
  return JSON.stringify(buffer.toString('binary'));
};

export const convertFromBinaryToBuffer = (string: string) => {
  return Buffer.from(JSON.parse(string), 'binary');
};
