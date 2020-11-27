import { ApiPromise, Keyring } from '@polkadot/api'

export interface Setup {
	api: ApiPromise, 
	keyring: Keyring
}