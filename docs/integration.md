# Integration

Integration works via pulling in the `hmt-js` typescript library which connects to the blockchain node.

## .env

A `.env` file is needed for the s3 integration with the following format:

```
aws_access_key_id=
aws_secret_access_key=
bucket_name=
```

The library can be used without this info except for

- launch job
- any read call that requires the download functionality
- any write call that requires the upload functionality

## Setup

To launch any jobs you need an api instance which will serve as a websocket connection to your node.
You should create this once with the setup function and pass this into your jobs (you can reuse the
connection in multiple jobs).

To launch any jobs that have writes you will need to create a keyring pair object which can be created
with the keyring object returned from the setup function.

Refer to the documentation for more information about the [api](https://polkadot.js.org/docs/api) or
the [keyring](https://polkadot.js.org/docs/keyring).

```javascript
	import { Job, JobReads, setup } from "../src/index";

	// return the api and keyring from setup will return the default local host connection to api
	const {api, keyring} = await setup();

	// connection to non default endpoint
	//const {api, keyring} = await setup("wss://rpc.polkadot.io");

	// keyring pair object
	const keyringPair = keyring.addFromUri(<Secret>);
```

## Launching a Job

A job can be launched in four different ways.

### Read Only

If you only require read access then you only need the api object to launch the job.
You will also need the id to query the escrow.

```javascript
const escrowId = 5;
const jobRead = new JobReads(api, escrowId);
```

### Writing to an Existing Job

You can launch a job that can write to an already launched escrow instance.

```javascript
const job = new Job(api, keyringPair, escrowId);
```

### Creating a Job from Configuration

You can create a new job by passing in the required information.

```javascript
// example manifest hash and url
const manifestHash =
  "0x251015a125f7d34f924ac5ac848f120b659f09863e4e355641420f56425833b5";
const manifestUrl =
  "https://human-parity-is-the-best.s3.amazonaws.com/s3" + manifestHash;
const reputationOracleAddress =
  "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
const reputationOracleAddress = recordingOracleAddress;
const reputationOracleStake = 5;
const recordingOracleStake = reputationOracleStake;

const job = await Job.createEscrow(
  api,
  keyringPair,
  manifestUrl,
  manifestHash,
  reputationOracleAddress,
  recordingOracleAddress,
  reputationOracleStake,
  recordingOracleStake
);
```

### Launching a Job from a Manifest

You can launch a job from only the manifest. This will also upload the manifest to s3 so this
requires a completed `.env` file.

```javascript
const manifest = {
  recording_oracle_addr: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  reputation_oracle_addr: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  requester_accuracy_target: 0.8,
  job_mode: "batch",
  // -- snip --
};
const job = await Job.launch(api, keyringPair, manifest);
```

## Interacting with a Job

Once you have a `Job` instance in hand, you can interact with the escrow on chain.
Here is an example of how you would use the bulk payout functionality:

```javascript
const bob = keyring.addFromUri("//Bob");
const charlieAddress = "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y";
const payouts = {
  addresses: [bob.address, charlieAddress],
  amounts: [200, 400],
};
await job.bulkPayout(payouts);
```

## Error Handling

The library passes errors down to the user by returning a rejected promise. Handling these is the
responsibility of the integrator.
