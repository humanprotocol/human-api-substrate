export const create = (req: any, res: any) => {
  try {
    return res.status(200).send({ data: "0" });
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};

export const get = (req: any, res: any) => {
  try {
    // TODO: Get all jobs.
    return res.status(200).send({ });
  } catch (e) {
    console.log(e.message);

    return res.status(500).send(e.message);
  }
};
