import { StorageInfo } from '../interfaces'
import { Manifest, Url, PrivateKey } from '../types'
import { hash } from '../utils/substrate'
import AWS from 'aws-sdk';


const s3 = new AWS.S3({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key
});

const bucketName: String = process.env.bucket_name ? process.env.bucket_name : " "

export const upload = async (data: Manifest, pubKey?: String): Promise<StorageInfo> => {
		//TODO handle encryption if pubkey
		const computedHash = hash(JSON.stringify(data))
		const Key = `s3${computedHash}`
		const params: AWS.S3.Types.PutObjectRequest = {
			Bucket: bucketName.toString(),
			Key, // File name you want to save as in S3
			Body: JSON.stringify(data),
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
			hash: computedHash,
			url: returnedInfo.Location
		}
	}


export const download = async (url: Url, privKey?: PrivateKey): Promise<Manifest> => {
	// TODO handle decryption if privKey (throw error if no key)
	const Key = url.slice(50)
	const params: AWS.S3.Types.PutObjectRequest = {
		Bucket: bucketName.toString(),
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