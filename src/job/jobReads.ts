import { Manifest } from "src/interfaces";

import { ApiPromise } from "@polkadot/api";
import { AccountId, Balance } from "@polkadot/types/interfaces";

import { download } from "../storage";
import { EscrowId, EscrowInfo, PrivateKey } from "../types";

export default class JobReads {
  api: ApiPromise;
  escrowId: EscrowId;
  storedIntermediateResults: any[];

  constructor(api: ApiPromise, escrowId: EscrowId) {
    this.api = api;
    this.escrowId = escrowId;
    this.storedIntermediateResults = [];
  }

  /**
   * @returns the escrow info object
   */
  async escrow(): Promise<EscrowInfo> {
    const escrow = await this.api.query.escrow.escrows(this.escrowId);

    return escrow.unwrap();
  }

  /**
   *
   * @param address the address of the account queried
   * @returns boolean
   * @dev retrieves if the address is a trusted handler from the escrow instance
   */
  async isTrustedHandler(address: AccountId | string): Promise<boolean> {
    const isTrustedHandler = await this.api.query.escrow.trustedHandlers(
      this.escrowId,
      address
    );

    return isTrustedHandler.valueOf();
  }

  /**
   * @return balance of escrow instance
   */
  async balance(): Promise<Balance> {
    const escrow = await this.escrow();
    const balance = await this.api.query.system.account(escrow.account);

    return balance.data.free;
  }

  /**
   * @param manifestUrl the url of the manifest to return
   * @param privKey private key of user who encrypted manifest
   * @returns the plain text manifest or error if can't decrypt
   */
  async manifest(url: string, privKey?: PrivateKey): Promise<Manifest> {
    return JSON.parse(await download(url, privKey));
  }

  /**
   *
   * @param index index of intermediate result to get
   * @param privKey private Key of encrypted data
   * @returns the manifest or error if can't decrypt
   */
  public async intermediateResults(
    index: any,
    privKey?: PrivateKey
  ): Promise<any> {
    if (!this.storedIntermediateResults[index]) {
      throw new Error("Intermediate Results out of bounds");
    }

    // TODO test this when able to (writes complete)
    return download(this.storedIntermediateResults[index].url, privKey);
  }

  /**
   *
   * @param privKey private Key of encrypted data
   * @returns the manifest, error if can't decrypt error if no final results
   */
  public async finalResults(privKey?: PrivateKey): Promise<any> {
    // TODO get proper type from polkadot js
    const finalResultsOption = await this.api.query.escrow.finalResults(
      this.escrowId
    );
    const finalResults = finalResultsOption.unwrap();
    // we know that the final results url is a Utf8 string
    const url = finalResults.results_url.toUtf8();

    return download(url, privKey);
  }
}
