import dotenv from 'dotenv';
import {
  Pool,
} from 'pg';

import moment from 'moment';
import {
  psqlUrl,
  psqlTest,
} from '../../config';

const date = moment(new Date());
const tableSeeds = `

  INSERT INTO
    users
      VALUES 
      ( default, 'markokaba99@gmail.com', 'Mac', 'Okaba', 'staff', ${true}, '$2b$10$MWLVVYvFBQHvmjuRLFS6xuvZxpiN2KZJyQbCLb/lXxGZ2vGVmY2vy'),
      ( default, 'aminuaminu@g.com', 'Aminu', 'Tokien', 'staff', ${false}, '$2b$10$MWLVVYvFBQHvmjuRLFS6xuvZxpiN2KZJyQbCLb/lXxGZ2vGVmY2vy'),
      ( default, 'johnmax@r.com', 'John', 'Max', 'client', ${false}, '$2b$10$MWLVVYvFBQHvmjuRLFS6xuvZxpiN2KZJyQbCLb/lXxGZ2vGVmY2vy'),
      ( default, 'jay@jay.com', 'Kell', 'Max', 'client', ${false}, '$2b$10$MWLVVYvFBQHvmjuRLFS6xuvZxpiN2KZJyQbCLb/lXxGZ2vGVmY2vy');
  INSERT INTO
    accounts
      VALUES 
      ( default, 2088058375, '${date}', 3, 'johnmax@r.com', 'current', 2010.033, 'active'),
      ( default, 1234567890, '${date}', 4, 'jay@jay.com', 'savings', 123.00, 'dormant');
  INSERT INTO
    transactions
      VALUES 
      (
          default, '${date}', 'credit', 2088058375, 6566.333, 1, 12235556, 2111.20),
      (
          default, '${date}', 'debit', 1234567890, 12000.20, 1, 1000.20, 13000.20);
`;

dotenv.config();
const pool = new Pool({
  connectionString: process.env.NODE_ENV === 'test' ? psqlTest : psqlUrl,
});

pool.on('connect', () => {
  console.log('Database connection has been established');
});

async function seeder() {
  await pool.query(tableSeeds);
  console.log('Tables are being seeded...');
  pool.end();
}
seeder();
