import { hash } from '../src/utils/substrate'
import manifest from '../example-manifest.json'
const assert = require('assert');



describe('Storage', async () => {
	it.only("should hash a manifest", async function() {
		const hashed = await hash(JSON.stringify(manifest))
		const result = "0xa750bbd503b5f1a93fcc37b6659455485e638592f57811fcc8e0e96c46f188c4"
		assert.equal(hashed, result, "hashing should be correct")
	})
})
