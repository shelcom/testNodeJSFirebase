import * as dotenv from 'dotenv';
dotenv.config();

export interface Condition {
  [key: string]: any;
}

export const APP_PORT = process.env.PORT || 3000;
export const environment = process.env.NODE_ENV || 'development';
