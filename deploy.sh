#!/bin/sh
STACK_NAME=serverless-auth
PROFILE_NAME=<your AWS profile>
REGION=eu-west-1
sam deploy --template-file packaged.yaml --stack-name $STACK_NAME --capabilities CAPABILITY_IAM --profile $PROFILE_NAME --region $REGION
exec aws cloudformation describe-stacks --stack-name $STACK_NAME --profile $PROFILE_NAME --region $REGION
