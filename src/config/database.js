import knex from 'knex';
import dotenv from 'dotenv';
import knexConfig from '../../knexfile.js';

dotenv.config();

const environment = process.env.NODE_ENV || 'production';
const config = knexConfig[environment];

const db = knex(config);

// Test database connection with retry logic for Docker
const testConnection = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await db.raw('SELECT 1');
      console.log('✅ PostgreSQL connected successfully');
      return;
    } catch (err) {
      if (i < retries - 1) {
        console.log(`⏳ Waiting for PostgreSQL... (attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('❌ PostgreSQL connection failed:', err.message);
      }
    }
  }
};

testConnection();

export default db;



