import { Job, setup } from "../src/index";

describe("", async () => {
  let api: any;
  let keyring: any;

  before(async function () {
    let obj = await setup();
    api = obj.api;
    keyring = obj.keyring;
  });
  after(function () {
    api.disconnect();
  });

  it(`create an escrow`, async () => {
    const alice = keyring.addFromUri("//Alice");
    const bob = keyring.addFromUri("//Bob");
    const charlie = keyring.addFromUri("//Charlie");
    const manifestUrl = "some.url";
    const manifestHash = "0xdev";
    const job = await Job.createEscrow(
      api,
      keyring,
      alice,
      manifestUrl,
      manifestHash,
      bob.address,
      charlie.address,
      10
    );
  });
});