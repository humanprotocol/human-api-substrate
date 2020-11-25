import { ApiPromise } from '@polkadot/api'
import { GenericAccountId } from '@polkadot/types'
import { EscrowId, Status, ManifestUrl, ManifestHash } from '../types/index'

export default class Job {
	api: ApiPromise;
	
	constructor (api: ApiPromise) {
		this.api = api
	}
 
}