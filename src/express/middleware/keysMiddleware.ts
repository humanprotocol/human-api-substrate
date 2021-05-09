/* eslint-disable no-prototype-builtins */
import * as express from "express";

import { createPair } from "@polkadot/keyring/pair";
import { hexToU8a } from "@polkadot/util";
import { encodeAddress as toSS58 } from "@polkadot/util-crypto";

export default function keysMiddleware(
  request: express.Request,
  response: express.Response,
  next: () => void
) {
  const body = request.body;
  let sender = null;

  if (
    body.hasOwnProperty("gasPayer") &&
    body.hasOwnProperty("gasPayerPrivate") &&
    !body.hasOwnProperty("seed")
  ) {
    const publicKey = hexToU8a(body.gasPayer);
    const privateKey = hexToU8a(body.gasPayerPrivate);
    const pair = createPair(
      { toSS58, type: "sr25519" },
      { publicKey, secretKey: privateKey }
    );

    sender = global.keyring.addPair(pair);
  } else if (body.hasOwnProperty("seed")) {
    sender = global.keyring.addFromUri(body.seed);
  } else {
    response.status(400).send({
      error: "Invalid parameter.",
      parameter_name: "gasPayer",
    });
  }

  body.sender = sender;

  next();
}
