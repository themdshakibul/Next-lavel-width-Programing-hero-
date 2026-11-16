import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productServices } from "../service/products.service";
import type { IProducts } from "../types/products";
import { bodyPerser } from "../utils/parseBody";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  const urlParams = url?.split("/");

  const id =
    urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null;

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
    const product = products.find((p: IProducts) => p.id === id);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products Retrived Successfully!",
        data: product,
      }),
    );
  } else if (method === "POST" && url === "/products") {
    const body = await bodyPerser(req);
    const newProduct = {
      id: Date.now(),
      ...body,
    };

    const products = productServices();
    products.push(newProduct);
    createProduct(products);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products Created Successfully!",
        data: newProduct,
      }),
    );
  } else if (method === "PUT" && id !== null) {
    const body = await bodyPerser(req);
    const products = productServices();

    const index = products.findIndex((p: IProducts) => p.id === id);

    if (index < 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Products Not Found!",
        }),
      );
    }

    products[index] = { id: products[index].id, ...body };
    createProduct(products);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products Updated Successfully!",
        data: products[index],
      }),
    );
  }
};

export default productController;
