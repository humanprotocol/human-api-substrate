// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Bytes, Enum, Struct, u128, u64 } from '@polkadot/types';
import type { AccountId, Percent } from '@polkadot/types/interfaces/runtime';

/** @name EscrowId */
export interface EscrowId extends u128 {}

/** @name EscrowInfo */
export interface EscrowInfo extends Struct {
  readonly status: EscrowStatus;
  readonly end_time: Moment;
  readonly manifest_url: Bytes;
  readonly manifest_hash: Bytes;
  readonly reputation_oracle: AccountId;
  readonly recording_oracle: AccountId;
  readonly reputation_oracle_stake: Percent;
  readonly recording_oracle_stake: Percent;
  readonly canceller: AccountId;
  readonly account: AccountId;
}

/** @name EscrowStatus */
export interface EscrowStatus extends Enum {
  readonly isPending: boolean;
  readonly isPartial: boolean;
  readonly isPaid: boolean;
  readonly isComplete: boolean;
  readonly isCancelled: boolean;
}

/** @name Moment */
export interface Moment extends u64 {}

/** @name ResultInfo */
export interface ResultInfo extends Struct {
  readonly results_url: Bytes;
  readonly results_hash: Bytes;
}

export type PHANTOM_ESCROW = 'escrow';
