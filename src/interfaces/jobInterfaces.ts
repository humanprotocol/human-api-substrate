import { Address, Amount, Hash, PrivateKey, Url } from "../types";

export interface Credentials {
  gasPayer: Address;
  gasPayerPriv: PrivateKey;
}

export interface StorageInfo {
  hash: Hash;
  url: Url;
}

export interface Payouts {
  addresses: Array<Address>;
  amounts: Array<Amount>;
}
