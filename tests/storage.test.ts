import { upload, download } from "../src/storage";
import manifest from "../example-manifest.json";
const assert = require("assert");

describe("Storage", async () => {
  it("should hash and upload to aws", async function () {
    const result = await upload(manifest);
    const mockResult = {
      hash: "0x251015a125f7d34f924ac5ac848f120b659f09863e4e355641420f56425833b5",
      url:
        "https://human-parity-is-the-best.s3.amazonaws.com/s30x251015a125f7d34f924ac5ac848f120b659f09863e4e355641420f56425833b5",
    };
    assert.deepEqual(result, mockResult, "manifest should have been hashed and uploaded to s3");
  });

  it("should hash and download to aws", async function () {
    const manifestUrl =
      "https://human-parity-is-the-best.s3.amazonaws.com/s30x251015a125f7d34f924ac5ac848f120b659f09863e4e355641420f56425833b5";
    const result = await download(manifestUrl);
    assert.equal(result, JSON.stringify(manifest), "should retrieve manifest");
  });
});
