import { hash } from '../src/utils/substrate'
import manifest from '../example-manifest.json'
const assert = require('assert');



describe('Storage', async () => {
	it.only("should hash a manifest", async function() {
		console.log(manifest)
		const hashed = await hash(JSON.stringify(manifest))
		console.log(hashed)
	})
})
