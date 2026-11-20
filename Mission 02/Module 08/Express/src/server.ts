import app from "./app";
import config from "./config";
import { initBD } from "./db";

const main = async () => {
  initBD();
  app.listen(config.port, () => {
    console.log(`The Express Server is running on the prot ${config.port}`);
  });
};

main();
