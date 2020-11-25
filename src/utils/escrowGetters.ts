import { EscrowId, Status, ManifestUrl, ManifestHash, PrivateKey } from '../types/index'
import { ApiPromise } from '@polkadot/api'
import { Keyring } from '@polkadot/keyring'
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
export const manifest_url = async (api: ApiPromise, escrowId: EscrowId): Promise<ManifestUrl> => {
	return "temp"
}

/**
 * 
 * @param escrowId the id of the escrow to be queried
 * @return Manifest Hash of the escrow instance
 * @dev Retrieves the deployed manifest url uploaded on Job initialization
 */
export const manifest_hash = async (api: ApiPromise, escrowId: EscrowId): Promise<ManifestHash> => {
	return "temp"
}

/**
 * 
 * @param escrowId the id of the escrow to be queried
 * @param address the address of the account queried
 * @return Boolean
 * @dev Retrieves if the address is a trusted handler from the escrow instance
 */
export const is_trusted_handler = async (api: ApiPromise, escrowId: EscrowId, address: String): Promise<Boolean> => {
	return true
}

/**
 * @param gas_payer Private key of contract launcher
 * @return address of Private Key
 * @dev Retrieves the address of the account that launched the contract
 */
export const privateKeyToAddress = (gas_payer: PrivateKey): String => {
	const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });
	return keyring.addFromSeed(gas_payer).address
}