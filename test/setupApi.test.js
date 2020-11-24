const {getApi} = require('../src/index.ts')
describe('Loaded transfers', async () => {
	it(`should do things`, async () => {
		const api = await getApi()
		console.log(api)
	})
})