"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
describe('do something', async () => {
    let api;
    before(async function () {
        api = await index_1.getApi();
    });
    after(function () {
        api.disconnect();
    });
    it(`should do things`, async () => {
        console.log(api, "test");
    });
});
