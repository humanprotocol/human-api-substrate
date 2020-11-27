import { ManifestInfo } from '../interfaces'
import { Manifest, ManifestUrl, PrivateKey } from '../types'
import { hash } from '../utils/substrate'
import AWS from 'aws-sdk';


const s3 = new AWS.S3({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key
});

export const upload = async (pubKey: String, manifest: Manifest): Promise<ManifestInfo> => {
		const hashedManifest = hash(manifest)
		console.log(hashedManifest)
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