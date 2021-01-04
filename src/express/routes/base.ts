import { Router } from "express";

import * as controller from "../controllers/base.controllers";

const router = Router();

router.post("/", controller.base);

export default router;
