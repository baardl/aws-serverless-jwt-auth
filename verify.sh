#!/bin/sh
#https://{restapi_id}.execute-api.{region}.amazonaws.com/{stage_name}/
RESTAPI_ID=<fetch from describe stack>
REGION=eu-west-1
STAGE=Prod
API_GATEWAY_STAGE_URL=https://$RESTAPI_ID.execute-api.$REGION.amazonaws.com/$STAGE

#Verify with "authenticated" user
curl -v --header "Authorization: allow" $API_GATEWAY_STAGE_URL/users