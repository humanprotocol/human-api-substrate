import { ApiPromise } from "@polkadot/api";
import BN from "bn.js";
import { EscrowId, Address, Url, PrivateKey, Manifest } from "../types";
import { download } from "../storage";
import { createType } from "@polkadot/types";

export default class JobReads {
  api: ApiPromise;
  escrowId: EscrowId;
  storedIntermediateResults: any[];

  constructor(api: ApiPromise, escrowId: EscrowId) {
    this.api = api;
    this.escrowId = escrowId;
    this.storedIntermediateResults = [];
  }

  async escrow(): Promise<any> {
    const escrow = await this.api.query.escrow.escrows(this.escrowId);
    return escrow.toJSON();
  }

  /**
   *
   * @param address the address of the account queried
   * @return Boolean
   * @dev Retrieves if the address is a trusted handler from the escrow instance
   */
  async isTrustedHandler(address: Address): Promise<boolean> {
    const isTrustedHander = await this.api.query.escrow.trustedHandlers(this.escrowId, address.toString());
    let trusted = this.api.createType("bool", isTrustedHander);
    return trusted.valueOf();
  }

  /**
   * @return balance of escrow instance
   */
  async balance(): Promise<BN> {
    const escrow = await this.escrow();
    const balance = await this.api.query.system.account(escrow.account);
    return balance.data.free;
  }

  /**
   * @param privKey private key of user who encrypted manifest
   * @param manifestUrl The url of the manifest to return
   * @returns the plain text manifest or error if can't decrypt
   */
  async manifest(url: Url, privKey?: PrivateKey): Promise<Manifest> {
    return download(url, privKey);
  }
  /**
   *
   * @param privKey Private Key of encrypted data
   * @param index index of intermediate result to get
   * @returns The manifest or error if can't decrypt
   */
  public async intermediateResults(index: any, privKey?: PrivateKey): Promise<Manifest> {
    if (!this.storedIntermediateResults[index]) {
      throw new Error("Intermediate Results out of bounds");
    }
    // TODO test this when able to (writes complete)
    return this.manifest(this.storedIntermediateResults[index].url, privKey);
  }

  /**
   *
   * @param privKey Private Key of encrypted data
   * @returns The manifest, error if can't decrypt error if no final results
   */
  public async finalResults(privKey?: PrivateKey): Promise<any> {
    //TODO get proper type from polkadot js
    const finalResultsOption: any = await this.api.query.escrow.finalResults(this.escrowId);
    const finalResults = finalResultsOption.unwrap();
    return this.manifest(finalResults.results_url.toHuman(), privKey);
  }
}
