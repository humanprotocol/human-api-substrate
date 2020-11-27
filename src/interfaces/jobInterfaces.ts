import {PrivateKey, Address, ManifestHash, ManifestUrl, Status, EndTime} from '../types'

export interface Credentials {
	gasPayer: Address
	gasPayerPriv: PrivateKey
}

export interface ManifestInfo {
	manifestHash: ManifestHash, 
	manifestUrl: ManifestUrl
}

export interface Payouts {
	to: Address, 
	Amount: Number
}

export interface EscrowInfo {
	status: Status,
	end_time: EndTime,
  	manifest_url: ManifestUrl,
	manifest_hash: ManifestHash,
	reputation_oracle: Address,
	recording_oracle: Address,
	reputation_oracle_stake: Number,
	recording_oracle_stake: Number,
	canceller: Address,
	account: Address
	}
