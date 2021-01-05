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

    const escrow =  await axios.post(url, {
  		functionName: "escrow",
  		escrowId: returned.data.escrowId,
      seed: "//Alice",

    })
    assert.equal(escrow.data.status, "Pending")
  });

  it.only(`should create an escrow and bulk payout`, async () => {
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

    assert.equal(returned.status, "200")
    const escrow =  await axios.post(url, {
  		functionName: "escrow",
  		escrowId: returned.data.escrowId,
      seed: "//Alice",

    })

    const toSend = "2000000000000"
    const returnedFund = await axios.post(url, {
  		functionName: "fundEscrow",
  		escrowId: returned.data.escrowId,
      seed: "//Alice",
      amount: toSend,
      escrowAddress: escrow.data.account

    })
    assert.equal(returnedFund.status, "200")

    const returnedBalance = await axios.post(url, {
  		functionName: "balance",
  		escrowId: returned.data.escrowId,
    })

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
  		payouts: payout
    })

    assert.equal(returnedBulk.status, "200")

    const returnedBalanceAfter = await axios.post(url, {
  		functionName: "balance",
  		escrowId: returned.data.escrowId,
    })

    assert.equal("0", returnedBalanceAfter.data.toString());
    const returnedCompleted = await axios.post(url, {
      functionName: "complete",
      escrowId: returned.data.escrowId,
      seed: "//Alice",
    });
    assert.equal(returnedCompleted.status, "200");
    const escrowCompleted =  await axios.post(url, {
      functionName: "escrow",
      escrowId: returned.data.escrowId,
      seed: "//Alice",

    })
    assert.equal(escrowCompleted.data.status, "Complete")
  });
  it(`should add a trusted handler`, async () => {
    const dave = "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy"
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
    
    assert.equal(returnedAfter.data, true)
    assert.equal(returned.status, "200");
  });
 
  it(`should cancel`, async () => {
      const returned = await axios.post(url, {
        functionName: "cancel",
        escrowId,
        seed: "//Alice",
      });
      assert.equal(returned.status, "200");
      const escrow =  await axios.post(url, {
        functionName: "escrow",
        escrowId: returned.data.escrowId,
        seed: "//Alice",
  
      })
      assert.equal(escrow.data.status, "Cancelled")
   
  });

  it.skip(`should store final results`, async () => {
    const finalResults = { results: "final" };
    const returned = await axios.post(url, {
      functionName: "storeFinalResults",
      escrowId,
      seed: "//Alice",
      results: finalResults
    });
    assert.equal(returned.status, "200");
    const returnedfinalResults = await axios.post(url, {
      functionName: "finalResults",
      escrowId,
      seed: "//Alice",
      results: finalResults
    });

    assert.equal(returnedfinalResults.data, finalResults)

});
it(`should abort`, async () => {
  const returned = await axios.post(url, {
    functionName: "abort",
    escrowId,
    seed: "//Alice",
  });
  assert.equal(returned.status, "200");
  const escrow =  await axios.post(url, {
    functionName: "escrow",
    escrowId: returned.data.escrowId,
    seed: "//Alice",

  })
  assert.equal(escrow.data.status, "Aborted")
});
});
