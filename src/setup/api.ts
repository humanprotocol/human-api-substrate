import { ApiPromise, WsProvider } from '@polkadot/api'
import getApi from './getApi'

export default class Api {
	api: ApiPromise;
	
	constructor (api: ApiPromise) {
		this.api = api
	}
}