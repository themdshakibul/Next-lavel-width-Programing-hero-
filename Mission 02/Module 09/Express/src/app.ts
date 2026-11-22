import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { userRoute } from "./modules/users/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import fs from "fs";

const app: Application = express();

app.use((req, res, next) => {
  const log = `\nMethod: ${req.method} | URL: ${req.url} | ${Date.now()}\n`;

  fs.appendFile("logger.txt", log, (err) => {
    console.log(err);
  });
  next();
});

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoute);
app.use("/api/v1/profiles", profileRoute);
app.use("/api/v1/auth", authRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "Shakibul",
  });
});

export default app;
