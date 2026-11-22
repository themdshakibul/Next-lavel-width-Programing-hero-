import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  //Todo: Check if the user exist -> Done
  //Todo: Check if the password match -> Done
  //Todo: Check the user status -> Done
  //Todo: If pass all then generate jwt token

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
  };

  const accessToken = jwt.sign(jwtPayload, config.JwtSecreate, {
    expiresIn: "1d",
  });

  const { password: _password, ...safeUser } = user.rows[0];

  return { accessToken, user: safeUser };
};

export const authService = {
  loginUserIntoDB,
};
