const { response } = require('express');
const { Pool } = require('pg')
const pool = new Pool({
  host: 'localhost',
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

const getNow = async () => {
    const response = await pool.query('SELECT NOW()');
    return response.rows[0];
}

const getUser = async (email) => {
    const response = await pool.query(`SELECT * FROM users WHERE email = $1`,[email]);
    return response.rows[0];
}

const createUser = async (firstName, lastName, email, password) => {
    const response = await pool.query(`INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,[firstName, lastName, email, password]);
    return response.rows[0];
}

const setup = async () => {
    console.log("Setting up DB");
    
    try {
        console.log(await pool.query('SELECT NOW()').then(row => { return row.rows[0].now }))

        // console.log("DROP TABLE users");
        // await pool.query('DROP TABLE users');
        console.log("Create table users");
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            firstName VARCHAR(255) NULL ,
            lastName VARCHAR(255) NULL ,
            email VARCHAR(255) NULL ,
            password VARCHAR(255) NULL )
        `);
        // await pool.query('DROP TABLE users');
        // await pool.query(`C`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
    
    
    console.log("Finished setting up DB");
}

module.exports = {
    getNow,
    getUser,
    createUser,
    setup
}