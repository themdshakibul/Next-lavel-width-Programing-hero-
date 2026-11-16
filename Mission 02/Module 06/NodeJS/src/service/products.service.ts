import fs from "fs";
import path from "path";
import type { IProducts } from "../types/products";

const filePath = path.join(process.cwd(), "./src/database/db.json");

export const productServices = () => {
  const result = fs.readFileSync(filePath, "utf-8");
  // console.log(result);
  return JSON.parse(result);
};

export const createProduct = (payload: IProducts[]) => {
  fs.writeFileSync(filePath, JSON.stringify(payload));
};
