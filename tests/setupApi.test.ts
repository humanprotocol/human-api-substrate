import { ApiBase } from '@polkadot/api/base';
import {getApi} from '../src/index';

describe('do something', async () => {
	let api: any

	before(async function(){
		api = await getApi()
	})
	after(function(){
		api.disconnect()

	})
	it(`should do things`, async () => {
		console.log(api, "test") 
	})
})
