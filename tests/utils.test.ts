import { setup } from "../src/index";
import { hash, getDecimals, formatDecimals } from "../src/utils/substrate";
import manifest from "../example-manifest.json";
const assert = require("assert");

describe("utils", async () => {
  let api: any;

  before(async function () {
    const obj = await setup();
    api = obj.api;
  });
  after(function () {
    api.disconnect();
  });
  it("should hash a manifest", async function () {
    const hashed = await hash(JSON.stringify(manifest));
    const result =
      "0x251015a125f7d34f924ac5ac848f120b659f09863e4e355641420f56425833b5";
    assert.equal(hashed, result, "hashing should be correct");
  });
  it("should convert a number to proper decimals", async function () {
    const decimals = await getDecimals(api);
    assert.equal(
      decimals.toString(),
      "12",
      "there should be 12 decimals by default"
    );
    const formatted = await formatDecimals(api, 10);
    assert.equal(
      formatted.toString(),
      "10000000000000",
      "balance should be converted properly"
    );
  });
  it("should allow setup to pass in a new endpoint", async function () {
    const newSetup = await setup("wss://rpc.polkadot.io");
    const newApi = newSetup.api;
    const chain = await newApi.rpc.system.chain();
    assert.equal(
      chain.toString(),
      "Polkadot",
      "should be connected to polkadot"
    );
    newApi.disconnect();
  });
});
