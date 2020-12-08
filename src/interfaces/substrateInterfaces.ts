import { ApiPromise, Keyring } from '@polkadot/api'

export interface Setup {
	api: ApiPromise, 
	keyring: Keyring
}

export interface EventFilter {
	section: string,
	name: string
}