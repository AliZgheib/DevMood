import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as synced from "@pulumi/synced-folder";

// Create private S3 bucket
const bucket = new aws.s3.Bucket("dev-mood-2-bucket");

// Sync local ./out directory to S3
new synced.S3BucketFolder("dev-mood-2-bucket-folder", {
  path: "./out",
  bucketName: bucket.bucket,
  acl: aws.s3.PrivateAcl,
});

// Origin Access Control (OAC) for CloudFront -> S3 access
const originAccessControl = new aws.cloudfront.OriginAccessControl("dev-mood-2-oac", {
  description: "OAC for dev-mood-2 CloudFront access to S3",
  originAccessControlOriginType: "s3",
  signingBehavior: "always",
  signingProtocol: "sigv4",
});

// CloudFront Distribution
const distribution = new aws.cloudfront.Distribution("dev-mood-2-cdn", {
  enabled: true,
  origins: [
    {
      domainName: bucket.bucketRegionalDomainName,
      originId: bucket.arn,
      originAccessControlId: originAccessControl.id,
    },
  ],
  defaultRootObject: "index.html",
  defaultCacheBehavior: {
    targetOriginId: bucket.arn,
    viewerProtocolPolicy: "redirect-to-https",
    allowedMethods: ["GET", "HEAD"],
    cachedMethods: ["GET", "HEAD"],
    forwardedValues: {
      queryString: false,
      cookies: { forward: "none" },
    },
  },
  priceClass: "PriceClass_100",
  viewerCertificate: {
    cloudfrontDefaultCertificate: true,
  },
  restrictions: {
    geoRestriction: {
      restrictionType: "none",
    },
  },
});

// Public access is disabled, only CloudFront can read
new aws.s3.BucketPublicAccessBlock("dev-mood-2-bucket-public-access-block", {
  bucket: bucket.id,
  blockPublicAcls: true,
  blockPublicPolicy: true,
  ignorePublicAcls: true,
  restrictPublicBuckets: true,
});

// Bucket policy to allow CloudFront (via OAC) to access objects
new aws.s3.BucketPolicy("dev-mood-2-bucket-policy", {
  bucket: bucket.id,
  policy: pulumi.all([bucket.arn, distribution.arn]).apply(([bucketArn, cfArn]) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "AllowCloudFrontServicePrincipalReadOnly",
          Effect: "Allow",
          Principal: {
            Service: "cloudfront.amazonaws.com",
          },
          Action: "s3:GetObject",
          Resource: `${bucketArn}/*`,
          Condition: {
            StringEquals: {
              "AWS:SourceArn": cfArn,
            },
          },
        },
      ],
    })
  ),
});

// Export CDN URL
export const websiteUrl = pulumi.interpolate`https://${distribution.domainName}`;
