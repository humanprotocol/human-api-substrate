import BN from "bn.js";

import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { KeyringPair } from "@polkadot/keyring/types";
import { AccountId, Balance } from "@polkadot/types/interfaces";

import { Manifest, Payouts } from "../interfaces";
import { upload } from "../storage";
import { EscrowId, FactoryId, PublicKey } from "../types";
import {
  formatDecimals,
  sendAndWait,
  sendAndWaitFor,
} from "../utils/substrate";
import JobReads from "./jobReads";

export default class Job extends JobReads {
  sender: KeyringPair;

  /**
   * Construct a new Job instance to interact with the escrow on chain identified by the id.
   * @param api polkadot-js api object
   * @param sender keyring pair for signing messages
   * @param escrowId id of the escrow to interact with
   */
  constructor(
    api: ApiPromise,
    sender: KeyringPair,
    escrowId: EscrowId | number
  ) {
    super(api, escrowId);
    this.sender = sender;
  }

  /**
   * Create a new empty factory.
   * @param api object for interacting with the chain
   * @param sender sender of the transaction to create the escrow
   * @returns the factory Id of the created factory.
   */
  static async createFactory(
    api: ApiPromise,
    sender: KeyringPair
  ): Promise<FactoryId> {
    const call: SubmittableExtrinsic<"promise"> = api.tx.escrow.createFactory();
    const record = await sendAndWaitFor(api, call, sender, {
      section: "escrow",
      name: "FactoryCreated",
    });
    const id: FactoryId = api.createType("FactoryId", record.event.data[0]);

    return id;
  }

  /**
   * Launches a new job by uploading the manifest and creating an escrow instance on-chain.
   * Will also fund the escrow and return the Job instance.
   * @param api object for interacting with the chain
   * @param sender sender of the transaction to create the escrow
   * @param manifest The manifest to derive the information to create the escrow
   * @param pubKey optional pub key to encrypt the manifest
   * @returns a new Job class
   */
  static async launch(
    api: ApiPromise,
    sender: KeyringPair,
    manifest: Manifest,
    factoryId: FactoryId,
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
      factoryId,
      reputationOracle,
      recordingOracle,
      oracleStake,
      oracleStake
    );
    const escrow = await job.escrow();

    await job.fundEscrow(escrow.account, formattedAmount).catch((e) => {
      const err = new Error(
        `Escrow ${job.escrowId} created but not funded: '${e.message}'`
      );

      err.name = e.name;
      throw err;
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
   * @param reputationOracleStake reputation oracle fees
   * @param recordingOracleStake recording oracle fees
   * @returns a new Job class
   */
  static async createEscrow(
    api: ApiPromise,
    sender: KeyringPair,
    manifestUrl: string,
    manifestHash: string,
    factoryId: FactoryId,
    reputationOracle: AccountId | string,
    recordingOracle: AccountId | string,
    reputationOracleStake: BN | number,
    recordingOracleStake: BN | number
  ): Promise<Job> {
    const call: SubmittableExtrinsic<"promise"> = api.tx.escrow.create(
      manifestUrl,
      manifestHash,
      factoryId,
      reputationOracle,
      recordingOracle,
      reputationOracleStake,
      recordingOracleStake
    );
    const record = await sendAndWaitFor(api, call, sender, {
      section: "escrow",
      name: "Pending",
    });
    const id: EscrowId = api.createType("EscrowId", record.event.data[0]);

    return new Job(api, sender, id);
  }

  /**
   * Transfer funds from the job creator to the job's escrow account.
   * @param escrowAddress the address associated with the escrow
   * @param amount the amount to fund the escrow with
   */
  async fundEscrow(
    escrowAddress: AccountId | string,
    amount: Balance | BN | number
  ) {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.balances.transfer(
      escrowAddress,
      amount
    );

    await sendAndWaitFor(this.api, call, this.sender, {
      section: "balances",
      name: "Transfer",
    });
  }

  /**
   * Add the given accounts as trusted handlers (privileged accounts).
   * @param handlers an array of handlers to add
   */
  async addTrustedHandlers(handlers: Array<AccountId> | Array<string>) {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.addTrustedHandlers(
      this.escrowId,
      handlers
    );

    await sendAndWait(this.api, call, this.sender);
  }

  /**
   * Pay out the given amounts to the specified accounts, subtracting oracle fees.
   * @param payouts a payout object to determine the addresses and amount to payout to
   */
  async bulkPayout(payouts: Payouts) {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.bulkPayout(
      this.escrowId,
      payouts.addresses,
      payouts.amounts
    );

    await sendAndWaitFor(this.api, call, this.sender, {
      section: "escrow",
      name: "BulkPayout",
    });
  }

  /**
   * Upload results to S3 and store the url and hash on-chain.
   * @param results the results object
   * @param pubKey optional pub key to encrypt the results with
   */
  async storeFinalResults(results: any, pubKey?: PublicKey) {
    const resultInfo = await upload(results, pubKey);

    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.storeFinalResults(
      this.escrowId,
      resultInfo.url,
      resultInfo.hash
    );

    await sendAndWait(this.api, call, this.sender).catch((e) => {
      const err = new Error(
        `Results stored at ${resultInfo.url}, but failed to post on blockchain: '${e.message}'`
      );

      err.name = e.name;
      throw err;
    });
  }

  /**
   * Abort the escrow process. Funds will be refunded.
   */
  async abort() {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.abort(
      this.escrowId
    );

    await sendAndWait(this.api, call, this.sender);
  }

  /**
   * Set the escrow to cancelled and refund any remaining funds.
   */
  async cancel() {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.cancel(
      this.escrowId
    );

    await sendAndWaitFor(this.api, call, this.sender, {
      section: "balances",
      name: "Transfer",
    });
  }

  /**
   * Upload results to S3 and emit an event with the url and hash on-chain to register the results.
   * Note: Will not store the result on-chain in pallet storage.
   * @param results the results object
   * @param pubKey optional pub key to encrypt the results with
   */
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
      const err = new Error(
        `Results stored at ${resultInfo.url}, but failed to post on blockchain: '${e.message}'`
      );

      err.name = e.name;
      throw err;
    });

    this.storedIntermediateResults.push({
      url: record.event.data[1].toHuman(),
      hash: record.event.data[2].toHuman(),
    });
  }

  /**
   * Mark the escrow as complete on-chain. Only possible once it is in `Paid` state.
   */
  async complete() {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.complete(
      this.escrowId
    );

    await sendAndWait(this.api, call, this.sender);
  }
}
