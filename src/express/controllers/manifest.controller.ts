import * as baseService from "../services/base.service";
import * as constants from "../config/constants";

export const validate = async (req: any, res: any) => {
  try {
    req.body.functionName = constants.MANIFEST;
    const data = await baseService.base(req);
    return res.status(200).send({data});
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};
