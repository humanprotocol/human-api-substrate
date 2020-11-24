import { ApiPromise } from '@polkadot/api'

export default class Job {
	api: ApiPromise;
	
	constructor (api: ApiPromise) {
		this.api = api
	}
}