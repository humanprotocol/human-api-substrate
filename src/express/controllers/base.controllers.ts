import * as baseService from "../services/base.service";

export const base = async (req: any, res: any) => {
  try {
    const data = await baseService.base(req);

    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};
