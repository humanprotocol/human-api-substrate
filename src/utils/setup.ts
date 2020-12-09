import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';

import * as types from '../config/types.json';
import { Setup } from '../interfaces';

export default async (): Promise<Setup> => {
  const wsProvider = new WsProvider('ws://127.0.0.1:9944');
  const api = await ApiPromise.create({ provider: wsProvider, types });
  const keyring = new Keyring({ type: 'sr25519' });

  return { api, keyring };
};
