import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import "dotenv/config";

const app: Application = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initBD = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INT,
        is_active BOOLEAN DEFAULT true,
        create_at TIMESTAMP DEFAULT NOW(),
        update_at TIMESTAMP DEFAULT NOW()
        );
      `);

    console.log("Database Connected successful!!");
  } catch (error) {
    console.log(error);
  }
};

initBD();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "Shakibul",
  });
});

app.post("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;

    const result = await pool.query(
      `
      INSERT INTO users (name, email, password, age) VALUES
      ($1, $2, $3, $4) RETURNING *
    `,
      [name, email, password, age],
    );

    res.status(201).json({
      success: true,
      message: "Users Created!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
        SELECT * FROM users
      `);

    res.status(200).json({
      success: true,
      message: "Users Retrived successfully!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
        SELECT * FROM users WHERE id=$1
      `,
      [id],
    );

    res.status(200).json({
      success: true,
      message: "User Retrived successfully!",
      data: result.rows[0],
    });

    // console.log(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`The Express Server is running on the prot ${port}`);
});
