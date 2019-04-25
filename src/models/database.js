import dotenv from 'dotenv';
import {
  Pool,
} from 'pg';

import {
  psqlUrl,
  psqlTest,
} from '../../config';

const createTables = `
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS accounts;
  DROP TABLE IF EXISTS transactions;
  CREATE TABLE IF NOT EXISTS
  users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(128) NOT NULL UNIQUE,
    firstName VARCHAR(150) NOT NULL,
    lastName VARCHAR(150) NOT NULL,
    type VARCHAR(150) NOT NULL,
    isAdmin BOOLEAN NOT NULL,
    password VARCHAR(150) NOT NULL
  );
  CREATE TABLE IF NOT EXISTS
  accounts(
    id SERIAL PRIMARY KEY,
    accountNumber BIGINT NOT NULL,
    createdON TIMESTAMP,
    ownerId INTEGER NOT NULL,
    ownerEmail VARCHAR(150) NOT NULL,
    type VARCHAR(150) NOT NULL,
    balance FLOAT NOT NULL,
    status VARCHAR(150) NOT NULL 
  );
  CREATE TABLE IF NOT EXISTS
  transactions(
    id SERIAL PRIMARY KEY,
    createdOn TIMESTAMP,
    type VARCHAR(150) NOT NULL,        
    accountNumber BIGINT NOT NULL,
    amount FLOAT NOT NULL,
    cashier INT NOT NULL,
    oldBalance FLOAT NOT NULL,
    newBalance FLOAT NOT NULL
  );
`;

dotenv.config();
const pool = new Pool({
  connectionString: process.env.NODE_ENV === 'test' ? psqlTest : psqlUrl,
});
pool.on('connect', () => {
  console.log('Connected to database');
});

async function create() {
  await pool.query(createTables);
  console.log('Creating Tables...');
  pool.end();
}
create();

