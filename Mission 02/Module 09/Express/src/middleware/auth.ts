import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { TRole } from "../types";

const auth = (...roles: TRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1-> first if the token exist
      // 2-> Verify token
      // 3-> Check if the user exist
      // 4-> Is the user status Active

      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access!!",
        });
      }

      const decode = jwt.verify(
        token as string,
        config.jwt_Secret,
      ) as JwtPayload;

      const user = await pool.query(
        `
    SELECT * FROM users WHERE email=$1
    `,
        [decode.email],
      );

      if (user.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Usear not found!!",
        });
      }

      if (!user.rows[0].is_active) {
        return res.status(404).json({
          success: false,
          message: "For bidden!!",
        });
      }

      //  role = ["admin", "agent", "user"]
      // user.role = "admin"
      if (roles.length && !roles.includes(user.rows[0].role)) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access!!",
        });
      }
      // console.log(req); // req : {body : ""}
      req.user = decode;
      // console.log(req); // req : {body : "", user : ""}
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
