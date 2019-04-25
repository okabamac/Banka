import dotenv from 'dotenv';
import {
  Pool,
} from 'pg';

import {
  psqlUrl,
  psqlTest,
} from '../../config';

dotenv.config();

const db = new Pool({
  connectionString: process.env.NODE_ENV === 'test' ? psqlTest : psqlUrl,
});

db.on('connect', () => {
  console.log('Connected to database');
});

export default db;
