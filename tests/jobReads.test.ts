import { Job, setup, JobReads } from "../src/index";
import BN from "bn.js";
import manifest from "../example-manifest.json";
import should from "should";
const assert = require("assert");

describe("Job reads", async () => {
  let api: any;
  let keyring: any;
  let jobRead: any;
  let alice: any;
  const manifestUrl =
    "https://human-parity-is-the-best.s3.amazonaws.com/s30x251015a125f7d34f924ac5ac848f120b659f09863e4e355641420f56425833b5";

  before(async function () {
    let obj = await setup();
    api = obj.api;
    keyring = obj.keyring;

    alice = keyring.addFromUri("//Alice");
    const bob = keyring.addFromUri("//Bob");
    const charlie = keyring.addFromUri("//Charlie");
    const manifestUrl = "some.url";
    const manifestHash = "0xdev";
    const job = await Job.createEscrow(api, alice, manifestUrl, manifestHash, bob.address, charlie.address, new BN(10));
    jobRead = new JobReads(api, job.escrowId);
  });
  after(function () {
    api.disconnect();
  });

  it(`queries escrow`, async () => {
    const escrow = await jobRead.escrow();
    const mockData = {
      status: "Pending",
      end_time: escrow.end_time,
      manifest_url: "0x736f6d652e75726c",
      manifest_hash: "0x3078646576",
      reputation_oracle: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      recording_oracle: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
      reputation_oracle_stake: 10,
      recording_oracle_stake: 10,
      canceller: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      account: escrow.account,
    };

    assert.deepEqual(escrow, mockData, "escrow should match mock data");
  });

  it(`queries balance`, async () => {
    const balance = await jobRead.balance();
    assert.equal(balance.toString(), "0");
  });

  it(`queries trusted handler`, async () => {
    const isAliceTrusted = await jobRead.isTrustedHandler(alice.address);
    assert.equal(isAliceTrusted, true);

    const dave = keyring.addFromUri("//Dave");
    const isDaveTrusted = await jobRead.isTrustedHandler(dave.address);
    assert.equal(isDaveTrusted, false);
  });

  it(`queries manifest`, async () => {
    // assumes proper manifest url already stored in S3 bucket.
    // If fails, call storage, grab the proper url and try again
    const result = await jobRead.manifest(manifestUrl);
    assert.equal(result, JSON.stringify(manifest), "should retrieve manifest");
  });

  it(`fails to query intermediate results out of bounds`, async () => {
    try {
      await jobRead.intermediateResults(0);
      should.fail("no error was thrown when it should have been", "");
    } catch (e) {
      assert.equal(e.message, "Intermediate Results out of bounds");
    }
  });
  it(`fails to query final results no final results yet`, async () => {
    try {
      await jobRead.finalResults();
      should.fail("no error was thrown when it should have been", "");
    } catch (e) {
      assert.equal(e.message, "Option: unwrapping a None value");
    }
  });
});
