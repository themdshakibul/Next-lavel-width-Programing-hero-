import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "./src/database/db.json");

export const productServices = () => {
  const result = fs.readFileSync(filePath, "utf-8");
  // console.log(result);
  return JSON.parse(result);
};
