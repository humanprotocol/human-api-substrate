import BN from "bn.js";

import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { KeyringPair } from "@polkadot/keyring/types";
import { AccountId, Balance } from "@polkadot/types/interfaces";

import { Manifest, Payouts } from "../interfaces";
import { upload } from "../storage";
import { EscrowId } from "../typegen/src/interfaces";
import { PublicKey } from "../types";
import {
  formatDecimals,
  sendAndWait,
  sendAndWaitFor,
} from "../utils/substrate";
import JobReads from "./jobReads";

export default class Job extends JobReads {
  sender: KeyringPair;

  constructor(api: ApiPromise, sender: KeyringPair, escrowId: EscrowId) {
    super(api, escrowId);
    this.sender = sender;
  }

  static async launch(
    api: ApiPromise,
    sender: KeyringPair,
    manifest: Manifest,
    pubKey?: PublicKey
  ): Promise<Job> {
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

    await job.fundEscrow(escrow.account, formattedAmount).catch((e) => {
      throw new Error(
        `Escrow ${job.escrowId} created but not funded: '${e.message}'`
      );
    });

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
    manifestUrl: string,
    manifestHash: string,
    reputationOracle: AccountId | string,
    recordingOracle: AccountId | string,
    oracleStake: BN | number
  ): Promise<Job> {
    const call: SubmittableExtrinsic<"promise"> = api.tx.escrow.create(
      manifestUrl,
      manifestHash,
      reputationOracle,
      recordingOracle,
      oracleStake,
      oracleStake
    );
    const record = await sendAndWaitFor(api, call, sender, {
      section: "escrow",
      name: "Pending",
    }).catch((e) => {
      throw new Error(e.message);
    });
    const id: EscrowId = api.createType("EscrowId", record.event.data[0]);

    return new Job(api, sender, id);
  }

  async fundEscrow(escrowAddress: AccountId | string, amount: Balance | BN | number) {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.balances.transfer(
      escrowAddress,
      amount
    );

    await sendAndWaitFor(this.api, call, this.sender, {
      section: "balances",
      name: "Transfer",
    });
  }

  async addTrustedHandlers(handlers: Array<AccountId> | Array<string>) {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.addTrustedHandlers(
      this.escrowId,
      handlers
    );

    await sendAndWait(this.api, call, this.sender).catch((e) => {
      throw new Error(e.message);
    });
  }

  async bulkPayout(payouts: Payouts) {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.bulkPayout(
      this.escrowId,
      payouts.addresses,
      payouts.amounts
    );

    await sendAndWaitFor(this.api, call, this.sender, {
      section: "escrow",
      name: "BulkPayout",
    }).catch((e) => {
      throw new Error(e.message);
    });
  }

  async storeFinalResults(results: any, pubKey?: PublicKey) {
    const resultInfo = await upload(results, pubKey);

    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.storeFinalResults(
      this.escrowId,
      resultInfo.url,
      resultInfo.hash
    );

    await sendAndWait(this.api, call, this.sender).catch((e) => {
      throw new Error(
        `Results stored at ${resultInfo.url}, but failed to post on blockchain: '${e.message}'`
      );
    });
  }

  async abort() {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.abort(
      this.escrowId
    );

    await sendAndWaitFor(this.api, call, this.sender, {
      section: "balances",
      name: "Transfer",
    }).catch((e) => {
      throw new Error(e.message);
    });
  }

  async cancel() {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.cancel(
      this.escrowId
    );

    await sendAndWaitFor(this.api, call, this.sender, {
      section: "balances",
      name: "Transfer",
    }).catch((e) => {
      throw new Error(e.message);
    });
  }

  async noteIntermediateResults(results: any, pubKey?: PublicKey) {
    const resultInfo = await upload(results, pubKey);
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.noteIntermediateResults(
      this.escrowId,
      resultInfo.url,
      resultInfo.hash
    );
    const record = await sendAndWaitFor(this.api, call, this.sender, {
      section: "escrow",
      name: "IntermediateResults",
    }).catch((e) => {
      throw new Error(
        `Results stored at ${resultInfo.url}, but failed to post on blockchain: '${e.message}'`
      );
    });

    this.storedIntermediateResults.push({
      url: record.event.data[1].toHuman(),
      hash: record.event.data[2].toHuman(),
    });
  }

  async complete() {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.complete(
      this.escrowId
    );

    await sendAndWait(this.api, call, this.sender).catch((e) => {
      throw new Error(e.message);
    });
  }
}
