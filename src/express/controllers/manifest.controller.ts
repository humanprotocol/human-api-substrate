import * as constants from "../config/constants";
import { APIError, handleError } from "../middleware/errorHandler";
import * as baseService from "../services/base.service";

export const validate = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.MANIFEST;
    const data = await baseService.base(req);

    return res.status(200).send(data);
  } catch (e) {
    const error: APIError = handleError(e);

    return res.status(error.status).send(error.err);
  }
};
