import { Pool } from "pg";

const hostname = process.env.DB_HOSTNAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

export const pool = new Pool({
    user: username,
    password : password,
    host: hostname,
    database : database,
    port: 5432
})

export default pool;    