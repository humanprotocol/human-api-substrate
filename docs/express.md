# Express wrapper

- The express wrapper is meant to be a temporary wrapper that can except json objects and interact with the chain

### Running

- make sure to have a chain running at port 9944 (docker-compose up will start a chain for you if not running)
- `yarn`
- `yarn start` (use yarn express for dev mode)

### Config

- in express/config/config.ts you can add a custom ws endpoint/ default is local host

### Usage

- There is one endpoint and it takes a function name plus desired parameters in a post call.

### examples

- examples can be found in express.test.ts

```javascript
const returned = await axios.post(url, {
  functionName: "launch",
  seed: "//Alice",
  manifest,
});
```

- will return the escrow Id that was created

```javascript
const returnedBalance = await axios.post(url, {
  functionName: "balance",
  escrowId,
});
```

- will return the balance of the escrow Id
