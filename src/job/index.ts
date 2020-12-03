import { ApiPromise, Keyring, SubmittableResult } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';
import BN from 'bn.js';
import { Payouts } from '../interfaces'
import { EscrowId, Address, PublicKey, Results, Status, Hash, Url, PrivateKey, Manifest, Stake, Amount } from '../types'
import { sendAndWaitFor, formatDecimals } from '../utils/substrate';
import { upload, download } from '../storage'

//TODO split these classes up into dedicated files

export class JobReads { 
	api: ApiPromise;
	escrowId: EscrowId;
	finalUrl: Manifest;
	storedIntermediateResults: any;

	constructor (api: ApiPromise, escrowId: EscrowId) {
		this.api = api
		this.escrowId = escrowId
		this.storedIntermediateResults = []
	}

	async escrow(): Promise<any> {
		const escrow = await this.api.query.escrow.escrows(this.escrowId)
		return escrow.toJSON()
	}

	/**
	 * 
	 * @param address the address of the account queried
	 * @return Boolean
	 * @dev Retrieves if the address is a trusted handler from the escrow instance
	 */
	async isTrustedHandler(address: Address): Promise<any> {
		const isTrustedHander = await this.api.query.escrow.trustedHandlers(this.escrowId, address.toString())
		return isTrustedHander.toHuman()
	}

	/**
	 * @return balance of escrow instance
	 */
	async balance(): Promise<BN> {
		const escrow = await this.escrow()
		const balance = await this.api.query.system.account(escrow.account)
		return balance.data.free
	}
	
	/**
	 * @param privKey private key of user who encrypted manifest
	 * @param manifestUrl The url of the manifest to return
	 * @returns the plain text manifest or error if can't decrypt 
	 */
	async manifest(url: Url, privKey?: PrivateKey): Promise<Manifest> {
		return download(url, privKey)
	}
	/**
	 * 
	 * @param privKey Private Key of encrypted data
	 * @param index index of intermediate result to get
	 * @returns The manifest or error if can't decrypt 
	 */
	public async intermediateResults(index: any, privKey?: PrivateKey): Promise<Manifest> {
    if (!this.storedIntermediateResults[index]) {
      throw new Error("Intermediate Results out of bounds")
    }
    // TODO test this when able to (writes complete)
		return this.manifest(this.storedIntermediateResults[index].url, privKey)
	}
	
	/**
	 * 
	 * @param privKey Private Key of encrypted data
	 * @returns The manifest, error if can't decrypt error if no final results
	 */
	public async finalResults(privKey?: PrivateKey): Promise<Manifest> {
    if (this.finalUrl) {
      //TODO test this case after writes are able to demo
      return this.manifest(this.finalUrl, privKey)
    } 
    throw new Error("No final results")
	}
}

export class Job extends JobReads {
  sender: KeyringPair;
  finalUrl: Url | null;
  storedIntermediateResults: any;
  amount: BN | null;

  constructor(api: ApiPromise, sender: KeyringPair, escrowId: EscrowId) {
    super(api, escrowId);
    this.sender = sender;
    this.finalUrl = null;
    this.amount = null
  }

  static async launch(api: ApiPromise, sender: KeyringPair, manifest: Manifest, pubKey?: PublicKey): Promise<Job> {
    const reputationOracle = manifest.reputation_oracle_addr
    const recordingOracle = manifest.recording_oracle_addr
    const oracleStake = new BN(manifest.oracle_stake * 100)
    const amount = manifest.job_total_tasks * manifest.task_bid_price
    const formattedAmount = formatDecimals(api, amount)
    const manifestInfo = await upload(manifest, pubKey) 
    const job = await this.createEscrow(api, sender, manifestInfo.url, manifestInfo.hash, reputationOracle, recordingOracle, oracleStake)
    const escrow = await job.escrow()
    await job.fundEscrow(escrow.account, formattedAmount)
    return job
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
        const id: EscrowId | any = record ? new BN(record.event.data[0].toString()) :  new Error("failed transaction")
        return id;
      })
      .then((id: EscrowId) => {
        return new Job(api, sender, id);
      });
  }

  async fundEscrow(escrowAddress: Address, amount: Amount): Promise<Boolean> {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.balances.transfer(escrowAddress.toString(), amount)
    await sendAndWaitFor(this.api, call, this.sender, {section: "balances", name: "Transfer"})
    return true 
  }

  async addTrustedHandlers(handlers: Array<Address>): Promise<Boolean> {
    // add trusted handler from credential PK
    return true;
  }

  async bulkPayout(
    payouts: Payouts,
    results?: Results,
    pubKey?: PublicKey,
  ): Promise<Boolean> {
    let resultInfo
    if (results) {
       resultInfo = await upload(results, pubKey)
       this.finalUrl = resultInfo.url
       // push final url onto global results
    }
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.bulkPayout(this.escrowId, payouts.addresses, payouts.amounts, resultInfo?.url, resultInfo?.hash, "1")
    await sendAndWaitFor(this.api, call, this.sender,  {section: "escrow", name: "BulkPayout"})
    return true;
  }

  async abort(): Promise<Boolean> {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.abort(this.escrowId)
    await sendAndWaitFor(this.api, call, this.sender,  {section: "balances", name: "Transfer"})
    return true;
  }

  async cancel(): Promise<Boolean> {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.cancel(this.escrowId)
    await sendAndWaitFor(this.api, call, this.sender,  {section: "balances", name: "Transfer"})
    return true;
  }

  async storeIntermediateResults(results: Results, pubKey?: PublicKey): Promise<Boolean> {
    const resultInfo = await upload(results, pubKey)
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.storeResults(this.escrowId, resultInfo.url, resultInfo.hash)
    const record = await sendAndWaitFor(this.api, call, this.sender,  {section: "escrow", name: "IntermediateStorage"})
    this.storedIntermediateResults.push({url: record?.event.data[1].toHuman(), hash: record?.event.data[2].toHuman()})
    return true;
  }

  async complete(): Promise<Boolean> {
    const call: SubmittableExtrinsic<"promise"> = this.api.tx.escrow.complete(this.escrowId)
    await sendAndWaitFor(this.api, call, this.sender)
    return true;
  }
}
