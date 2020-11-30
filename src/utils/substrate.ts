import { Keyring } from '@polkadot/keyring'
import { PrivateKey, Address, Account, Decimals } from '../types'
import { ApiPromise, SubmittableResult } from '@polkadot/api'
import { EventRecord } from '@polkadot/types/interfaces/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';


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

export function signSendAndWaitForEvent<R>(api: ApiPromise, call: SubmittableExtrinsic<'promise'>, sender: Account, filter: { section: string, name: string}, onRecord: (e: EventRecord) => R): Promise<R> {
	return new Promise<R>((resolve, reject) => {
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
					resolve(onRecord(record))
				} else {
					reject(Error("EventRecord not found"))
				}
			}
		})
	})
}