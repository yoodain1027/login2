const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "yourpassword",
    database: "yourdatabase"
});

async function createUserTable() {
    const connection = await pool.getConnection();
    await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `);
    connection.release();
}

async function addUser(email, password) {
    const connection = await pool.getConnection();
    await connection.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, password]);
    connection.release();
}

module.exports = { createUserTable, addUser };
