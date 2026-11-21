import bcrypt from "bcryptjs";
import { pool } from "../../db";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  //Todo: Check if the user exist -> Done
  //Todo: Check if the password match -> Done
  //Todo: Check the user status
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
};

export const authService = {
  loginUserIntoDB,
};
