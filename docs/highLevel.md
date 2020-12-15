# High Level Overview

The HUMAN protocol implementation allows matching data providers (like websites) with those that
need that data (e.g. visual machine learning systems).
In the HUMAN protocol a data consumer creates a job based on a manifest that includes the relevant
metadata. The job is stored in an escrow system on-chain and funded by the consumer. Data providers
register their produced results with the escrow system and are rewarded by the verifying oracles.

## Architecture

The system in this implementation consists of two parts:

1. the typescript client library
2. the Substrate node with the runtime

The client library allows creating and interacting with jobs. Each of these jobs corresponds to an
escrow in the runtime and allows writing to and reading from them.

```
+-----------------------+     Write     +-------------------+
|  TS Client Library    +-------------->+  Blockchain Node  |
|                       |               |                   |
|    - Job (Escrow 1)   |               |    - Escrow 1     |
|    - Job (Escrow 2)   |     Read      |    - Escrow 2     |
|    ...                +<--------------+    ...            |
+-----------------------+               +-------------------+
```

Escrows are uniquely identified by an escrow id.

## Life Cycle of Escrows

Each escrow moves through the following state transitions:

```
   | [create]
   v
Pending --> Partial --> Paid --> Complete
   |           |
   +-----------+----> Cancelled
```

Escrows are created in the `Pending` state and are initially open for data. While open (`Pending` or
`Partial`) they can still be cancelled or aborted. Once the escrow is paid it transitions into the
corresponding `Paid` state and can be marked as `Complete`d.

## Differences to Solidity Implementation

This implementation skips the `Launched` state present in the Solidity version because the distinction
between contract creation and setup falls away.

The bulk payout in this implementation is transactional, i.e. if any of the transfers fail, the whole
transaction fails and needs to be resubmitted (with modification to make it succeed). This guarantees
the consistency of the state.

Furthermore the Substrate implementation differs by virtue of being a complete blockchain built on a
framework:

| Topic     | Substrate                                            | Ethereum              |
| --------- | ---------------------------------------------------- | --------------------- |
| Token     | own base-level HMT token                             | ERC-20 token contract |
| Fees      | flexible fee structure: feeless or fees payed in HMT | fees in ETH           |
| Execution | Wasm, JIT-compiled                                   | EVM                   |
