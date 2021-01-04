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

  it(`should launch escrow`, async () => {
    const returned = await axios.post(url, {
      functionName: "launch",
      seed: "//Alice",
      manifest,
    });
    //TODO get escrow ID from chain check to make sure it is the same
    console.log({ escrowId: returned.data.escrowId });
  });

  it(`should create an escrow`, async () => {
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
    console.log({ escrowId: returned.data.escrowId });
  });
  it(`should add a trusted handler`, async () => {
    const returned = await axios.post(url, {
      functionName: "addTrustedHandlers",
      escrowId,
      seed: "//Alice",
      handlers: [reputationOracle],
    });
    assert.equal(returned.status, "200");
  });
  //   it.only(`should do a bulk payout`, async () => {

  // 	const payout = {
  // 		addresses: [reputationOracle, reputationOracle],
  // 		amounts: [5, 5],
  // 	  };

  // 	const returned = await axios.post(url, {
  // 		functionName: "bulkPayout",
  // 		escrowId,
  // 		seed: "//Alice",
  // 		payouts: payout
  //   })
  //   assert.equal(returned.status, "200")
  // });
  it.only(`should cancel`, async () => {
    try {
      const returned = await axios.post(url, {
        functionName: "cancel",
        escrowId,
        seed: "//Alice",
      });
      assert.equal(returned.status, "200");
    } catch (e) {
      console.log(e);
    }
  });
});
