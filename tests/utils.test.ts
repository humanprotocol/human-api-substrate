import { setup } from "../src/index";
import { hash, getDecimals, formatDecimals } from '../src/utils/substrate'
import manifest from '../example-manifest.json'
import BN from 'bn.js';
const assert = require('assert');



describe('Storage', async () => {
	let api: any

	before(async function(){
        let obj = await setup()
        api = obj.api
	})
	after(function(){
		api.disconnect()
    })
	it("should hash a manifest", async function() {
		const hashed = await hash(JSON.stringify(manifest))
		const result = "0xa750bbd503b5f1a93fcc37b6659455485e638592f57811fcc8e0e96c46f188c4"
		assert.equal(hashed, result, "hashing should be correct")
	})
	it("should convert a number to proper decimals", async function() {
		const decimals = await getDecimals(api)
		assert.equal(decimals.toString(), "12", "there should be 12 decimals by default")
		const formatted = await formatDecimals(api, new BN(10))
		assert.equal(formatted.toString(), "10000000000000", "balance should be converted properly")
	})

	
})
