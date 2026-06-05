import dotenv from 'dotenv';

dotenv.config();

export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  SERVER_URL: process.env.SERVER_URL || 'http://4.224.186.213/evaluation-service',
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  EMAIL: process.env.EMAIL,
  NAME: process.env.NAME,
  ROLL_NO: process.env.ROLL_NO,
  MOBILE_NO: process.env.MOBILE_NO,
  GITHUB_USERNAME: process.env.GITHUB_USERNAME,
  ACCESS_CODE: process.env.ACCESS_CODE,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
