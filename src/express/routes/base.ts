import { Router } from "express";

import * as controller from "../controllers/base.controllers";

const router = Router();

router.get("/", controller.test);

export default router;
