#!/bin/sh
PROFILE_NAME=<your AWS profile>
REGION=eu-west-1
S3BUCKET=<your AWS S3 Bucket>
sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket $S3BUCKET --profile $PROFILE_NAME --region $REGION
