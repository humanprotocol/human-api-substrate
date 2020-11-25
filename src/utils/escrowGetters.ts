import { EscrowId, Status, ManifestUrl, ManifestHash, Address } from '../types/index'
import { ApiPromise } from '@polkadot/api'
/**
 * 
 * @param escrowId the id of the escrow to be queried 
 * @return Status of the Escrow instance
 * @dev Retrieves the deployed manifest url uploaded on Job initialization.

 */
export const status = async (api: ApiPromise, escrowId: EscrowId): Promise<Status> =>  {
	return "temp"
}

/**
 * 
 * @param escrowId the id of the escrow to be queried
 * @return Manifest Url of the escrow instance
 * @dev Retrieves the deployed manifest url uploaded on Job initialization
 */
export const manifestUrl = async (api: ApiPromise, escrowId: EscrowId): Promise<ManifestUrl> => {
	return "temp"
}

/**
 * 
 * @param escrowId the id of the escrow to be queried
 * @return Manifest Hash of the escrow instance
 * @dev Retrieves the deployed manifest url uploaded on Job initialization
 */
export const manifestHash = async (api: ApiPromise, escrowId: EscrowId): Promise<ManifestHash> => {
	return "temp"
}

/**
 * 
 * @param escrowId the id of the escrow to be queried
 * @param address the address of the account queried
 * @return Boolean
 * @dev Retrieves if the address is a trusted handler from the escrow instance
 */
export const isTrustedHandler = async (api: ApiPromise, escrowId: EscrowId, address: Address): Promise<Boolean> => {
	return true
}
