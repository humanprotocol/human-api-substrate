import { ApiPromise, WsProvider } from '@polkadot/api'

export default async (): Promise<ApiPromise> =>  {
	const wsProvider = new WsProvider("ws://127.0.0.1:9944")
	const api = ApiPromise.create({provider: wsProvider, types: {}});
	(await api).isReady
    return api	
}
