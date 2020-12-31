import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";

import { setup } from "../index.js";
import routes from "./routes";

const port = "3001";
const app = express();

if (process.env.NODE === "development") {
  app.use(logger("dev"));
}

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "500mb" }));

app.use((req: any, res: any, next: any) => {
  next();
});

app.use("/", routes.base);

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}!`);
  const returned: any = await setup();
});
