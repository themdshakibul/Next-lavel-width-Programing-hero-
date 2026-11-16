import type { IncomingMessage } from "http";

export const bodyPerser = (req: IncomingMessage): Promise<any> => {
  // return new Promise((resolve, reject) => {
  //   let body = "";
  //   req.on("data", (chunk) => {
  //     body += chunk;
  //   });
  //   req.on("end", () => {
  //     try {
  //       resolve(JSON.parse(body));
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // });

  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("Invalid payload"));
      }
    });
  });
};
