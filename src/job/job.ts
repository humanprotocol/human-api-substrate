import { ApiPromise } from '@polkadot/api'
import { Credentials, Payouts } from '../interfaces'
import { EscrowManifest, Address, PublicKey } from '../types'

export default class Job {
	api: ApiPromise;
	credentials: Credentials
	manifest: EscrowManifest
	
	constructor (api: ApiPromise, credentials: Credentials, manifest: EscrowManifest) {
		this.api = api
		this.credentials = credentials
		this.manifest = manifest
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
			return true
			
	}

	async addTrustedHandlers(handlers: Array<Address>): Promise<Boolean> {
		// add trusted handler from credential PK
		return true
	}

	async bulkPayout(payouts: Array<Payouts>, results: any, pubKey: PublicKey): Promise<Boolean> {
		// uploads results to url
		// calls bulk payout batched with upload function
		return true
	}

	async abort(): Promise<Boolean> {
		// calls abort from original gas payer
		return true
	}

}