/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";

import * as manifestController from "../controllers/manifest.controller";

const router = Router();

router.get("/validate", manifestController.validate);

export default router;
