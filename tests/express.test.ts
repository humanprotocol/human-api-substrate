import axios from "axios";
import { request } from "express";
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
  let factoryId: any;
  before(async function () {
    const factory = await axios.post(`${url}/factory`, {
      seed: "//Alice",
      manifestUrl,
      manifestHash,
      reputationOracle,
      recordingOracle,
      reputationOracleStake,
      recordingOracleStake,
    });
    factoryId = factory.data.factoryId;
    const returned = await axios.post(`${url}/job`, {
      seed: "//Alice",
      manifestUrl,
      manifestHash,
      factoryId,
      reputationOracle,
      recordingOracle,
      reputationOracleStake,
      recordingOracleStake,
    });
    escrowId = returned.data.escrowId;
  });

  it(`should launch escrow then cancel it`, async () => {
    const returned = await axios.post(`${url}/job`, {
      seed: "//Alice",
      manifestUrl,
      manifestHash,
      factoryId,
      reputationOracle,
      recordingOracle,
      reputationOracleStake,
      recordingOracleStake,
    });

    // const escrow = await axios.post(`${url}/job`, {
    //   functionName: "escrow",
    //   escrowId: returned.data.escrowId,
    //   seed: "//Alice",
    // });
    const escrow = await axios.get(`${url}/job/escrow`, {
      params: {
        escrowId: returned.data.escrowId,
      },
    });
    assert.equal(escrow.data.status, "Pending");
    const toSend = "2000000000000";
    await axios.patch(`${url}/job/fund`, {
      escrowId: returned.data.escrowId,
      seed: "//Alice",
      amount: toSend,
      escrowAddress: escrow.data.account,
    });

    const returnedCancel = await axios.patch(`${url}/job/cancel`, {
      functionName: "cancel",
      escrowId: returned.data.escrowId,
      seed: "//Alice",
    });
    assert.equal(returnedCancel.status, "200");
    const escrowCanceled = await axios.get(`${url}/job/status`, {
      params: {
        escrowId: returned.data.escrowId,
      },
    });
    assert.equal(escrowCanceled.data.status, "Cancelled");
  });

  it(`should create an escrow and bulk payout and complete`, async () => {
    const returned = await axios.post(`${url}/job`, {
      seed: "//Alice",
      manifestUrl,
      manifestHash,
      factoryId,
      reputationOracle,
      recordingOracle,
      reputationOracleStake,
      recordingOracleStake,
    });

    assert.equal(returned.status, "200");
    const escrow = await axios.get(`${url}/job/escrow`, {
      params: {
        escrowId: returned.data.escrowId,
      },
    });

    const toSend = "2000000000000";
    const returnedFund = await axios.patch(`${url}/job/fund`, {
      escrowId: returned.data.escrowId,
      seed: "//Alice",
      amount: toSend,
      escrowAddress: escrow.data.account,
    });
    assert.equal(returnedFund.status, "200");

    // const returnedBalance = await axios.post(`${url}/job`, {
    //   functionName: "balance",
    //   escrowId: returned.data.escrowId,
    // });

    // assert.equal(toSend.toString(), returnedBalance.data.toString());

    // console.log("funded", returnedFund)
    const payout = {
      addresses: [reputationOracle, reputationOracle],
      amounts: ["1000000000000", "1000000000000"],
    };

    const returnedBulk = await axios.post(`${url}/job/bulkPayout`, {
      escrowId: returned.data.escrowId,
      seed: "//Alice",
      payouts: payout,
    });

    assert.equal(returnedBulk.status, "200");

    // const returnedBalanceAfter = await axios.post(`${url}/job`, {
    //   functionName: "balance",
    //   escrowId: returned.data.escrowId,
    // });

    const returnedCompleted = await axios.patch(`${url}/job/complete`, {
      escrowId: returned.data.escrowId,
      seed: "//Alice",
    });
    assert.equal(returnedCompleted.status, "200");
    const escrowCompleted = await axios.get(`${url}/job/escrow`, {
      params: {
        escrowId: returned.data.escrowId,
      },
    });

    assert.equal(escrowCompleted.data.status, "Complete");
  });
  it(`should add a trusted handler`, async () => {
    const dave = "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy";
    const returned = await axios.post(`${url}/job/addTrustedHandlers`, {
      escrowId,
      seed: "//Alice",
      handlers: [dave],
    });
    assert.equal(returned.status, "200");
    // const returnedAfter = await axios.post(`${url}/job/isTrustedHandler`, {
    //   escrowId,
    //   address: dave,
    // });

    // assert.equal(returnedAfter.data, true);
    // assert.equal(returned.status, "200");
  });

  it(`should store final results`, async () => {
    const finalResults = { results: "final" };
    const returned = await axios.patch(`${url}/job/storeFinalResults`, {
      escrowId,
      seed: "//Alice",
      results: finalResults,
    });
    assert.equal(returned.status, "200");
    const returnedfinalResults = await axios.get(`${url}/job/finalResults`, {
      params: {
        escrowId,
      },
    });
    assert.equal(returnedfinalResults.status, "200");
  });
  it(`should note intermediate results`, async () => {
    const intermediateResults = { results: "intermediate" };
    const returned = await axios.patch(`${url}/job/noteIntermediateResults`, {
      escrowId,
      seed: "//Alice",
      results: intermediateResults,
    });
    assert.equal(returned.status, "200");
  });

  it(`should get manifest`, async () => {
    const returned = await axios.get(`${url}/manifest/validate`, {
      params: {
        manifestUrl,
      },
    });
    assert.equal(returned.status, "200");
    assert.deepEqual(returned.data, manifest);
  });
  it(`should abort`, async () => {
    const returned = await axios.post(`${url}/job`, {
      seed: "//Alice",
      manifestUrl,
      manifestHash,
      factoryId,
      reputationOracle,
      recordingOracle,
      reputationOracleStake,
      recordingOracleStake,
    });

    const returnedAbort = await axios.patch(`${url}/job/abort`, {
      escrowId: returned.data.escrowId,
      seed: "//Alice",
    });

    assert.equal(returnedAbort.status, "200");
    try {
      await axios.get(`${url}/job/status`, {
        params: {
          escrowId: returned.data.escrowId,
        },
      });
    } catch (e) {
      assert.deepEqual(e.response.data, { error: "Object does not exist." });
    }
  });
  it(`should fail if null input`, async () => {
    try {
      const returned = await axios.post(`${url}/job`, {
        seed: "//Alice",
        manifestUrl,
        manifestHash,
        factoryId,
        reputationOracle,
        recordingOracle,
        reputationOracleStake,
      });
    } catch (e) {
      assert.deepEqual(e.response.data, {
        error: "Invalid parameter.",
        parameterName: "recordingOracleStake",
      });
    }
  });
});
