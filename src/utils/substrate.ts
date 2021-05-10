import BN from "bn.js";

import { ApiPromise, SubmittableResult } from "@polkadot/api";
import { AddressOrPair, SubmittableExtrinsic } from "@polkadot/api/types";
import { EventRecord } from "@polkadot/types/interfaces/types";
import { blake2AsHex } from "@polkadot/util-crypto";

import { EventFilter } from "../interfaces";

/**
 * @param api api object
 * @returns decimals of the main currency on chain
 */
export const getDecimals = (api: ApiPromise): number => {
  return api.registry.chainDecimals;
};

/**
 * @param api api object
 * @param amount the amount
 * @returns the format `amount` according to/multiply by the decimals of the main currency on chain.
 */
export const formatDecimals = (api: ApiPromise, amount: number): BN => {
  return new BN(amount * 10 ** getDecimals(api));
};

/**
 * Signs and sends the given `call` from `sender` and waits for an event that fits `filter`.
 * @param api api object
 * @param call a call that can be submitted to the chain
 * @param sender the sender of the transaction
 * @param filter which event to filter for
 * @returns event that fits the filter
 */
export function sendAndWaitFor(
  api: ApiPromise,
  call: SubmittableExtrinsic<"promise">,
  sender: AddressOrPair,
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
  sender: AddressOrPair
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

            const err = Error(`${section}.${name}: ${documentation.join(" ")}`);

            err.name = name;
            reject(err);
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

/**
 *
 * @param data the data to be hashed
 * @returns the hashed string
 */
export const hash = (data: Uint8Array | string): string => {
  return blake2AsHex(data);
};
