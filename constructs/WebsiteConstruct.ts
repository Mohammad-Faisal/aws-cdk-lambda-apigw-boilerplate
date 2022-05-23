import { Construct } from "constructs";
import {
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfrontOrigins,
} from "aws-cdk-lib";

export class MySimpleWebsite extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const myBucket = new s3.Bucket(this, "MyBucket");
    new cloudfront.Distribution(this, "MyDistribution", {
      defaultBehavior: { origin: new cloudfrontOrigins.S3Origin(myBucket) },
    });
  }
}
