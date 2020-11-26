import { ApiPromise } from '@polkadot/api'
import { Credentials, Payouts } from '../interfaces'
import { EscrowId, Address, PublicKey, Results, Status, ManifestHash, ManifestUrl, PrivateKey, Manifest } from '../types'


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
	credentials: Credentials

	constructor (api: ApiPromise,  escrowId: EscrowId, credentials: Credentials) {
		super(api, escrowId);
		this.credentials = credentials
	}
	
	static async launch (

	): Promise<Boolean> {
		// calls upload returns hash and url 
		// creates escrow()
		return true
	}

	static async create_escrow(
		multiCredentials?: Array<Address>
		): Promise<Boolean> {
			// trustedHandlers are the multi credentials 
			// get info from manifest
			// reputation_oracle_stake from manifest (make sure it is in right format)
			// recording_oracle_stake from manifest (make sure it is in right format)
			// amount int(int(manifest["job_total_tasks"]) * Decimal(manifest["task_bid_price"]))
			// hmt amount is amount 1e18 (now 1e12 or we change chain decimals)
			// creates an escrow instance on chain
			// Sets the Id globally this.escrowId = escrowId
			return true
			
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
