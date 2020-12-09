import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'
import { Setup } from '../interfaces'
import * as definitions from '../typegen/src/interfaces/definitions'
import '@polkadot/api/augment';
import '@polkadot/types/augment';

export default async (): Promise<Setup> =>  {
  const wsProvider = new WsProvider("ws://127.0.0.1:9944")
  const types = Object.values(definitions).reduce((res, { types }): object => ({ ...res, ...types }), {});
  const api = await ApiPromise.create({provider: wsProvider, types});
	const keyring = new Keyring({ type: "sr25519" });
	return {api, keyring}
}
