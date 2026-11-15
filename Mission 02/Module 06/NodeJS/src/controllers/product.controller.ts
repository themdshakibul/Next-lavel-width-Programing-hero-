import type { IncomingMessage, ServerResponse } from "http";
import { productServices } from "../service/products.service";
import type { Iproducts } from "../types/products";
import { bodyPerser } from "../utils/parseBody";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  const urlParams = url?.split("/");

  const id =
    urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null;
  console.log(id);

  //   Get All Products
  if (url === "/products" && method === "GET") {
    const products = productServices();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products Retrived Successfully!",
        data: products,
      }),
    );
  } else if (method === "GET" && id !== null) {
    const products = productServices();
    const product = products.find((p: Iproducts) => p.id === id);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products Retrived Successfully!",
        data: product,
      }),
    );
  } else if (method === "POST" && url === "/products") {
    const body = await bodyPerser(req);
    console.log(body);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products Created Successfully!",
      }),
    );
  }
};

export default productController;
