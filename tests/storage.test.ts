import { upload, download } from '../src/storage/storage'
import manifest from '../example-manifest.json'
const assert = require('assert');



describe('Storage', async () => {
	it("should hash and upload to aws", async function() {
		console.log(manifest)
	})
})
