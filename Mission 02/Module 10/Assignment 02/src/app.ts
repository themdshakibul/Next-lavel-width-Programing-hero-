import express, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = express();

app.post("/", (req: Request, res: Response) => {
  console.log(req.body);
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route!!",
    author: "Shakibul",
  });
});

export default app;
