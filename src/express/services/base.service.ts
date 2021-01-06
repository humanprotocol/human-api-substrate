import { EscrowId, Job, JobReads, setup } from "../../index";

export const base = async (req: any): Promise<any> => {
  const { functionName } = req.body;

  switch (functionName) {
    case "launch":
      return await launch(req.body);
    case "createEscrow":
      return await createEscrow(req.body);
    case "fundEscrow":
      return await fundEscrow(req.body);
    case "addTrustedHandlers":
      return await addTrustedHandlers(req.body);
    case "bulkPayout":
      return await bulkPayout(req.body);
    case "storeFinalResults":
      return await storeFinalResults(req.body);
    case "abort":
      return await writeNoParams(req.body);
    case "cancel":
      return await writeNoParams(req.body);
    case "noteIntermediateResults":
      return await noteIntermediateResults(req.body);
    case "complete":
      return await writeNoParams(req.body);
    case "escrow":
      return await readNoParams(req.body);
    case "isTrustedHandler":
      return await isTrustedHandler(req.body);
    case "balance":
      return await readNoParams(req.body);
    case "manifest":
      return await manifest(req.body);
    case "intermediateResults":
      return await intermediateResults(req.body);
    case "finalResults":
      return await readNoParams(req.body);
    default:
      throw new Error("invalid function name");
  }
};

const launch = async (body: any): Promise<any> => {
  const { manifest, seed } = body;
  const sender = global.keyring.addFromUri(seed);
  const job = await Job.launch(global.substrate, sender, manifest);

  return { escrowId: job.escrowId };
};

const createEscrow = async (body: any): Promise<any> => {
  const {
    manifestHash,
    manifestUrl,
    recordingOracle,
    recordingOracleStake,
    reputationOracle,
    reputationOracleStake,
    seed,
  } = body;
  const sender = global.keyring.addFromUri(seed);
  const job = await Job.createEscrow(
    global.substrate,
    sender,
    manifestUrl,
    manifestHash,
    reputationOracle,
    recordingOracle,
    reputationOracleStake,
    recordingOracleStake
  );

  return { escrowId: job.escrowId };
};

const addTrustedHandlers = async (body: any) => {
  const { escrowId, handlers, seed } = body;
  const sender = global.keyring.addFromUri(seed);
  const job = new Job(global.substrate, sender, escrowId);

  await job.addTrustedHandlers(handlers);
};

const fundEscrow = async (body: any) => {
  const { amount, escrowAddress, escrowId, seed } = body;
  const sender = global.keyring.addFromUri(seed);
  const job = new Job(global.substrate, sender, escrowId);

  await job.fundEscrow(escrowAddress, amount);
};

const bulkPayout = async (body: any) => {
  const { escrowId, payouts, seed } = body;
  const sender = global.keyring.addFromUri(seed);
  const job = new Job(global.substrate, sender, escrowId);

  await job.bulkPayout(payouts);
};

const storeFinalResults = async (body: any) => {
  const { escrowId, results, seed } = body;
  const sender = global.keyring.addFromUri(seed);
  const job = new Job(global.substrate, sender, escrowId);

  await job.storeFinalResults(results);
};

const writeNoParams = async (body: any) => {
  const { escrowId, functionName, seed } = body;
  const sender = global.keyring.addFromUri(seed);
  const job = new Job(global.substrate, sender, escrowId);
  const functionCall = [functionName] as (keyof typeof job)[];

  await job[`${functionCall}`]();
};

const noteIntermediateResults = async (body: any) => {
  const { escrowId, results, seed } = body;
  const sender = global.keyring.addFromUri(seed);
  const job = new Job(global.substrate, sender, escrowId);

  await job.noteIntermediateResults(results);
};

const readNoParams = async (body: any) => {
  const { escrowId, functionName } = body;
  const job = new JobReads(global.substrate, escrowId);
  const functionCall = [functionName] as (keyof typeof job)[];

  return await job[`${functionCall}`]();
};

const isTrustedHandler = async (body: any) => {
  const { address, escrowId } = body;
  const job = new JobReads(global.substrate, escrowId);

  return await job.isTrustedHandler(address);
};

const manifest = async (body: any) => {
  const { escrowId, url } = body;
  const job = new JobReads(global.substrate, escrowId);

  return await job.manifest(url);
};

const intermediateResults = async (body: any) => {
  const { escrowId, index } = body;
  const job = new JobReads(global.substrate, escrowId);

  return await job.intermediateResults(index);
};