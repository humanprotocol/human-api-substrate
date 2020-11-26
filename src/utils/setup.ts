import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'
import { Setup } from '../interfaces'
import * as types from '../config/types.json'

export default async (): Promise<Setup> =>  {
	const wsProvider = new WsProvider("ws://127.0.0.1:9944")
	const api = await ApiPromise.create({provider: wsProvider, types});
	const keyring = new Keyring({ type: "sr25519" });
	return {api, keyring}
}
