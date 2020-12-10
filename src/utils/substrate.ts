import BN from "bn.js";

import { ApiPromise, SubmittableResult } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { Keyring } from "@polkadot/keyring";
import { EventRecord } from "@polkadot/types/interfaces/types";
import { blake2AsHex } from "@polkadot/util-crypto";

import { EventFilter } from "../interfaces";
import { Account, Address, Amount, PrivateKey } from "../types";

/**
 * @param privateKey Private key of contract launcher
 * @return address of Private Key
 * @dev Retrieves the address of the private key
 */
export const privateKeyToAddress = (privateKey: PrivateKey): Address => {
  const keyring = new Keyring({ type: "sr25519", ss58Format: 2 });

  return keyring.addFromSeed(privateKey).address;
};

/**
 * @param privateKey Private key of contract launcher
 * @return address of Private Key
 * @dev Retrieves the account of the private key
 */
export const privateKeyToAccount = (privateKey: PrivateKey): Account => {
  const keyring = new Keyring({ type: "sr25519", ss58Format: 2 });

  return keyring.addFromSeed(privateKey);
};

export const getDecimals = (api: ApiPromise): number => {
  return api.registry.chainDecimals;
};

export const formatDecimals = (api: ApiPromise, amount: number): Amount => {
  return new BN(amount * 10 ** getDecimals(api));
};

/**
 * Signs and sends the given `call` from `sender` and waits for an event that fits `filter`.
 * @param api api object
 * @param call a call that can be submitted to the chain
 * @param sender the sender of the transaction
 * @param filter which event to filter for
 */
export function sendAndWaitFor(
  api: ApiPromise,
  call: SubmittableExtrinsic<"promise">,
  sender: Account,
  filter: EventFilter
): Promise<EventRecord> {
  return new Promise<EventRecord>((resolve, reject) => {
    call
      .signAndSend(sender, (res: SubmittableResult) => {
        const { dispatchError, status } = res;

        if (dispatchError) {
          if (dispatchError.isModule) {
            // for module errors, we have the section indexed, lookup
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            const { documentation, name, section } = decoded;

            reject(Error(`${section}.${name}: ${documentation.join(" ")}`));
          } else {
            reject(Error(dispatchError.toString()));
          }
        }

        if (status.isInBlock || status.isFinalized) {
          const record = res.findRecord(filter.section, filter.name);

          if (record) {
            resolve(record);
          } else {
            reject(Error("Event record not found"));
          }
        }
      })
      .catch((e) => {
        reject(Error(e.message));
      });
  });
}

/**
 * Signs and sends the given `call` from `sender` and waits for the transaction to be included in a block.
 * @param api api object
 * @param call a call that can be submitted to the chain
 * @param sender the sender of the transaction
 */
export function sendAndWait(
  api: ApiPromise,
  call: SubmittableExtrinsic<"promise">,
  sender: Account
): Promise<undefined> {
  return new Promise<undefined>((resolve, reject) => {
    call
      .signAndSend(sender, (res: SubmittableResult) => {
        const { dispatchError, status } = res;

        if (dispatchError) {
          if (dispatchError.isModule) {
            // for module errors, we have the section indexed, lookup
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            const { documentation, name, section } = decoded;

            reject(Error(`${section}.${name}: ${documentation.join(" ")}`));
          } else {
            reject(Error(dispatchError.toString()));
          }
        }

        if (status.isInBlock || status.isFinalized) {
          resolve(undefined);
        }
      })
      .catch((e) => {
        reject(Error(e.message));
      });
  });
}

export const hash = (data: Uint8Array | string): string => {
  return blake2AsHex(data);
};
