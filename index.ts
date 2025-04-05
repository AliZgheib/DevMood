import * as aws from "@pulumi/aws";
import * as synced from "@pulumi/synced-folder";

const bucket = new aws.s3.Bucket("dev-mood-bucket", {
  website: {
    indexDocument: "index.html", // Configure index.html as the entry point
    errorDocument: "404.html", // Optionally set up error pages
  },
});

new synced.S3BucketFolder("dev-mood-bucket-folder", {
  path: "./out",
  bucketName: bucket.bucket,
  acl: aws.s3.PrivateAcl,
});

new aws.s3.BucketPublicAccessBlock("dev-mood-bucket-public-access-block", {
  bucket: bucket.id,
  blockPublicAcls: false,
  blockPublicPolicy: false,
  ignorePublicAcls: false,
  restrictPublicBuckets: false,
});

new aws.s3.BucketPolicy("dev-mood-bucket-policy", {
  bucket: bucket.id,
  policy: bucket.bucket.apply((bucketName) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: "s3:GetObject",
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    })
  ),
});

export const websiteUrl = bucket.websiteEndpoint.apply(
  (websiteEndpoint) => `http://${websiteEndpoint}`
);
