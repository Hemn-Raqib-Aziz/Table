import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const con = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.PORT,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

con.connect().then(() => {console.log("Database Connected successfully");});


export default con;