import {PrivateKey, Address, ManifestHash, ManifestUrl} from '../types'

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

