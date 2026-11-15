import type { IncomingMessage, ServerResponse } from "http";
import { productServices } from "../service/products.service";

const productController = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  if (url === "/products" && method === "GET") {
    const products = productServices();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products Retrived Successfully!",
        data: products,
      }),
    );
  }
};

export default productController;
