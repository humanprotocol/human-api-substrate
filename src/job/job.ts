import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { KeyringPair } from "@polkadot/keyring/types";
import BN from "bn.js";
import { Payouts } from "../interfaces";
import { EscrowId, Address, PublicKey, Results, Url, Manifest, Stake, Amount } from "../types";
import { sendAndWaitFor, formatDecimals, sendAndWait } from "../utils/substrate";
import { upload } from "../storage";
import JobReads from "./jobReads";

export default class Job extends JobReads {
  sender: KeyringPair;

  constructor(api: ApiPromise, sender: KeyringPair, escrowId: EscrowId) {
    super(api, escrowId);
    this.sender = sender;
  }

  static async launch(api: ApiPromise, sender: KeyringPair, manifest: Manifest, pubKey?: PublicKey): Promise<Job> {
    const reputationOracle = manifest.reputation_oracle_addr;
    const recordingOracle = manifest.recording_oracle_addr;
    const oracleStake = new BN(manifest.oracle_stake * 100);
    const amount = manifest.job_total_tasks * manifest.task_bid_price;
    const formattedAmount = formatDecimals(api, amount);
    const manifestInfo = await upload(manifest, pubKey);
    const job = await this.createEscrow(
      api,
      sender,
      manifestInfo.url,
      manifestInfo.hash,
      reputationOracle,
      recordingOracle,
      oracleStake
    );
    const escrow = await job.escrow();
    await job.fundEscrow(escrow.account, formattedAmount);
    return job;
  }

  /**
   * Create an escrow on chain and return a new Job instance to interact with.
   * @param api object for interacting with the chain
   * @param sender sender of the transaction to create the escrow
   * @param manifestUrl
   * @param manifestHash
   * @param reputationOracle account id of the reputation oracle
   * @param recordingOracle account id of the recording oracle
   * @param oracleStake oracle fees
   */
  static async createEscrow(
    api: ApiPromise,
    sender: KeyringPair,
    manifestUrl: String,
    manifestHash: String,
    reputationOracle: Address,
    recordingOracle: Address,
    oracleStake: Stake
  ): Promise<Job> {
    const call: SubmittableExtrinsic<"promise"> = api.tx.escrow.create(
      manifestUrl,
      manifestHash,
      reputationOracle,
      recordingOracle,
      oracleStake,
      oracleStake
    );

    return sendAndWaitFor(api, call, sender, { section: "escrow", name: "Pending" })
      .then((record) => {
        // The first element in the `Pending` event is the escrow id.
        // Note: This is note type safe in any way. Todo: Find more principled way.
        const id: EscrowId = new BN(record.event.data[0].toString());
        return id;
      })
      .then((id: EscrowId) => {
        return new Job(api, sender, id);
      });
  }

  async fundEscrow(escrowAddress: Address, amount: Amount): Promise<Boolean> {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.balances.transfer(escrowAddress.toString(), amount);
    await sendAndWaitFor(this.api, call, this.sender, { section: "balances", name: "Transfer" });
    return true;
  }

  async addTrustedHandlers(handlers: Array<Address>): Promise<Boolean> {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.addTrustedHandlers(this.escrowId, handlers);
    await sendAndWait(this.api, call, this.sender);
    return true;
  }

  async bulkPayout(payouts: Payouts): Promise<Boolean> {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.bulkPayout(
      this.escrowId,
      payouts.addresses,
      payouts.amounts
    );
    await sendAndWaitFor(this.api, call, this.sender, { section: "escrow", name: "BulkPayout" });
    return true;
  }

  async storeFinalResults(results: Results, pubKey?: PublicKey): Promise<Boolean> {
    const resultInfo = await upload(results, pubKey);
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.storeFinalResults(
      this.escrowId,
      resultInfo.url,
      resultInfo.hash
    );
    await sendAndWait(this.api, call, this.sender);
    return true;
  }

  async abort(): Promise<Boolean> {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.abort(this.escrowId);
    await sendAndWaitFor(this.api, call, this.sender, { section: "balances", name: "Transfer" });
    return true;
  }

  async cancel(): Promise<Boolean> {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.cancel(this.escrowId);
    await sendAndWaitFor(this.api, call, this.sender, { section: "balances", name: "Transfer" });
    return true;
  }

  async noteIntermediateResults(results: Results, pubKey?: PublicKey): Promise<Boolean> {
    const resultInfo = await upload(results, pubKey);
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.noteIntermediateResults(
      this.escrowId,
      resultInfo.url,
      resultInfo.hash
    );
    const record = await sendAndWaitFor(this.api, call, this.sender, {
      section: "escrow",
      name: "IntermediateResults",
    });
    this.storedIntermediateResults.push({ url: record.event.data[1].toHuman(), hash: record.event.data[2].toHuman() });
    return true;
  }

  async complete(): Promise<Boolean> {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.complete(this.escrowId);
    await sendAndWait(this.api, call, this.sender);
    return true;
  }
}
