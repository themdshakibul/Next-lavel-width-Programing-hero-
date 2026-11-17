import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productServices } from "../service/products.service";
import type { IProducts } from "../types/products";
import { bodyPerser } from "../utils/parseBody";
import { sendResponse } from "../utils/sendResponse";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  const urlParams = url?.split("/");

  const id =
    urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null;

  //   Get All Products
  if (url === "/products" && method === "GET") {
    try {
      const products = productServices();
      sendResponse(res, true, 200, "Products Retrived Successfully!", products);
    } catch (error) {
      sendResponse(res, false, 500, "Internal Server Error!");
    }
  } else if (method === "GET" && id !== null) {
    try {
      const products = productServices();
      const product = products.find((p: IProducts) => p.id === id);

      if (!product) {
        return sendResponse(res, false, 404, "Product Not Found!");
      }

      sendResponse(res, true, 200, "Product Retrived Successfully!", product);
    } catch (error) {
      sendResponse(res, false, 500, "Internal Server Error!");
    }
  } else if (method === "POST" && url === "/products") {
    try {
      const body = await bodyPerser(req);
      const newProduct = {
        id: Date.now(),
        ...body,
      };

      const products = productServices();
      products.push(newProduct);
      createProduct(products);

      sendResponse(
        res,
        true,
        201,
        "Products Created Successfully!",
        newProduct,
      );
      // res.writeHead(201, { "Content-Type": "application/json" });
      // res.end(
      //   JSON.stringify({
      //     message: "Products Created Successfully!",
      //     data: newProduct,
      //   }),
      // );
    } catch (error) {
      sendResponse(res, false, 500, "Internal Server Error!");
    }
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
  } else if (method === "DELETE" && id !== null) {
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

    products.splice(index, 1);

    createProduct(products);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products Deleted Successfully!",
      }),
    );
  }
};

export default productController;
