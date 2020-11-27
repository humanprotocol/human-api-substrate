import { Keyring } from '@polkadot/keyring'
import { PrivateKey, Address, Account, Decimals } from '../types'
import { ApiPromise } from '@polkadot/api'
import { blake2AsHex } from '@polkadot/util-crypto';

/**
 * @param privateKey Private key of contract launcher
 * @return address of Private Key
 * @dev Retrieves the address of the private key
 */
export const privateKeyToAddress = (privateKey: PrivateKey): Address => {
	const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });
	return keyring.addFromSeed(privateKey).address
}

/**
 * @param privateKey Private key of contract launcher
 * @return address of Private Key
 * @dev Retrieves the account of the private key
 */
export const privateKeyToAccount = (privateKey: PrivateKey): Account => {
	const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });
	return keyring.addFromSeed(privateKey)
}

export const getDecimals = (api: ApiPromise): Decimals => {
	return api.registry.chainDecimals
}

export const hash = (data: Uint8Array | string): string => {
	return blake2AsHex(data)
}