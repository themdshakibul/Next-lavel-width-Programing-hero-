import { createServer, IncomingMessage, Server, ServerResponse } from "http";

const server: Server = createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    //   console.log("Requist", req);
    //   console.log("Response", res);
    // console.log(req.url)
    // console.log(req.method)

    const url = req.url; //? ["/", "/products", "/courses"]
    const method = req.method; //? ["get", "post"]

    if (url === "/" && method === "GET") {
      //   console.log("This is root route");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "This is root route!!" }));
    } else if (url?.startsWith("/products")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "This is products route!!" }));
    } else {
      //   console.log("This route is not define");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "This route is not define!!" }));
    }
  },
);

server.listen(5000, () => {
  console.log("Server is running sucessfully!!");
});
