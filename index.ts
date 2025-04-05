import * as aws from "@pulumi/aws";
import * as synced from "@pulumi/synced-folder";

const bucket = new aws.s3.Bucket("dev-mood-bucket", {
  website: {
    indexDocument: "index.html", // Configure index.html as the entry point
    errorDocument: "404.html", // Optionally set up error pages
  },
});

new synced.S3BucketFolder("dev-mood-folder", {
  path: "./frontend/out",
  bucketName: bucket.bucket,
  acl: aws.s3.PrivateAcl,
});

// Export the website URL for later use
export const websiteUrl = bucket.websiteEndpoint.apply(
  (websiteEndpoint) => `http://${websiteEndpoint}`
);
