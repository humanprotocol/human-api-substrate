# Express wrapper

- The express wrapper is meant to be a temporary wrapper that can accept json objects and interact with the chain.

### Running

- Make sure to have the HPF Substrate chain running at port 9944 (docker-compose up will start a chain for you if not running)
- `yarn`
- `yarn start` (use yarn express for dev mode)

### Config

- in express/config/config.ts you can add a custom ws endpoint/ default is local host

### Usage

- The API is designed as per the HPF Swagger Spec available at [https://app.swaggerhub.com/apis/excerebrose/human-protocol/1.0.0#/](https://app.swaggerhub.com/apis/excerebrose/human-protocol/1.0.0#/).

### examples

- examples can be found in express.test.ts

```javascript
const returned = await axios.post(url, {
  seed: "//Alice",
  manifest,
});
```

- will return the escrow Id that was created

```javascript
const returnedBalance = await axios.post(url, {
  escrowId,
});
```

- will return the balance of the escrow Id
