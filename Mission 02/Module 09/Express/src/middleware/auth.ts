import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = (...rolese: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(rolese);

    // 1-> first if the token exist
    // 2-> Verify token
    // 3-> Check if the user exist
    // 4-> Is the user status Active

    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized access!!",
      });
    }

    const decode = jwt.verify(token as string, config.jwt_Secret) as JwtPayload;

    const user = await pool.query(
      `
    SELECT * FROM users WHERE email=$1
    `,
      [decode.email],
    );

    if (user.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Usear not found!!",
      });
    }
    if (!user.rows[0].is_active) {
      res.status(404).json({
        success: false,
        message: "For bidden!!",
      });
    }

    // console.log(req); // req : {body : ""}
    req.user = decode;
    // console.log(req); // req : {body : "", user : ""}
    next();
  };
};

export default auth;
