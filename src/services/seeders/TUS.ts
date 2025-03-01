import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser'; // Default import
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// PostgreSQL connection using variables from .env
const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || '5432'), // Ensure port is a number
  });

client.connect();

// Interface for CSV row data
interface CsvRow {
  [key: string]: string; // Dynamic columns, all values are strings
}

// Function to dynamically create a table based on CSV columns
async function createTableFromCSV(tableName: string, data: CsvRow[]): Promise<void> {
  if (data.length === 0) return;

  // Get column names from the first row
  const columns = Object.keys(data[0]);
  const columnDefinitions = columns
    .map((col) => `${col} TEXT`) // Assuming all columns are of type TEXT
    .join(', ');

  // Create table query
  const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions});`;

  await client.query(createTableQuery);
  console.log(`Table ${tableName} created successfully.`);
}

// Function to insert data into the dynamically created table
// Function to insert data into the dynamically created table
// Function to insert data into the dynamically created table
async function insertDataIntoTable(tableName: string, data: CsvRow[]): Promise<void> {
  if (data.length === 0) {
    console.log(`No data to insert into table ${tableName}`);
    return;
  }

  const columns = Object.keys(data[0]);

  if (!columns || columns.length === 0) {
    console.error(`No valid columns found in data for table ${tableName}`);
    return;
  }

  // Prepare the insert query
  const insertQuery = `INSERT INTO ${tableName}(${columns.join(', ')}) VALUES(${columns.map((_, index) => `$${index + 1}`).join(', ')})`;

  // Insert each row of data
  for (const row of data) {
    const values = columns.map((col) => row[col]);

    // Ensure the number of values matches the number of columns
    if (values.length !== columns.length) {
      console.error(`Mismatch between columns and values for row: ${JSON.stringify(row)}`);
      continue;
    }

    try {
      await client.query(insertQuery, values);
    } catch (err) {
      console.error(`Error inserting row: ${JSON.stringify(row)}\n`, err);
    }
  }

  console.log(`Data inserted into table ${tableName}`);
}

  

// Function to process each CSV file
async function processCSVFile(file: string): Promise<void> {
  const tableName = path.basename(file, '.csv');
  const csvData: CsvRow[] = [];

  // Read and parse the CSV file
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(path.join('./csv', file))
      .pipe(csv())
      .on('data', (row: CsvRow) => {
        csvData.push(row);
      })
      .on('end', async () => {
        try {
          await createTableFromCSV(tableName, csvData);
          await insertDataIntoTable(tableName, csvData);
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// Function to process all CSV files
async function processCSVFiles(directoryPath: string): Promise<void> {
  const files = fs.readdirSync(directoryPath);
  
  // Filter only CSV files
  const csvFiles = files.filter(file => path.extname(file) === '.csv');

  // Process all CSV files concurrently
  const promises = csvFiles.map((file) => processCSVFile(file));

  // Wait for all files to be processed
  await Promise.all(promises);
  console.log('All CSV files processed.');
}

// Run the seeder
const csvDirectory = './csv'; // Path to your CSV files
processCSVFiles(csvDirectory)
  .catch((err) => console.error(err))
  .finally(() => {
    client.end(); // Close client after all operations are completed
  });