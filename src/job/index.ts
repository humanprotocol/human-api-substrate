import { ApiPromise, Keyring, SubmittableResult } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { Payouts } from '../interfaces'
import { EscrowId, Address, PublicKey, Results, Status, ManifestHash, ManifestUrl, PrivateKey, Manifest } from '../types'
import { sendAndWaitFor } from '../utils/substrate';

//TODO split these classes up into dedicated files

export class JobReads { 
	api: ApiPromise;
	escrowId: EscrowId
	
	constructor (api: ApiPromise, escrowId: EscrowId) {
		this.api = api
		this.escrowId = escrowId
	}

	/**
	 * 
	 * @return Status of the Escrow instance
	 * @dev Retrieves the deployed manifest url uploaded on Job initialization.

	*/
	async status(): Promise<Status>  {
		return "temp"
	}

	/**
	 * 
	 * @return Manifest Url of the escrow instance
	 * @dev Retrieves the deployed manifest url uploaded on Job initialization
	 */
	async manifestUrl(): Promise<ManifestUrl> {
		return "temp"
	}

	/**
	 * 
	 * @return Manifest Hash of the escrow instance
	 * @dev Retrieves the deployed manifest url uploaded on Job initialization
	 */
	async manifestHash(): Promise<ManifestHash> {
		return "temp"
	}

	/**
	 * 
	 * @param address the address of the account queried
	 * @return Boolean
	 * @dev Retrieves if the address is a trusted handler from the escrow instance
	 */
	async isTrustedHandler(address: Address): Promise<Boolean> {
		return true
	}

	/**
	 * @return balance of escrow instance
	 */
	async balance(): Promise<Number> {
		return 4
	}
	/**
	 * @returns address of escrow instance
	 */
	async escrowAddressFromId(): Promise<Address> {
		return "temp"
	}

	/**
	 * @privKey private key of user who encrypted manifest
	 * @manifestUrl The url of the manifest to return
	 * @returns the plain text manifest if can't decrypt 
	 */
	async manifest(manifestUrl: ManifestUrl, privKey: PrivateKey): Promise<Manifest | boolean> {
		// call download()
		// return manifest
	}
	/**
	 * 
	 * @param privKey Private Key of encrypted data
	 * @param index index of intermediate result to get
	 * @returns The manifest or false if can't decrypt 
	 */
	async intermediateResults(privKey: PrivateKey, index: Number): Promise<Manifest | boolean> {
		// handle  intermediate results
		// get the intermediate result at index
		// calls manifest with it
	}
	
	/**
	 * 
	 * @param privKey Private Key of encrypted data
	 * @returns The manifest or false if can't decrypt 
	 */
	async finalResults(privKey: PrivateKey): Promise<Manifest | Boolean> {
		// call manifest with final result
	}
}

export class Job extends JobReads {
  keyring: Keyring;

  constructor(api: ApiPromise, escrowId: EscrowId, keyring: Keyring) {
    super(api, escrowId);
    this.keyring = keyring;
  }

  static async launch(): Promise<Boolean> {
	// calls upload returns hash and url
	// get info from manifest
    // reputation_oracle_stake from manifest (make sure it is in right format)
    // recording_oracle_stake from manifest (make sure it is in right format)
    // amount int(int(manifest["job_total_tasks"]) * Decimal(manifest["task_bid_price"]))
    // hmt amount is amount 1e18 (now 1e12 or we change chain decimals)
    // creates escrow()
    return true;
  }

  /**
   * Create an escrow on chain and return a new Job instance to interact with.
   * @param api object for interacting with the chain
   * @param keyring used for signing
   * @param sender sender of the transaction to create the escrow
   * @param manifestUrl 
   * @param manifestHash 
   * @param reputationOracle account id of the reputation oracle
   * @param recordingOracle account id of the recording oracle
   * @param oracleStake oracle fees
   */
  static async createEscrow(
    api: ApiPromise,
    keyring: Keyring,
    sender: KeyringPair,
    manifestUrl: String,
    manifestHash: String,
    reputationOracle: Address,
    recordingOracle: Address,
    oracleStake: Number
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
        const id: EscrowId = Number(record.event.data[0].toString());
        return id;
      })
      .then((id: EscrowId) => {
        return new Job(api, id, keyring);
      });
  }

  async addTrustedHandlers(handlers: Array<Address>, escrowId?: EscrowId): Promise<Boolean> {
    // add trusted handler from credential PK
    return true;
  }

  async bulkPayout(
    payouts: Array<Payouts>,
    results: Results,
    pubKey: PublicKey,
    escrowId?: EscrowId
  ): Promise<Boolean> {
    // if escrow Id use, if not use this.escrowId
    // uploads results to url
    // calls bulk payout batched with upload function
    return true;
  }

  async abort(escrowId?: EscrowId): Promise<Boolean> {
    // if escrow Id use, if not use this.escrowId
    // calls abort from original gas payer
    return true;
  }

  async cancel(escrowId?: EscrowId): Promise<Boolean> {
    // if escrow Id use, if not use this.escrowId
    // calls cancel from original gas payer
    return true;
  }

  async storeIntermediateResults(results: Results, pubKey: PublicKey, escrowId?: EscrowId): Promise<Boolean> {
    // uploads to S3 the encrypted results
    // if escrow Id use, if not use this.escrowId
    // calls intermediate results
    // stores it this.intermediateResults = []
    return true;
  }

  async complete(escrowId?: EscrowId): Promise<Boolean> {
    // if escrow Id use, if not use this.escrowId
    // sets state to complete
    return true;
  }
}
