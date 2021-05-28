import { u8aToString } from "@polkadot/util";

import * as constants from "../config/constants";
import { APIError, handleError } from "../middleware/errorHandler";
import * as baseService from "../services/base.service";

export const create = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.CREATE_ESCROW;
    const data = await baseService.base(req);

    return res.status(200).send(data);
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const storeIntermediateResults = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.NOTE_INTERMEDIATE_RESULTS;
    const data = await baseService.base(req);

    return res.status(200).send(data);
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const bulkPayout = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.BULK_PAYOUT;
    const data = await baseService.base(req);

    return res.status(200).send(data);
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const addTrustedHandlers = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.ADD_TRUSTED_HANDLERS;
    const data = await baseService.base(req);

    return res.status(200).send(data);
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const status = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.ESCROW;
    const data = await baseService.base(req);

    return res.status(200).send({ status: data.status });
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const escrow = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.ESCROW;
    const data = await baseService.base(req);

    return res.status(200).send(data);
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const manifestUrl = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.ESCROW;
    const data = await baseService.base(req);

    return res.status(200).send({ data: u8aToString(data.manifest_url) });
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const manifestHash = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.ESCROW;
    const data = await baseService.base(req);

    return res.status(200).send({ data: data.manifest_hash });
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const fundEscrow = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.FUND_ESCROW;
    await baseService.base(req);

    return res.status(200).send({ success: true });
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const storeFinalResults = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.STORE_FINAL_RESULTS;
    await baseService.base(req);

    return res.status(200).send({ success: true });
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const balance = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.BALANCE;
    const data = await baseService.base(req);

    return res.status(200).send({ data: parseInt(data) });
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const abort = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.ABORT;
    await baseService.base(req);

    return res.status(200).send({ success: true });
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const cancel = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.CANCEL;
    await baseService.base(req);

    return res.status(200).send({ success: true });
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const complete = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.COMPLETE;
    await baseService.base(req);

    return res.status(200).send({ success: true });
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const finalResults = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.FINAL_RESULTS;
    const data = await baseService.base(req);

    console.log(JSON.stringify(data));

    // TODO
    return res.status(200).send({ data: "" });
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const intermediateResults = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.FINAL_RESULTS;
    const data = await baseService.base(req);

    console.log(JSON.stringify(data));

    // TODO
    return res.status(200).send({ data: "" });
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const noteIntermediateResults = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.NOTE_INTERMEDIATE_RESULTS;
    const data = await baseService.base(req);

    console.log(JSON.stringify(data));

    // TODO
    return res.status(200).send({ data: "" });
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const launcher = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.ESCROW;
    const data = await baseService.base(req);

    return res.status(200).send({ data: data.canceller });
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};
