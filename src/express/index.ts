import { json } from "body-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";

import { setup } from "../index";
import { endpoint } from "./config/constants";
import routes from "./routes";

const port = "3001";
const app = express();

if (process.env.NODE === "development") {
  app.use(logger("dev"));
}

app.use(cors());
app.use(express.json());
app.use(json({ limit: "5mb" }));

app.use((req: any, res: any, next: any) => {
  next();
});

app.use("/factory", routes.factory);
app.use("/manifest", routes.manifest);
app.use("/job", routes.jobs);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      substrate: any;
      keyring: any;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.listen(port, async () => {
  console.log(`API listening on port ${port}!`);
  const returned: any = await setup(endpoint);

  global.substrate = returned.api;
  global.keyring = returned.keyring;
});
