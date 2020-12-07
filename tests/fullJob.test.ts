import { Job, setup, Payouts } from "../src/index";
import BN from "bn.js";
import manifest from "../example-manifest.json";
import { hash, getDecimals, formatDecimals } from "../src/utils/substrate";

import should from "should";
const { assert } = require("chai");

describe("job", async () => {
  let api: any;
  let keyring: any;
  let alice: any;
  let bob: any;
  let charlie: any;
  let dave: any;
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
    amountToSend = formatDecimals(api, 10);
  });

  after(function () {
    api.disconnect();
  });

  it(`create an escrow`, async () => {
    const job = await Job.createEscrow(
      api,
      alice,
      manifestUrl,
      manifestHash,
      manifest.reputation_oracle_addr,
      manifest.recording_oracle_addr,
      new BN("5")
    );
    const escrow = await job.escrow();
    mockData.end_time = escrow.end_time;
    mockData.account = escrow.account;
    assert.deepEqual(escrow, mockData, "escrow should match mock data");
  });

  it("launches a job", async () => {
    const job = await Job.launch(api, alice, manifest);
    const escrow = await job.escrow();
    mockData.end_time = escrow.end_time;
    mockData.account = escrow.account;
    assert.deepEqual(escrow, mockData, "escrow should match mock data");
    const escrowBalance = await job.balance();
    assert(escrowBalance.toString() !== "0", "escrow should have been hydrated");
  });

  it("funds and escrow", async () => {
    const job = await Job.createEscrow(
      api,
      alice,
      manifestUrl,
      manifestHash,
      manifest.reputation_oracle_addr,
      manifest.recording_oracle_addr,
      new BN("5")
    );
    const amountToSend = await formatDecimals(api, 10);
    const escrow = await job.escrow();
    await job.fundEscrow(escrow.account, amountToSend);
    const escrowBalance = await job.balance();
    assert.equal(escrowBalance.toString(), amountToSend.toString(), "escrow should have funds");
  });
  it("aborts escrow", async () => {
    const job = await Job.createEscrow(
      api,
      alice,
      manifestUrl,
      manifestHash,
      manifest.reputation_oracle_addr,
      manifest.recording_oracle_addr,
      new BN("5")
    );
    const amountToSend = await formatDecimals(api, 10);
    const escrowBefore = await job.escrow();
    await job.fundEscrow(escrowBefore.account, amountToSend);
    await job.abort();
    const escrow = await job.escrow();
    assert.equal(escrow, null, "escrow should be deleted");
  });
  it("cancel escrow", async () => {
    const job = await Job.createEscrow(
      api,
      alice,
      manifestUrl,
      manifestHash,
      manifest.reputation_oracle_addr,
      manifest.recording_oracle_addr,
      new BN("5")
    );
    const escrowBefore = await job.escrow();
    await job.fundEscrow(escrowBefore.account, amountToSend);
    await job.cancel();
    const escrow = await job.escrow();
    mockData.end_time = escrow.end_time;
    mockData.account = escrow.account;
    mockData.status = "Cancelled";
    assert.deepEqual(escrow, mockData, "escrow should be cancelled");
  });
  it("stores intermediate results then fetches them", async () => {
    const job = await Job.createEscrow(
      api,
      alice,
      manifestUrl,
      manifestHash,
      manifest.reputation_oracle_addr,
      manifest.recording_oracle_addr,
      new BN("5")
    );
    const results = { results: true };
    await job.noteIntermediateResults(results);
    const intermediateResults = await job.intermediateResults(0);
    assert.deepEqual(
      JSON.parse(intermediateResults),
      results,
      "intermediated results should have been stored and retrieved properly"
    );
  });
  it("does a bulk payout no results and sets complete", async () => {
    const job = await Job.createEscrow(
      api,
      alice,
      manifestUrl,
      manifestHash,
      manifest.reputation_oracle_addr,
      manifest.recording_oracle_addr,
      new BN("5")
    );

    const escrowBefore = await job.escrow();
    const balanceOfCharlieBefore = await api.query.system.account(charlie.address);
    const balanceOfDaveBefore = await api.query.system.account(dave.address);

    await job.fundEscrow(escrowBefore.account, amountToSend);
    const payout: Payouts = {
      addresses: [charlie.address, dave.address],
      amounts: [formatDecimals(api, 5), formatDecimals(api, 5)],
    };
    await job.bulkPayout(payout);

    const escrow = await job.escrow();
    const balanceOfCharlieAfter = await api.query.system.account(charlie.address);
    const balanceOfDaveAfter = await api.query.system.account(dave.address);
    const balanceOfPalletAfter = await job.balance();

    assert.isAbove(
      Number(balanceOfCharlieAfter.data.free),
      Number(balanceOfCharlieBefore.data.free),
      "charlie should "
    );
    assert.isAbove(Number(balanceOfDaveAfter.data.free), Number(balanceOfDaveBefore.data.free), "charlie should ");
    assert(balanceOfPalletAfter.isZero());

    mockData.end_time = escrow.end_time;
    mockData.account = escrow.account;
    mockData.status = "Paid";
    assert.deepEqual(escrow, mockData, "escrow should be paid");

    await job.complete();
    const completedEscrow = await job.escrow();
    mockData.status = "Complete";
    assert.deepEqual(completedEscrow, mockData, "escrow should be paid");
  });
  it("does a bulk payout with results not full payout", async () => {
    const job = await Job.createEscrow(
      api,
      alice,
      manifestUrl,
      manifestHash,
      manifest.reputation_oracle_addr,
      manifest.recording_oracle_addr,
      new BN("5")
    );

    const escrowBefore = await job.escrow();
    const balanceOfCharlieBefore = await api.query.system.account(charlie.address);
    const balanceOfDaveBefore = await api.query.system.account(dave.address);
    const balanceOfJobBefore = await job.balance();

    await job.fundEscrow(escrowBefore.account, amountToSend);
    const payout: Payouts = {
      addresses: [charlie.address, dave.address],
      amounts: [formatDecimals(api, 3), formatDecimals(api, 3)],
    };

    const finalResults = { results: "final" };

    await job.storeFinalResults(finalResults);
    await job.bulkPayout(payout);
    const escrow = await job.escrow();
    const balanceOfCharlieAfter = await api.query.system.account(charlie.address);
    const balanceOfDaveAfter = await api.query.system.account(dave.address);
    const balanceOfJobAfter = await job.balance();

    assert.isAbove(
      Number(balanceOfCharlieAfter.data.free),
      Number(balanceOfCharlieBefore.data.free),
      "charlie should "
    );
    assert.isAbove(Number(balanceOfDaveAfter.data.free), Number(balanceOfDaveBefore.data.free), "charlie should ");
    assert.isBelow(Number(balanceOfJobBefore), Number(balanceOfJobAfter), "job should have less funds");

    mockData.end_time = escrow.end_time;
    mockData.account = escrow.account;
    mockData.status = "Partial";
    assert.deepEqual(escrow, mockData, "escrow should be partial");

    const finalResultReturn = await job.finalResults();
    console.log({ finalResultReturn });
    assert.deepEqual(
      JSON.parse(finalResultReturn),
      finalResults,
      "final results should have been stored and retrieved properly"
    );
  });

  it("adds trusted handlers", async () => {
    const job = await Job.createEscrow(
      api,
      alice,
      manifestUrl,
      manifestHash,
      manifest.reputation_oracle_addr,
      manifest.recording_oracle_addr,
      new BN("5")
    );

    const handlers = [charlie.address, dave.address];
    assert(!(await job.isTrustedHandler(charlie.address)));
    assert(!(await job.isTrustedHandler(dave.address)));

    await job.addTrustedHandlers(handlers);

    assert(await job.isTrustedHandler(charlie.address));
    assert(await job.isTrustedHandler(dave.address));
  });
});
