import * as constants from "../config/constants";
import { APIError, handleError } from "../middleware/errorHandler";
import * as baseService from "../services/base.service";

export const create = async (req: any, res: any) => {
  try {
    // TODO: Check if address should be replaced with polling_url.
    req.body.functionName = constants.CREATE_FACTORY;
    const data = await baseService.base(req);

    return res.status(200).send(data);
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
