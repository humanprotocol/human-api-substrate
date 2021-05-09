import * as constants from "../config/constants";
import * as baseService from "../services/base.service";

export const create = (req: any, res: any) => {
  try {
    // TODO: Check if address should be replaced with polling_url.
    return res.status(200).send({ address: 0 });
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};

export const get = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.ALL_JOBS;
    const data = await baseService.base(req);

    return res.status(200).send({ jobs: data });
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};
