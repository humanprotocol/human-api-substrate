/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";

import * as jobsController from "../controllers/jobs.controller";

const router = Router();

router.post("/", jobsController.create);

router.post(
  "/storeIntermediateResults",
  jobsController.storeIntermediateResults
);

router.post("/bulkPayout", jobsController.bulkPayout);

router.post("/addTrustedHandlers", jobsController.addTrustedHandlers);

router.get("/status", jobsController.status);

router.get("/manifestUrl", jobsController.manifestUrl);

router.get("/manifestHash", jobsController.manifestHash);

router.get("/balance", jobsController.balance);

router.post("/abort", jobsController.abort);

router.post("/cancel", jobsController.cancel);

router.post("/complete", jobsController.complete);

router.get("/intermediateResults", jobsController.balance);

router.get("/finalResults", jobsController.balance);

router.get("/launcher", jobsController.launcher);

export default router;
