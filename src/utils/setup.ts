import "@polkadot/api/augment";
import "@polkadot/types/augment";

import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";

import { Setup } from "../interfaces";
import * as definitions from "../typegen/src/interfaces/definitions";

/**
 * @param endpoint optional endpoint to override default localhost
 * @returns api object and keyring object
 */
export default async (endpoint?: string): Promise<Setup> => {
  const wsProvider = endpoint
    ? new WsProvider(endpoint)
    : new WsProvider("ws://127.0.0.1:9944");
  const types = Object.values(definitions).reduce(
    (res, { types }): any => ({ ...res, ...types }),
    {}
  );
  const api = await ApiPromise.create({ provider: wsProvider, types });
  const keyring = new Keyring({ type: "sr25519" });

  return { api, keyring };
};
