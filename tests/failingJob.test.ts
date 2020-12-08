import { Job, setup, Payouts } from "../src/index";
import BN from "bn.js";
import manifest from "../example-manifest.json";
import { hash, getDecimals, formatDecimals } from "../src/utils/substrate";

import should from "should";
const { assert } = require("chai");

describe("failing job", async () => {
  let api: any;
  let keyring: any;
  let alice: any;
  let bob: any;
  let charlie: any;
  let dave: any;
  let eve: any;
  let amountToSend: any;
  const manifestUrl =
    "https://human-parity-is-the-best.s3.amazonaws.com/s30x251015a125f7d34f924ac5ac848f120b659f09863e4e355641420f56425833b5";
  const manifestHash = "0x251015a125f7d34f924ac5ac848f120b659f09863e4e355641420f56425833b5";
  const mockData = {
    status: "Pending",
    end_time: "0",
    manifest_url:
      "0x68747470733a2f2f68756d616e2d7061726974792d69732d7468652d626573742e73332e616d617a6f6e6177732e636f6d2f7333307832353130313561313235663764333466393234616335616338343866313230623635396630393836336534653335353634313432306635363432353833336235",
    manifest_hash: "0x251015a125f7d34f924ac5ac848f120b659f09863e4e355641420f56425833b5",
    reputation_oracle: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    recording_oracle: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    reputation_oracle_stake: 5,
    recording_oracle_stake: 5,
    canceller: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    account: "",
  };

  before(async function () {
    let obj = await setup();
    api = obj.api;
    keyring = obj.keyring;
    alice = keyring.addFromUri("//Alice");
    bob = keyring.addFromUri("//Bob");
    charlie = keyring.addFromUri("//Charlie");
    dave = keyring.addFromUri("//Dave");
    eve = keyring.addFromUri("//Eve");

    amountToSend = formatDecimals(api, 10);
  });

  after(function () {
    api.disconnect();
  });

  it(`fails to create escrow`, async () => {
    try {
      await Job.createEscrow(
        api,
        eve,
        manifestUrl,
        manifestHash,
        manifest.reputation_oracle_addr,
        manifest.recording_oracle_addr,
        new BN("5")
      );
    } catch (e) {
      assert.equal(e.message, "1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low");
    }
  });

  it("funds escorow", async () => {
    const job = new Job(
      api,
      alice,
      new BN(1),
    );
	const amountToSend = new BN(1)
	try {
		await job.fundEscrow(eve.address, amountToSend);
	} catch (e) {
		assert.equal(
			e.message, 
			"balances.ExistentialDeposit:  Value too low to create account due to existential deposit"
		)
	}
  });
});
