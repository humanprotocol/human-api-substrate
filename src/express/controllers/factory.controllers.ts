import * as baseService from "../services/base.service";

export const create = async (req: any, res: any) => {
  try {
    return res.status(200).send({ data: "0"});
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};

export const get = async (req: any, res: any) => {
  try {
    // TODO: Get all jobs.
    return res.status(200).send({});
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};
