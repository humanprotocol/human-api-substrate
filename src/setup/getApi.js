"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@polkadot/api");
exports.default = async () => {
    const wsProvider = new api_1.WsProvider("ws://127.0.0.1:9944");
    const api = api_1.ApiPromise.create({ provider: wsProvider, types: {} });
    (await api).isReady;
    return api;
};
