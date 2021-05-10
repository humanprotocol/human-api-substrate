import * as constants from "../config/constants";
import { APIError, handleError } from "../middleware/errorHandler";
import * as baseService from "../services/base.service";

export const create = (req: any, res: any) => {
  try {
    // TODO: Check if address should be replaced with polling_url.
    return res.status(200).send({ address: 0 });
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};

export const get = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.ALL_JOBS;
    const data = await baseService.base(req);

    return res.status(200).send({ jobs: data });
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};
