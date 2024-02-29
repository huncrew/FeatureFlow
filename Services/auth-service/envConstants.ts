// Importing and initializing dotenv
import dotenv from 'dotenv';
dotenv.config();

// Defining the type for your configuration for better type-checking
interface Config {
  ETSY_CLIENT_ID: string;
  REDIRECT_URI: string;
  ETSY_CLIENT_SECRET: string;
  OPENAI_KEY: string;
}

// Assigning environment variables to constants with type assertion for safety
const config: Config = {
  ETSY_CLIENT_ID: process.env.ETSY_CLIENT_ID || '',
  REDIRECT_URI: process.env.REDIRECT_URI || '',
  ETSY_CLIENT_SECRET: process.env.ETSY_CLIENT_SECRET || '',
  OPENAI_KEY: process.env.OPENAI || ''
};

// Exporting the config object
export default config;
