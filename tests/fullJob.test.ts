import { Job, setup } from "../src/index";
import BN from 'bn.js';
import manifest from '../example-manifest.json'
import should from 'should'
const assert = require('assert');

describe("job", async () => {
  let api: any;
  let keyring: any;
  let alice: any;
  let bob: any;
  let charlie: any;
  let mockData: any;
  before(async function () {
    let obj = await setup();
    api = obj.api;
    keyring = obj.keyring;
    alice = keyring.addFromUri("//Alice");
    bob = keyring.addFromUri("//Bob");
    charlie = keyring.addFromUri("//Charlie");
    mockData = {
			status: 'Pending',
			end_time: '0',
			manifest_url: '0x68747470733a2f2f68756d616e2d7061726974792d69732d7468652d626573742e73332e616d617a6f6e6177732e636f6d2f7333307832353130313561313235663764333466393234616335616338343866313230623635396630393836336534653335353634313432306635363432353833336235',
			manifest_hash: '0x251015a125f7d34f924ac5ac848f120b659f09863e4e355641420f56425833b5',
			reputation_oracle: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
			recording_oracle: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
			reputation_oracle_stake: 5,
			recording_oracle_stake: 5,
			canceller: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
			account: ''
		  } 

  });
  after(function () {
    api.disconnect();
  });

  it(`create an escrow`, async () => {
    const manifestUrl = "some.url";
    const manifestHash = "0xdev";
    const job = await Job.createEscrow(
      api,
      alice,
      manifestUrl,
      manifestHash,
      bob.address,
      charlie.address,
      new BN("10")
    );
  });
  it('launches a job', async () => {
    const job = await Job.launch(
      api, 
      alice, 
      manifest
    )
    const escrow = await job.escrow()
    mockData.end_time = escrow.end_time
    mockData.account = escrow.account
    assert.deepEqual(escrow, mockData, "escrow should match mock data")
    const palletBalance = await job.balance()
    assert(palletBalance.toString() !== "0") 
  })
});
