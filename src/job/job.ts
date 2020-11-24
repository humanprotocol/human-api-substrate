import { ApiPromise } from '@polkadot/api'
import { GenericAccountId } from '@polkadot/types'
import { EscrowId, Status, ManifestUrl, ManifestHash } from '../types/index'

export default class Job {
	api: ApiPromise;
	
	constructor (api: ApiPromise) {
		this.api = api
	}
	/**
	 * 
	 * @param escrowId the id of the escrow to be queried 
	 * @return Status of the Escrow instance
	 * @dev Retrieves the deployed manifest url uploaded on Job initialization.

	 */
	async status (escrowId: EscrowId): Promise<Status> {
		return "temp"
	}

	/**
	 * 
	 * @param escrowId the id of the escrow to be queried
	 * @return Manifest Url of the escrow instance
	 * @dev Retrieves the deployed manifest url uploaded on Job initialization
	 */
	async manifest_url(escrowId: EscrowId): Promise<ManifestUrl> {
		return "temp"
	}

	/**
	 * 
	 * @param escrowId the id of the escrow to be queried
	 * @return Manifest Hash of the escrow instance
	 * @dev Retrieves the deployed manifest url uploaded on Job initialization
	 */
	async manifest_hash(escrowId: EscrowId): Promise<ManifestHash> {
		return "temp"
	}

	/**
	 * 
	 * @param escrowId the id of the escrow to be queried
	 * @param address the address of the account queried
	 * @return Boolean
	 * @dev Retrieves if the address is a trusted handler from the escrow instance
	 */
	async is_trusted_handler(escrowId: EscrowId, address: GenericAccountId): Promise<Boolean> {
		return true
	}
 
}