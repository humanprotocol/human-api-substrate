import { u8aToString } from "@polkadot/util";

import * as constants from "../config/constants";
import * as baseService from "../services/base.service";

export const create = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.CREATE_ESCROW;
    const data = await baseService.base(req);

    return res.status(200).send(data);
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};

export const storeIntermediateResults = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.NOTE_INTERMEDIATE_RESULTS;
    const data = await baseService.base(req);

    return res.status(200).send(data);
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};

export const bulkPayout = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.BULK_PAYOUT;
    const data = await baseService.base(req);

    return res.status(200).send(data);
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};

export const addTrustedHandlers = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.ADD_TRUSTED_HANDLERS;
    const data = await baseService.base(req);

    return res.status(200).send(data);
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};

export const status = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.ESCROW;
    const data = await baseService.base(req);

    return res.status(200).send({ status: data.status });
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};

export const manifestUrl = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.ESCROW;
    const data = await baseService.base(req);

    return res.status(200).send({ data: u8aToString(data.manifest_url) });
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};

export const manifestHash = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.ESCROW;
    const data = await baseService.base(req);

    return res.status(200).send({ data: data.manifest_hash });
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};

export const balance = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.BALANCE;
    const data = await baseService.base(req);

    return res.status(200).send({ data: parseInt(data) });
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};

export const abort = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.ABORT;
    const data = await baseService.base(req);

    console.log(JSON.stringify(data));

    // TODO
    return res.status(200).send({ data: "" });
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};

export const cancel = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.CANCEL;
    const data = await baseService.base(req);

    console.log(JSON.stringify(data));

    // TODO
    return res.status(200).send({ data: "" });
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};

export const complete = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.COMPLETE;
    const data = await baseService.base(req);

    console.log(JSON.stringify(data));

    // TODO
    return res.status(200).send({ data: "" });
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
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
    console.log(e.message);

    return res.status(500).send(e.message);
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
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};

export const launcher = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.ESCROW;
    const data = await baseService.base(req);

    return res.status(200).send({ data: data.canceller });
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};
