// var uuid = require('node-uuid');
module.exports = {

    isEmpty: function(obj) {
        if (null === obj){
            return true;
        }
        if (undefined === obj) {
            return true;
        } else if  ("" === obj) {
            return true;
        } else {
            return Object.keys(obj).length === 0;
        }
    },
    // uuid: function () {
    //     return uuid.v1();
    //
    // },
    parseBodyFromEvent: function (event) {
        var body = {};
        console.log("parseBodyFromEvent: ", event);
        if (!module.exports.isEmpty(event) && !(module.exports.isEmpty(event.body))) {
            // body = Object.assign({}, event.body);
            if ("string" == typeof event.body) {
                body = JSON.parse(event.body);
            } else {
                for (var k in event.body) body[k] = event.body[k];
            }
        }
        return body;
    },
    createResponse: function(statusCode, body) {
        return {
            "statusCode": statusCode,
            "body": body || "",
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true,
                "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, x-api-key"
            },
            "isBase64Encoded": false
        }
    },
    createSvgResponse: function(statusCode, body) {
        return {
            "statusCode": statusCode,
            "body": body || "",
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true,
                "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, x-api-key",
                "Content-Type": "image/svg+xml"
            },
            "isBase64Encoded": false
        }
    },
    createBpmnResponse: function(statusCode, body) {
        return {
            "statusCode": statusCode,
            "body": body || "",
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true,
                "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, x-api-key",
                "Content-Type": "text/xml;charset=utf-8"
            },
            "isBase64Encoded": false
        }
    },
    buildIAMPolicy: function (userId, effect, resource, context) {
        console.log(`buildIAMPolicy ${userId} ${effect} ${resource}`);
        const policy = {
            principalId: userId,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: effect,
                        Resource: resource,
                    },
                ],
            },
            context,
        };

        console.log(JSON.stringify(policy));
        return policy;
    }
};
