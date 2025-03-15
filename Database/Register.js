const pg = require('pg');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPORT } = process.env;
let PGPASSWORD = process.env.PGPASSWORD;
PGPASSWORD = decodeURIComponent(PGPASSWORD);

const pool = new pg.Pool({
    user: PGUSER,
    host: PGHOST,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: PGPORT,
    ssl: {
        rejectUnauthorized: true,
    },
});

(async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to the database');
        client.release();
    } catch (error) {
        console.error('Database connection error', error.stack);
    }
})();

const checkUserEmail = async (email) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
        if (result.rows.length) {
            console.log('User already exists', result.rows);
            return result.rows;
        }
        console.log('No user found');
        return false;
    } catch (error) {
        console.error(error.stack);
        return false;
    }
};

const insertUser = async (user) => {
    try {
        await pool.query('BEGIN');
        const userResult = await pool.query(
            'INSERT INTO users(user_first_name, user_last_name, user_email, user_phone_number, user_gender, user_password_hash) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [user.fName, user.lName, user.email, user.phone, user.gender, user.password]
        );
        if (!userResult.rows.length) {
            console.log('User not added');
            await pool.query('ROLLBACK');
            return false;
        }
        const userId = userResult.rows[0].user_id;
       
        await pool.query('COMMIT');
        const Result = await pool.query(
            `SELECT 
                u.user_id, u.user_first_name, u.user_last_name, u.user_email, u.user_phone_number, u.user_gender
            FROM 
                users u
            WHERE 
                u.user_id = $1`,
            [userId]
        );
        if (Result.rows.length) {
            console.log('User and patient info retrieved successfully', Result.rows);
            return Result.rows[0];
        }
        console.log('User and patient info not found');
        return false;
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error inserting patient:', error.stack);
        return false;
    }
};

module.exports = { checkUserEmail, insertUser };