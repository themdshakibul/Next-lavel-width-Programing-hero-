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
  // "postgresql://neondb_owner:npg_xdYFQa5szK8M@ep-orange-rain-a1qfl8m3-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=false&channel_binding=require",
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

app.listen(port, () => {
  console.log(`The Express Server is running on the prot ${port}`);
});
