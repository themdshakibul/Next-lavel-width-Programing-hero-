import fs from "fs";
import type { NextFunction, Request, Response } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const log = `\nMethod: ${req.method} | URL: ${req.url} | ${Date.now()}\n`;

  fs.appendFile("logger.txt", log, (err) => {
    console.log(err);
  });
  next();
};
export default logger;
