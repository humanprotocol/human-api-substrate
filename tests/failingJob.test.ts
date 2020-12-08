import { Job, setup, Payouts } from "../src/index";
import BN from "bn.js";
import manifest from "../example-manifest.json";
import { hash, getDecimals, formatDecimals, sendAndWaitFor } from "../src/utils/substrate";

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
	  should.fail("no error was thrown when it should have been", "");
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
		should.fail("no error was thrown when it should have been", "");
	} catch (e) {
		assert.equal(
			e.message, 
			"balances.ExistentialDeposit:  Value too low to create account due to existential deposit"
		)
	}
  });
  it("fails launch on create escrow", async () => {
	try {
		await Job.launch(
		  api,
		  eve,
		  manifest
		);
		should.fail("no error was thrown when it should have been", "");
	  } catch (e) {
		assert.equal(e.message, "1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low");
	  }
  })

  it("fails launch on funding escrow", async () => {
	  manifest.task_bid_price = "10"
	  const call = api.tx.balances.transfer(dave.address, "100000000000000");
	  await sendAndWaitFor(api, call, alice, { section: "balances", name: "Transfer" }).catch((e) => {throw new Error(e.message)});
	  const currentEscrow = await api.query.escrow.counter()
	  try {
		await Job.launch(
		  api,
		  dave,
		  manifest
		);
	   should.fail("no error was thrown when it should have been", "");
	  } catch (e) {
		assert.equal(e.message, `Escrow ${currentEscrow.toString()} create but not funded balances.InsufficientBalance:  Balance too low to send value`);
	  }
	  manifest.task_bid_price = "0.000064"
  })
  it("fails to add trusted handler", async () => {
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
	  const bobJob = await new Job(api, bob, job.escrowId)
	  try {
	   await bobJob.addTrustedHandlers(handlers);
	   should.fail("no error was thrown when it should have been", "");
	  } catch (e) {
		assert.equal(e.message, `escrow.NonTrustedAccount:  The account associated with the origin does not have the privilege for the operation.`);
	  }
  
  })
  it("fails to add trusted handler no money in account", async () => {
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
	  const eveJob = await new Job(api, eve, job.escrowId)
	  try {
	   await eveJob.addTrustedHandlers(handlers);
	   should.fail("no error was thrown when it should have been", "");
	  } catch (e) {
		assert.equal(e.message, `1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low`);
	  }
  
  })
  it("fails to bulk payout", async () => {
	const job = await Job.createEscrow(
		api,
		alice,
		manifestUrl,
		manifestHash,
		manifest.reputation_oracle_addr,
		manifest.recording_oracle_addr,
		new BN("5")
	  );

	  const bobJob = await new Job(api, bob, job.escrowId)
	  const payout: Payouts = {
		addresses: [charlie.address, dave.address],
		amounts: [formatDecimals(api, 3), formatDecimals(api, 3)],
	  };
	  try {
	   await bobJob.bulkPayout(payout);
	   should.fail("no error was thrown when it should have been", "");
	  } catch (e) {
		assert.equal(e.message, `escrow.NonTrustedAccount:  The account associated with the origin does not have the privilege for the operation.`);
	  }
  })
  it("fails to store final results", async () => {
	const job = await Job.createEscrow(
		api,
		alice,
		manifestUrl,
		manifestHash,
		manifest.reputation_oracle_addr,
		manifest.recording_oracle_addr,
		new BN("5")
	  );

	  const bobJob = await new Job(api, bob, job.escrowId)
	  const finalResults = { results: "final" };

	  try {
	   await bobJob.storeFinalResults(finalResults);
	   should.fail("no error was thrown when it should have been", "");
	  } catch (e) {
		assert.equal(e.message, `Results stored at https://human-parity-is-the-best.s3.amazonaws.com/s30xbda0b7365646a7b7aba74e08fa6514cae947d9f5a9d5265d34741ee739eb1e68, but failed to post on blockchain escrow.NonTrustedAccount:  The account associated with the origin does not have the privilege for the operation.`);
	  }
  })
  it("fails to abort", async () => {
	const job = await Job.createEscrow(
		api,
		alice,
		manifestUrl,
		manifestHash,
		manifest.reputation_oracle_addr,
		manifest.recording_oracle_addr,
		new BN("5")
	  );

	  const bobJob = await new Job(api, bob, job.escrowId)
	  const payout: Payouts = {
		addresses: [charlie.address, dave.address],
		amounts: [formatDecimals(api, 3), formatDecimals(api, 3)],
	  };
	  try {
	   await bobJob.abort();
	   should.fail("no error was thrown when it should have been", "");
	  } catch (e) {
		assert.equal(e.message, `escrow.NonTrustedAccount:  The account associated with the origin does not have the privilege for the operation.`);
	  }
  })
  it("fails to cancel", async () => {
	const job = await Job.createEscrow(
		api,
		alice,
		manifestUrl,
		manifestHash,
		manifest.reputation_oracle_addr,
		manifest.recording_oracle_addr,
		new BN("5")
	  );

	  const bobJob = await new Job(api, bob, job.escrowId)
	  const payout: Payouts = {
		addresses: [charlie.address, dave.address],
		amounts: [formatDecimals(api, 3), formatDecimals(api, 3)],
	  };
	  try {
	   await bobJob.cancel();
	   should.fail("no error was thrown when it should have been", "");
	  } catch (e) {
		assert.equal(e.message, `escrow.NonTrustedAccount:  The account associated with the origin does not have the privilege for the operation.`);
	  }
  })
  it("fails to store intermediate results", async () => {
	const job = await Job.createEscrow(
		api,
		alice,
		manifestUrl,
		manifestHash,
		manifest.reputation_oracle_addr,
		manifest.recording_oracle_addr,
		new BN("5")
	  );

	  const bobJob = await new Job(api, bob, job.escrowId)
	  const finalResults = { results: "final" };

	  try {
	   await bobJob.noteIntermediateResults(finalResults);
	   should.fail("no error was thrown when it should have been", "");
	  } catch (e) {
		assert.equal(e.message, `Results stored at https://human-parity-is-the-best.s3.amazonaws.com/s30xbda0b7365646a7b7aba74e08fa6514cae947d9f5a9d5265d34741ee739eb1e68, but failed to post on blockchain escrow.NonTrustedAccount:  The account associated with the origin does not have the privilege for the operation.`);
	  }
  })
  it("fails to complete", async () => {
	const job = await Job.createEscrow(
		api,
		alice,
		manifestUrl,
		manifestHash,
		manifest.reputation_oracle_addr,
		manifest.recording_oracle_addr,
		new BN("5")
	  );

	  const bobJob = await new Job(api, bob, job.escrowId)
	  const payout: Payouts = {
		addresses: [charlie.address, dave.address],
		amounts: [formatDecimals(api, 3), formatDecimals(api, 3)],
	  };
	  try {
	   await bobJob.complete();
	   should.fail("no error was thrown when it should have been", "");
	  } catch (e) {
		assert.equal(e.message, `escrow.NonTrustedAccount:  The account associated with the origin does not have the privilege for the operation.`);
	  }
  })
});
