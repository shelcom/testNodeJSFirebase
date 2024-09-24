import * as bcrypt from 'bcryptjs';
import {WrongPasswordException} from '@common/errors/authExceptions';

export const hashData = async (data: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data, salt);

  return hashedPassword;
};

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isMatch) {
      throw new WrongPasswordException();
    }

    return isMatch;
  } catch (error) {
    if (error instanceof WrongPasswordException) {
      throw error;
    }
    throw new WrongPasswordException();
  }
};

export const verifyRefreshToken = async (
  providedRefreshToken: string,
  tokenDBRefreshToken: string,
): Promise<boolean> => {
  return await bcrypt.compare(providedRefreshToken, tokenDBRefreshToken);
};
