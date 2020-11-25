import { ApiPromise } from '@polkadot/api'
import { Credentials, Payouts } from '../interfaces'
import { EscrowManifest, EscrowId, Address, PublicKey, Results } from '../types'


//TODO split these classes up into dedicated files
export class JobBase { 
	api: ApiPromise;
	credentials: Credentials | null
	manifest: EscrowManifest | null
	
	constructor (api: ApiPromise, credentials?: Credentials, manifest?: EscrowManifest) {
		this.api = api
		this.credentials = credentials ? credentials : null
		this.manifest = manifest ? manifest : null
	}

}

export class JobReads extends JobBase {
	constructor(api: ApiPromise, credentials?: Credentials, manifest?: EscrowManifest) {
		super(api, credentials, manifest);
	  }
}

export class Job extends JobReads {
	constructor (api: ApiPromise, credentials: Credentials, manifest: EscrowManifest) {
		super(api, credentials, manifest);
	}
	
	async launch (

	): Promise<Boolean> {
		// calls upload returns hash and url 
		// creates escrow()
		return true
	}
	async create_escrow(
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
		return true
	}

	async complete(escrowId?: EscrowId): Promise<Boolean> {
		// if escrow Id use, if not use this.escrowId
		// sets state to complete
		return true
	}
}