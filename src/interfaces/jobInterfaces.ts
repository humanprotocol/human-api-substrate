import {PrivateKey, Address, Hash, Url, Status, EndTime} from '../types'

export interface Credentials {
	gasPayer: Address
	gasPayerPriv: PrivateKey
}

export interface StorageInfo {
	hash: Hash, 
	url: Url
}

export interface Payouts {
	to: Address, 
	Amount: Number
}

export interface EscrowInfo {
	status: Status,
	end_time: EndTime,
  	manifest_url: Url,
	manifest_hash: Hash,
	reputation_oracle: Address,
	recording_oracle: Address,
	reputation_oracle_stake: Number,
	recording_oracle_stake: Number,
	canceller: Address,
	account: Address
	}
