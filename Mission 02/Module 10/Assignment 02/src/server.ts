import app from "./app";
import config from "./config";

const main = () => {
  app.listen(config.port, () => {
    console.log(`The Express Server is running on the prot ${config.port}`);
  });
};

main();
