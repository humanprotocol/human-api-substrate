/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";

import * as controller from "../controllers/factory.controllers";

const router = Router();

router.post("/", controller.create);

router.get("/", controller.get);

export default router;
