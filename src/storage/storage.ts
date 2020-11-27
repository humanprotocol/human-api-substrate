import { ManifestInfo } from '../interfaces'
import { Manifest, ManifestUrl, PrivateKey } from '../types'
import { hash } from '../utils/substrate'
import AWS from 'aws-sdk';


const s3 = new AWS.S3({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key
});

export const upload = async (manifest: Manifest, pubKey?: String): Promise<ManifestInfo> => {
		const manifestHash = hash(JSON.stringify(manifest))
		const Bucket_Name: String = process.env.BUCKET_NAME ? process.env.BUCKET_NAME : " "
		const Key = `s3${manifestHash}`
		const params: AWS.S3.Types.PutObjectRequest = {
			Bucket: Bucket_Name.toString(),
			Key, // File name you want to save as in S3
			Body: JSON.stringify(manifest),
			ContentType: 'application/json; charset=utf-8',
		};
		const returnedInfo: any = await new Promise((resolve, reject) => {
			s3.upload(params, (error, data) => {
				if (error) {
				  return reject(error)
				}
				return resolve(data)
			  })			
		})
		return  {
			manifestHash,
			manifestUrl: returnedInfo.Location
		}
	}


export const download = async (manifestUrl: ManifestUrl, privKey: PrivateKey): Promise<Manifest> => {
	// grabs manifest from s3
	// tries to decrypt with private key
	// returns decrypted
}