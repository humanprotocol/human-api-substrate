import * as yup from "yup";

import { Job, JobReads } from "../../index";
import * as constants from "../config/constants";

export const base = async (req: any): Promise<any> => {
  const { functionName } = req.body;

  switch (functionName) {
    case constants.LAUNCH:
      return await launch(req.body);
    case constants.CREATE_ESCROW:
      return await createEscrow(req.body);
    case constants.FUND_ESCROW:
      return await fundEscrow(req.body);
    case constants.ADD_TRUSTED_HANDLERS:
      return await addTrustedHandlers(req.body);
    case constants.BULK_PAYOUT:
      return await bulkPayout(req.body);
    case constants.STORE_FINAL_RESULTS:
      return await storeFinalResults(req.body);
    case constants.ABORT:
      return await writeNoParams(req.body);
    case constants.CANCEL:
      return await writeNoParams(req.body);
    case constants.NOTE_INTERMEDIATE_RESULTS:
      return await noteIntermediateResults(req.body);
    case constants.COMPLETE:
      return await writeNoParams(req.body);
    case constants.ESCROW:
      return await readNoParams(req.body);
    case constants.IS_TRUSTED_HANDLER:
      return await isTrustedHandler(req.body);
    case constants.BALANCE:
      return await readNoParams(req.body);
    case constants.MANIFEST:
      return await manifest(req.body);
    case constants.FINAL_RESULTS:
      return await readNoParams(req.body);
    default:
      throw new Error("Invalid function name.");
  }
};

const launchSchema = yup.object().shape({
  manifest: yup.object().required(),
  seed: yup.string().required(),
});

const launch = async (body: any): Promise<any> => {
  await launchSchema.validate(body);
  const { manifest, seed } = body;
  const sender = global.keyring.addFromUri(seed);
  const job = await Job.launch(global.substrate, sender, manifest);

  return { escrowId: job.escrowId };
};

const createEscrowSchema = yup.object().shape({
  manifestHash: yup.string().required(),
  manifestUrl: yup.string().required(),
  recordingOracle: yup.string().required(),
  recordingOracleStake: yup.string().required(),
  reputationOracle: yup.string().required(),
  reputationOracleStake: yup.string().required(),
  seed: yup.string().required(),
});

const createEscrow = async (body: any): Promise<any> => {
  await createEscrowSchema.validate(body);
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

const addTrustedHandlersSchema = yup.object().shape({
  escrowId: yup.string().required(),
  handlers: yup.array().required(),
  seed: yup.string().required(),
});

const addTrustedHandlers = async (body: any) => {
  await addTrustedHandlersSchema.validate(body);
  const { escrowId, handlers, seed } = body;
  const sender = global.keyring.addFromUri(seed);
  const job = new Job(global.substrate, sender, escrowId);

  await job.addTrustedHandlers(handlers);
};

const fundEscrowSchema = yup.object().shape({
  escrowId: yup.string().required(),
  escrowAddress: yup.string().required(),
  seed: yup.string().required(),
  amount: yup.string().required(),
});

const fundEscrow = async (body: any) => {
  await fundEscrowSchema.validate(body);
  const { amount, escrowAddress, escrowId, seed } = body;
  const sender = global.keyring.addFromUri(seed);
  const job = new Job(global.substrate, sender, escrowId);

  await job.fundEscrow(escrowAddress, amount);
};

const bulkPayoutSchema = yup.object().shape({
  escrowId: yup.string().required(),
  payouts: yup.object().required(),
  seed: yup.string().required(),
});

const bulkPayout = async (body: any) => {
  await bulkPayoutSchema.validate(body);
  const { escrowId, payouts, seed } = body;
  const sender = global.keyring.addFromUri(seed);
  const job = new Job(global.substrate, sender, escrowId);

  await job.bulkPayout(payouts);
};

const storeFinalResultsSchema = yup.object().shape({
  escrowId: yup.string().required(),
  results: yup.object().required(),
  seed: yup.string().required(),
});

const storeFinalResults = async (body: any) => {
  await storeFinalResultsSchema.validate(body);
  const { escrowId, results, seed } = body;
  const sender = global.keyring.addFromUri(seed);
  const job = new Job(global.substrate, sender, escrowId);

  await job.storeFinalResults(results);
};

const writeNoParamsSchema = yup.object().shape({
  escrowId: yup.string().required(),
  functionName: yup.string().required(),
  seed: yup.string().required(),
});

const writeNoParams = async (body: any) => {
  await writeNoParamsSchema.validate(body);
  const { escrowId, functionName, seed } = body;
  const sender = global.keyring.addFromUri(seed);
  const job = new Job(global.substrate, sender, escrowId);
  const functionCall = [functionName] as (keyof typeof job)[];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await job[`${functionCall}`]();
};

const noteIntermediateResultsSchema = yup.object().shape({
  escrowId: yup.string().required(),
  results: yup.object().required(),
  seed: yup.string().required(),
});

const noteIntermediateResults = async (body: any) => {
  await noteIntermediateResultsSchema.validate(body);
  const { escrowId, results, seed } = body;
  const sender = global.keyring.addFromUri(seed);
  const job = new Job(global.substrate, sender, escrowId);

  await job.noteIntermediateResults(results);
};

const readNoParamsSchema = yup.object().shape({
  escrowId: yup.string().required(),
  functionName: yup.string().required(),
});

const readNoParams = async (body: any) => {
  await readNoParamsSchema.validate(body);
  const { escrowId, functionName } = body;
  const job = new JobReads(global.substrate, escrowId);
  const functionCall = [functionName] as (keyof typeof job)[];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return await job[`${functionCall}`]();
};

const isTrustedHandlerSchema = yup.object().shape({
  escrowId: yup.string().required(),
  address: yup.string().required(),
});

const isTrustedHandler = async (body: any) => {
  await isTrustedHandlerSchema.validate(body);
  const { address, escrowId } = body;
  const job = new JobReads(global.substrate, escrowId);

  return await job.isTrustedHandler(address);
};

const manifestSchema = yup.object().shape({
  manifestUrl: yup.string().required(),
});

const manifest = async (body: any) => {
  await manifestSchema.validate(body);
  const { manifestUrl } = body;
  const job = new JobReads(global.substrate, 0);

  return await job.manifest(manifestUrl);
};
