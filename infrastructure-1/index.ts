import * as aws from "@pulumi/aws";
import * as synced from "@pulumi/synced-folder";

// Create an S3 bucket configured for static website hosting
const bucket = new aws.s3.Bucket("dev-mood-1-bucket", {
  website: {
    indexDocument: "index.html", // Main entry point of the static site
    errorDocument: "404.html",   // Optional custom error page
  },
});

// Upload contents of the `./out` directory to the S3 bucket
new synced.S3BucketFolder("dev-mood-1-bucket-folder", {
  path: "./out",              // Local path to the static build output
  bucketName: bucket.bucket,  // Reference to the S3 bucket name
  acl: aws.s3.PrivateAcl,     // Files are uploaded with private ACL
});

// Allow public access by disabling all S3 Public Access Blocks
new aws.s3.BucketPublicAccessBlock("dev-mood-1-bucket-public-access-block", {
  bucket: bucket.id,
  blockPublicAcls: false,        // Allow use of public ACLs
  blockPublicPolicy: false,      // Allow public bucket policies
  ignorePublicAcls: false,       // Do not ignore public ACLs
  restrictPublicBuckets: false,  // Do not restrict public access
});

// Create a bucket policy that allows public read access to all files
new aws.s3.BucketPolicy("dev-mood-1-bucket-policy", {
  bucket: bucket.id,
  policy: bucket.bucket.apply((bucketName) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject", // Statement identifier
          Effect: "Allow",            // Allow access
          Principal: "*",             // Any user (public)
          Action: "s3:GetObject",     // Allow read-only access
          Resource: `arn:aws:s3:::${bucketName}/*`, // Target all objects in the bucket
        },
      ],
    })
  ),
});

// Export the website's public URL (HTTP only)
export const websiteUrl = bucket.websiteEndpoint.apply(
  (websiteEndpoint) => `http://${websiteEndpoint}`
);
