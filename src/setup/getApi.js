"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@polkadot/api");
async function getApi() {
    const wsProvider = new api_1.WsProvider("ws://127.0.0.1:9944");
    const api = api_1.ApiPromise.create({ provider: wsProvider, types: {} });
    (await api).isReady;
    console.log(api);
    return api;
}
exports.default = getApi;
