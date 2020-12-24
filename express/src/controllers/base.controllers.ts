import * as baseService from "../services/base.service";

export const test = (req: any, res: any) => {
  try {
    const data = baseService.test(req);

    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};
