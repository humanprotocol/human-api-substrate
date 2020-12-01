import { ApiPromise, Keyring } from '@polkadot/api'
import { KeyringPair } from '@polkadot/keyring/types';
import { Credentials, Payouts, EscrowInfo } from '../interfaces'
import BN from 'bn.js';
import { EscrowId, Address, PublicKey, Results, Status, ManifestHash, ManifestUrl, PrivateKey, Manifest } from '../types'

function signAndSend(call: any, api: ApiPromise, sender: any) {
	return call.signAndSend(sender, ({ status, events, dispatchError }: any) => {
		// status would still be set, but in the case of error we can shortcut
		// to just check it (so an error would indicate InBlock or Finalized)
		if (dispatchError) {
			if (dispatchError.isModule) {
			// for module errors, we have the section indexed, lookup
			const decoded = api.registry.findMetaError(dispatchError.asModule);
			const { documentation, name, section } = decoded;

				console.log(`${section}.${name}: ${documentation.join(" ")}`);
			} else {
			// Other, CannotLookup, BadOrigin, no extra info
				console.log(dispatchError.toString());
			}
		} else {
			if (status.isFinalized) {
				console.log("transaction successful");
			}
		}
	});
}

//TODO split these classes up into dedicated files
export class JobReads { 
	api: ApiPromise;
	escrowId: EscrowId
	
	constructor (api: ApiPromise, escrowId: EscrowId) {
		this.api = api
		this.escrowId = escrowId
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
	 * @returns the plain text manifest if can't decrypt 
	 */
	async manifest(manifestUrl: ManifestUrl, privKey?: PrivateKey): Promise<Manifest | boolean> {
		// call download()
		// return manifest
	}
	/**
	 * 
	 * @param privKey Private Key of encrypted data
	 * @param index index of intermediate result to get
	 * @returns The manifest or false if can't decrypt 
	 */
	async intermediateResults(index: Number, privKey?: PrivateKey): Promise<Manifest | boolean> {
		// handle  intermediate results
		// get the intermediate result at index
		// calls manifest with it
	}
	
	/**
	 * 
	 * @param privKey Private Key of encrypted data
	 * @returns The manifest or false if can't decrypt 
	 */
	async finalResults(privKey?: PrivateKey): Promise<Manifest | Boolean> {
		// call manifest with final result
	}
}

export class Job extends JobReads {
	keyring: Keyring

	constructor (api: ApiPromise, escrowId: EscrowId, keyring: Keyring) {
		super(api, escrowId);
		this.keyring = keyring;
	}
	
	static async launch (

	): Promise<Boolean> {
		// calls upload returns hash and url 
		// creates escrow()
		return true
	}

	static async createEscrow(
		api: ApiPromise,
		keyring: Keyring,
		sender: KeyringPair,
		manifestUrl: String,
		manifestHash: String,
		reputation_oracle: Address,
		recording_oracle: Address,
		oracle_stake: Number,
		): Promise<Job> {
			// trustedHandlers are the multi credentials 
			// get info from manifest
			// reputation_oracle_stake from manifest (make sure it is in right format)
			// recording_oracle_stake from manifest (make sure it is in right format)
			// amount int(int(manifest["job_total_tasks"]) * Decimal(manifest["task_bid_price"]))
			// hmt amount is amount 1e18 (now 1e12 or we change chain decimals)
			// creates an escrow instance on chain
			// Sets the Id globally this.escrowId = escrowId
			const call: any = api.tx.escrow.create(manifestUrl, manifestHash, reputation_oracle, recording_oracle, oracle_stake, oracle_stake);

			await signAndSend(call, api, sender)
			let id: EscrowId = new BN(0) 
			return Promise.resolve(new Job(api, id, keyring));
			
	}

	async addTrustedHandlers(handlers: Array<Address>, escrowId?: EscrowId): Promise<Boolean> {
		// add trusted handler from credential PK
		return true
	}

	async bulkPayout(payouts: Array<Payouts>, results: Results, pubKey: PublicKey, escrowId?: EscrowId): Promise<Boolean> {
		// if escrow Id use, if not use this.escrowId
		// uploads results to url
		// calls bulk payout batched with upload function
		return true
	}

	async abort(escrowId?: EscrowId): Promise<Boolean> {
		// if escrow Id use, if not use this.escrowId
		// calls abort from original gas payer
		return true
	}

	async cancel(escrowId?: EscrowId): Promise<Boolean> {
		// if escrow Id use, if not use this.escrowId
		// calls cancel from original gas payer
		return true
	} 

	async storeIntermediateResults(results: Results, pubKey: PublicKey, escrowId?: EscrowId): Promise<Boolean> {
		// uploads to S3 the encrypted results 
		// if escrow Id use, if not use this.escrowId
		// calls intermediate results
		// stores it this.intermediateResults = []
		return true
	}

	async complete(escrowId?: EscrowId): Promise<Boolean> {
		// if escrow Id use, if not use this.escrowId
		// sets state to complete
		return true
	}
}
