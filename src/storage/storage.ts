import { ManifestInfo } from '../interfaces'
import { Manifest, ManifestUrl, PrivateKey } from '../types'




export const upload = async (pubKey: String): Promise<ManifestInfo> => {
		// hashes manifest
		// encrypts manifest with public key
		// takes manifest sends it to S3 
		
		return  {
			manifestHash: "test",
			manifestUrl: "test",
		}
	}


export const download = async (manifestUrl: ManifestUrl, privKey: PrivateKey): Promise<Manifest> => {
	// grabs manifest from s3
	// tries to decrypt with private key
	// returns decrypted
}