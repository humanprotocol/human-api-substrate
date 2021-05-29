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

router.get("/escrow", jobsController.escrow);

router.get("/status", jobsController.status);

router.get("/manifestUrl", jobsController.manifestUrl);

router.get("/manifestHash", jobsController.manifestHash);

router.get("/balance", jobsController.balance);

router.patch("/abort", jobsController.abort);

router.patch("/cancel", jobsController.cancel);

router.patch("/fund", jobsController.fundEscrow);

router.patch("/storeFinalResults", jobsController.storeFinalResults);

router.patch("/complete", jobsController.complete);

router.patch(
  "/noteIntermediateResults",
  jobsController.noteIntermediateResults
);

router.get("/intermediateResults", jobsController.intermediateResults);

router.get("/finalResults", jobsController.finalResults);

router.get("/launcher", jobsController.launcher);

export default router;
