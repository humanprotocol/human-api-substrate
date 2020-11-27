import { upload, download } from '../src/storage/storage'
import manifest from '../example-manifest.json'
const assert = require('assert');



describe('Storage', async () => {
	it.only("should hash and upload to aws", async function() {
		const result = await upload(manifest)
		const mockResult = {
			manifestHash: '0xa750bbd503b5f1a93fcc37b6659455485e638592f57811fcc8e0e96c46f188c4',
			manifestUrl: 'https://human-parity-is-the-best.s3.amazonaws.com/s30xa750bbd503b5f1a93fcc37b6659455485e638592f57811fcc8e0e96c46f188c4'
		  }
		  assert.deepEqual(result, mockResult, "manifest should have been hashed and uploaded to s3")
	})
})
