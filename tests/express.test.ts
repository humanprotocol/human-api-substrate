import axios from "axios";
import manifest from "../example-manifest.json";
const { assert } = require("chai");

describe("express test", async () => {
  const url = "http://localhost:3001";
  const manifestUrl =
    "https://human-parity-is-the-best.s3.amazonaws.com/s30x251015a125f7d34f924ac5ac848f120b659f09863e4e355641420f56425833b5";
  const manifestHash =
    "0x251015a125f7d34f924ac5ac848f120b659f09863e4e355641420f56425833b5";
  const reputationOracle = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
  const recordingOracle = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
  const reputationOracleStake = 5;
  const recordingOracleStake = 5;
  let escrowId: any;
  before(async function () {
    const returned = await axios.post(url, {
      functionName: "createEscrow",
      seed: "//Alice",
      manifestUrl,
      manifestHash,
      reputationOracle,
      recordingOracle,
      reputationOracleStake,
      recordingOracleStake,
    });
    escrowId = returned.data.escrowId;
  });

  it(`should launch escrow then cancel it`, async () => {
    const returned = await axios.post(url, {
      functionName: "launch",
      seed: "//Alice",
      manifest,
    });

    const escrow = await axios.post(url, {
      functionName: "escrow",
      escrowId: returned.data.escrowId,
      seed: "//Alice",
    });
    assert.equal(escrow.data.status, "Pending");

    const toSend = "2000000000000";
    await axios.post(url, {
      functionName: "fundEscrow",
      escrowId: returned.data.escrowId,
      seed: "//Alice",
      amount: toSend,
      escrowAddress: escrow.data.account,
    });

    const returnedCancel = await axios.post(url, {
      functionName: "cancel",
      escrowId: returned.data.escrowId,
      seed: "//Alice",
    });
    assert.equal(returnedCancel.status, "200");
    const escrowCanceled = await axios.post(url, {
      functionName: "escrow",
      escrowId: returned.data.escrowId,
      seed: "//Alice",
    });
    assert.equal(escrowCanceled.data.status, "Cancelled");
  });

  it(`should create an escrow and bulk payout and complete`, async () => {
    const returned = await axios.post(url, {
      functionName: "createEscrow",
      seed: "//Alice",
      manifestUrl,
      manifestHash,
      reputationOracle,
      recordingOracle,
      reputationOracleStake,
      recordingOracleStake,
    });

    assert.equal(returned.status, "200");
    const escrow = await axios.post(url, {
      functionName: "escrow",
      escrowId: returned.data.escrowId,
      seed: "//Alice",
    });

    const toSend = "2000000000000";
    const returnedFund = await axios.post(url, {
      functionName: "fundEscrow",
      escrowId: returned.data.escrowId,
      seed: "//Alice",
      amount: toSend,
      escrowAddress: escrow.data.account,
    });
    assert.equal(returnedFund.status, "200");

    const returnedBalance = await axios.post(url, {
      functionName: "balance",
      escrowId: returned.data.escrowId,
    });

    assert.equal(toSend.toString(), returnedBalance.data.toString());

    // console.log("funded", returnedFund)
    const payout = {
      addresses: [reputationOracle, reputationOracle],
      amounts: ["1000000000000", "1000000000000"],
    };

    const returnedBulk = await axios.post(url, {
      functionName: "bulkPayout",
      escrowId: returned.data.escrowId,
      seed: "//Alice",
      payouts: payout,
    });

    assert.equal(returnedBulk.status, "200");

    const returnedBalanceAfter = await axios.post(url, {
      functionName: "balance",
      escrowId: returned.data.escrowId,
    });

    assert.equal("0", returnedBalanceAfter.data.toString());
    const returnedCompleted = await axios.post(url, {
      functionName: "complete",
      escrowId: returned.data.escrowId,
      seed: "//Alice",
    });
    assert.equal(returnedCompleted.status, "200");
    const escrowCompleted = await axios.post(url, {
      functionName: "escrow",
      escrowId: returned.data.escrowId,
      seed: "//Alice",
    });
    assert.equal(escrowCompleted.data.status, "Complete");
  });
  it(`should add a trusted handler`, async () => {
    const dave = "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy";
    const returned = await axios.post(url, {
      functionName: "addTrustedHandlers",
      escrowId,
      seed: "//Alice",
      handlers: [dave],
    });
    assert.equal(returned.status, "200");

    const returnedAfter = await axios.post(url, {
      functionName: "isTrustedHandler",
      escrowId,
      address: dave,
    });

    assert.equal(returnedAfter.data, true);
    assert.equal(returned.status, "200");
  });

  it(`should store final results`, async () => {
    const finalResults = { results: "final" };
    const returned = await axios.post(url, {
      functionName: "storeFinalResults",
      escrowId,
      seed: "//Alice",
      results: finalResults,
    });
    assert.equal(returned.status, "200");
    const returnedfinalResults = await axios.post(url, {
      functionName: "finalResults",
      escrowId,
      seed: "//Alice",
      results: finalResults,
    });
  });
  it(`should note intermediate results`, async () => {
    const intermediateResults = { results: "intermediate" };
    const returned = await axios.post(url, {
      functionName: "noteIntermediateResults",
      escrowId,
      seed: "//Alice",
      results: intermediateResults,
    });
    assert.equal(returned.status, "200");
  });

  it(`should get manifest`, async () => {
    const returned = await axios.post(url, {
      functionName: "manifest",
      seed: "//Alice",
      url: manifestUrl,
    });
    assert.equal(returned.status, "200");
    assert.deepEqual(returned.data, manifest);
  });
  it(`should abort`, async () => {
    const returned = await axios.post(url, {
      functionName: "createEscrow",
      seed: "//Alice",
      manifestUrl,
      manifestHash,
      reputationOracle,
      recordingOracle,
      reputationOracleStake,
      recordingOracleStake,
    });

    const returnedAbort = await axios.post(url, {
      functionName: "abort",
      escrowId: returned.data.escrowId,
      seed: "//Alice",
    });

    assert.equal(returnedAbort.status, "200");
    try {
      await axios.post(url, {
        functionName: "escrow",
        escrowId: returned.data.escrowId,
        seed: "//Alice",
      });
    } catch (e) {
      assert.equal(e.response.data, "Option: unwrapping a None value");
    }
  });
});
