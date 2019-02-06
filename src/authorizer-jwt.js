'use strict';

console.log('Loading function');
// let jwt = require('jsonwebtoken');
let utils = require('./utils');

/*
{
  "sub": "useradmin",
  "jti": "7533788d-75c8-4587-8b29-d8fce9362958",
  "iss": "",
  "aud": "",
  "iat": 1548228060,
  "userticket": "f8383039-08da-4a9d-a975-c2e30e3c354f",
  "roles": [],
  "exp": 1548314460
}
*/

exports.validate = (event, context, callback) => {

    console.log('authorize');
    console.log(event);
    const token = event.authorizationToken;

    try {
        // Verify JWT
        //TODO Verify using public key
        // TODO const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const decoded = false; //decodeFromIdToken(token);
        if (decoded) {
            console.log(JSON.stringify(decoded));

            // Checks if the user's scopes allow her to call the current endpoint ARN
            const user = {
                userId: "bl@shareproc.com",
                name: "Bård Lind"
            }
            const userId = user.userId; //decoded.sub;
            const isAllowed = true; //TODO authorizeUser(user.scopes, event.methodArn);

            // Return an IAM policy document for the current endpoint
            const effect = isAllowed ? 'Allow' : 'Deny';
            // const userId = user.username || ;
            const authorizerContext = {user: JSON.stringify(user)};
            const policyDocument = utils.buildIAMPolicy(userId, effect, event.methodArn, authorizerContext);

            console.log('Returning IAM policy document: ', policyDocument);
            callback(null, policyDocument);
        } else {
            console.log("Could not decode token: ", token);
            callback('Unauthorized');
        }
    } catch (e) {
        console.log("Error thrown whild setting permissions. Reason: ", e.message);
        callback('Unauthorized'); // Return a 401 Unauthorized response
    }

};

function decodeFromIdToken(accessToken) {
    console.log("decodeFromIdToken: ", accessToken);
    if (!accessToken) {
        return null;
    }
    if (accessToken.startWith("bearer")) {
       accessToken = accessToken.split(' ')[1];
    }
    if (accessToken.split('.').length !== 3) {
        return null;
    }
    const base64 = accessToken
        .split('.')[1]
        .replace('-', '+')
        .replace('_', '/');

    const token = JSON.parse(window.atob(base64));
    console.log("Decoded accessToken: ", token);
    return token;
    /*
      return {
        ver: "ver1",
        iss: "iss1",
        sub: "bl@shareproc.com",
        name: "baardl",
        preferred_username: "bl@shareproc.com",
        oid: "bl@shareproc.com"
      }
      */
}

