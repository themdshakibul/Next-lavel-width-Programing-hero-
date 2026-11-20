import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.connection_String,
});

export const initBD = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INT,
        is_Active BOOLEAN DEFAULT true,
        create_at TIMESTAMP DEFAULT NOW(),
        update_at TIMESTAMP DEFAULT NOW()
        );
      `);

    console.log("Database Connected successful!!");
  } catch (error) {
    console.log(error);
  }
};
