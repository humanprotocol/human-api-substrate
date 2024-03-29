import AWS from "aws-sdk";

import { StorageInfo } from "../interfaces";
import { PrivateKey } from "../types";
import { hash } from "../utils/substrate";

const s3 = new AWS.S3({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
});

const bucketName: string = process.env.bucket_name
  ? process.env.bucket_name
  : " ";

/**
 *
 * @param data data to upload to s3
 * @param pubKey optional key to encrypt the upload with
 * @returns hash of data and url of storage location
 */
export const upload = async (
  data: any,
  pubKey?: string
): Promise<StorageInfo> => {
  // TODO handle encryption if pubkey
  const computedHash = hash(JSON.stringify(data));
  const Key = `s3${computedHash}`;
  const params: AWS.S3.Types.PutObjectRequest = {
    Bucket: bucketName.toString(),
    Key,
    Body: JSON.stringify(data),
    ContentType: "application/json; charset=utf-8",
    // ACL: 'public-read', TODO decide if this needs to go in
  };
  const returnedInfo: any = await new Promise((resolve, reject) => {
    s3.upload(params, (error, data) => {
      if (error) {
        return reject(error);
      }

      return resolve(data);
    });
  });

  return {
    hash: computedHash,
    url: returnedInfo.Location,
  };
};

/**
 *
 * @param url url to retrieve data from s3
 * @param privKey optional decryption key if data is encrypted
 * @returns stringified data
 */
export const download = async (
  url: string,
  privKey?: PrivateKey
): Promise<string> => {
  // TODO handle decryption if privKey (throw error if no key)
  const s3UrlConstant = "s3.amazonaws.com/";
  const sliceAmount = url.indexOf(s3UrlConstant) + s3UrlConstant.length;
  const Key = url.slice(sliceAmount);

  const params: AWS.S3.Types.PutObjectRequest = {
    Bucket: bucketName.toString(),
    Key,
  };

  const returnedInfo: any = await new Promise((resolve, reject) => {
    s3.getObject(params, (error, data) => {
      if (error) {
        return reject(error);
      }

      return resolve(data);
    });
  });

  return returnedInfo.Body.toString();
};
