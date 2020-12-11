import BN from "bn.js";
import { AccountId } from "@polkadot/types/interfaces";

export interface Manifest {
  recording_oracle_addr: string;
  reputation_oracle_addr: string;
  oracle_stake: number;
  [propName: string]: any;
}

export interface Payouts {
  addresses: Array<AccountId | string>;
  amounts: Array<BN | number>;
}

export interface StorageInfo {
  hash: string;
  url: string;
}
