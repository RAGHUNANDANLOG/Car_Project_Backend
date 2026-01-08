import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    client: 'pg',
    connection:
      process.env.DATABASE_URL ||
      'postgresql://car_management_12rk_user:CuDHz1rWfIDRevdHLyqJi0tEuGzEgGrj@dpg-d5g1nbali9vc73bdggl0-a.oregon-postgres.render.com:5432/car_management_12rk',
    ssl: { rejectUnauthorized: false },
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    },
    pool: {
      min: 0,
      max: 3
    }
  }
};
