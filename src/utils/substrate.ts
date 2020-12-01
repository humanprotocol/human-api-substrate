import { Keyring } from '@polkadot/keyring'
import { PrivateKey, Address, Account, Decimals } from '../types'
import { ApiPromise, SubmittableResult } from '@polkadot/api'
import { EventRecord } from '@polkadot/types/interfaces/types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { blake2AsHex } from '@polkadot/util-crypto'

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

/**
 * Signs and sends the given `call` from `sender` and waits for an event that fits `filter`.
 * @param api api object
 * @param call a call that can be submitted to the chain
 * @param sender the sender of the transaction
 * @param filter which event to filter for
 */
export function sendAndWaitFor<R>(api: ApiPromise, call: SubmittableExtrinsic<'promise'>, sender: Account, filter: { section: string, name: string}): Promise<EventRecord> {
	return new Promise<EventRecord>((resolve, reject) => {
		call.signAndSend(sender, (res: SubmittableResult) => {
			const { status, dispatchError } = res
			if (dispatchError) {
				if (dispatchError.isModule) {
					// for module errors, we have the section indexed, lookup
					const decoded = api.registry.findMetaError(dispatchError.asModule);
					const { documentation, name, section } = decoded;
			
					console.error(`${section}.${name}: ${documentation.join(' ')}`);
				} else {
					// Other, CannotLookup, BadOrigin, no extra info
					console.error(dispatchError.toString());
				}
				reject(dispatchError)
			}
			if (status.isInBlock || status.isFinalized) {
				const record = res.findRecord(filter.section, filter.name);
				if (record) {
					resolve(record)
				} else {
					reject(Error("EventRecord not found"))
				}
			}
		})
	})
}

export const hash = (data: Uint8Array | string): string => {
	return blake2AsHex(data)
}