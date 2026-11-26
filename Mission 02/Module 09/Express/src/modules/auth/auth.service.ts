import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  //Todo: Check if the user exist -> Done
  //Todo: Check if the password match -> Done
  //Todo: Check the user status -> Done
  //Todo: If pass all then generate jwt token -> Done

  const { email, password } = payload;

  const user = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email],
  );
  if (user.rowCount == 0) {
    throw new Error("Invalid credentials!!");
  }

  const matchPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!matchPassword) {
    throw new Error("Invalid credentials!!");
  }
  if (!user.rows[0].is_active) {
    throw new Error("Access denied!!");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_Secret, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(jwtPayload, config.refresh_Secret, {
    expiresIn: "10d",
  });

  const { password: _password, ...safeUser } = user.rows[0];

  return { accessToken, refreshToken, user: safeUser };
};

const generateAccessToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized access!!");
  }

  const decode = jwt.verify(
    token as string,
    config.refresh_Secret,
  ) as JwtPayload;

  const user = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [decode.email],
  );

  if (user.rowCount === 0) {
    throw new Error("Usear not found!!");
  }

  if (!user.rows[0].is_active) {
    throw new Error("For bidden!!");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_Secret, {
    expiresIn: "1h",
  });

  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
  generateAccessToken,
};
