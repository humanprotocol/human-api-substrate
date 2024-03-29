/* eslint-disable @typescript-eslint/camelcase */

export default {
  types: {
    EscrowId: "u128",
    FactoryId: "u128",
    Moment: "u64",
    EscrowStatus: {
      _enum: ["Pending", "Partial", "Paid", "Complete", "Cancelled"],
    },
    EscrowInfo: {
      status: "EscrowStatus",
      end_time: "Moment",
      manifest_url: "Vec<u8>",
      manifest_hash: "Vec<u8>",
      reputation_oracle: "AccountId",
      recording_oracle: "AccountId",
      reputation_oracle_stake: "Percent",
      recording_oracle_stake: "Percent",
      canceller: "AccountId",
      account: "AccountId",
    },
    ResultInfo: {
      results_url: "Vec<u8>",
      results_hash: "Vec<u8>",
    },
  },
};
