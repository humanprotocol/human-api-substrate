# Integration

## .env

- a .env file is needed for the s3 integrations

```
aws_access_key_id=
aws_secret_access_key=
bucket_name=
```

- The library can be used without this info except for
  - launch job
  - any read call that requires the download functionality
  - any write call that requires the upload functionality

## Setup

- To launch any jobs you need an api instance which will serve as a websocket connection to your node. You should create this once with the setup function and pass this into your jobs (you can reuse the connection in multiple jobs)
- To launch any jobs that have writes you will need to create a wallet object which can be created with the keyring object returned from the setup function

```javascript
	import { Job, JobReads, setup } from "../src/index";

	// return the api and keyring from setup will return the default local host connection to api
	 const {api, keyring} = await setup();

	//connection to non default endpoint
    //const {api, keyring} = await setup("wss://rpc.polkadot.io");

	// wallet object
	const alice = keyring.addFromUri(<Secret>);

```

## Launching a Job

- A job can be launched in four different ways

### Read Only

- if you require read only then you only need the api object to launch the job.
- You will also need the escrow id to query

```javascript
const jobRead = new JobReads(api, escrowId);
```

### Writing to an existing job

- you can launch a job that can write to an already launched escrow instance

```javascript
const job = new Job(api, wallet, escrowId);
```

### Launching a job with the proper information

- you can launch a job by passing in the required info

```javascript
const job = await Job.createEscrow(
  api,
  wallet,
  manifestUrl,
  manifestHash,
  reputation_oracle_addr,
  recording_oracle_addr,
  oracleStake
);
```
