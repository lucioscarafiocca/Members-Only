const { Client } = require("pg")
require("dotenv").config()

const SQL = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR ( 255 ),
    password VARCHAR ( 255 ),
    membership_status boolean,
    fullname VARCHAR ( 255 )
);
`

const SQL2 = `
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR ( 255 ),
    text VARCHAR ( 255 ),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users (id)
);
`

async function main() {
  console.log("seeding...")
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })
  await client.connect()
  await client.query(SQL)
  await client.query(SQL2)
  await client.end()
  console.log("done")
}

main()
