import type { IncomingMessage, ServerResponse } from "http";

const productController = (req: IncomingMessage, res: ServerResponse) => {


    const url = req.url
    const method = url.method


  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "This is products route!!" }));
};

export default productController;
