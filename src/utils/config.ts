import dotenv from 'dotenv';
import path from 'path';

// Load .env file from workspace root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface Config {
  port: number;
  env: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  env: process.env.NODE_ENV || 'development',
};
