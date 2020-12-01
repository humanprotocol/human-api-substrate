import { ManifestInfo } from '../interfaces'
import { Manifest, ManifestUrl, PrivateKey } from '../types'
import { hash } from '../utils/substrate'
import AWS from 'aws-sdk';


const s3 = new AWS.S3({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key
});

const Bucket_Name: String = process.env.BUCKET_NAME ? process.env.BUCKET_NAME : " "

export const upload = async (manifest: Manifest, pubKey?: String): Promise<ManifestInfo> => {
		const manifestHash = hash(JSON.stringify(manifest))
		const Key = `s3${manifestHash}`
		const params: AWS.S3.Types.PutObjectRequest = {
			Bucket: Bucket_Name.toString(),
			Key, // File name you want to save as in S3
			Body: JSON.stringify(manifest),
			ContentType: 'application/json; charset=utf-8',
			// ACL: 'public-read', TODO decide if this needs to go in
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


export const download = async (manifestUrl: ManifestUrl, privKey?: PrivateKey): Promise<Manifest> => {
	const Key = manifestUrl.slice(50)
	const params: AWS.S3.Types.PutObjectRequest = {
		Bucket: Bucket_Name.toString(),
		Key, 
	};

	const returnedInfo: any = await new Promise((resolve, reject) => {
		s3.getObject(params, (error, data) => {
			if (error) {
			  return reject(error)
			}
			return resolve(data)
		  })			
	})

	return returnedInfo.Body.toString()
}