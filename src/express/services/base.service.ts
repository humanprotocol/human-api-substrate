import { Keyring } from "@polkadot/api";
import { Job, JobReads, setup, EscrowId } from "../../index";

export const base = async (req: any): Promise<any> => {
  const { functionName } = req.body

  switch (functionName){ 
    case "launch": 
      return await launch(req.body)
    case "createEscrow":
      return await createEscrow(req.body)
    default: 
      throw new Error("invalid function name") 
  }
};


const launch = async (body: any): Promise<any> => {
  const {seed, manifest} = body
  const sender = global.keyring.addFromUri(seed)
  const job = await Job.launch(global.substrate, sender, manifest)
  return {escrowId: job.escrowId}
}

const createEscrow = async (body: any): Promise<any> => {
  const {manifestUrl, manifestHash, reputationOracle, recordingOracle, reputationOracleStake, recordingOracleStake, seed} = body
  const sender = global.keyring.addFromUri(seed)
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
  return {escrowId: job.escrowId}
}