/*
** Adapted from https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html#api-gateway-lambda-authorizer-token-lambda-function-create
** A simple TOKEN authorizer example to demonstrate how to use an authorization token
** to allow or deny a request.In this example, the caller named 'user'is allowed to invoke
** a request if the client - supplied token value is 'allow'.The caller is not allowed to
** invoke the request if the token value is 'deny'.If the token value is 'Unauthorized',
** the function returns the 'Unauthorized' error with an HTTP status code of 401. For any
** other token value, the authorizer returns 'Error: Invalid token' as a 500 error.
*/

exports.validate = async function (event) {
  const token = event.authorizationToken;
  const methodArn = event.methodArn;

  switch (token) {
    case 'allow':
      return generateAuthResponse('user', 'Allow', methodArn)
    case 'deny':
      return generateAuthResponse('user', 'Deny', methodArn)
    default:
      return Promise.reject('Error: Invalid token') // Returns 500 Internal Server Error
  }
}

exports.validateold = (event, context, callback) => {

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

exports.handler = async function (event) {
  const token = event.authorizationToken.toLowerCase()
  const methodArn = event.methodArn

  switch (token) {
    case 'allow':
      return generateAuthResponse('user', 'Allow', methodArn)
    case 'deny':
      return generateAuthResponse('user', 'Deny', methodArn)
    default:
      return Promise.reject('Error: Invalid token') // Returns 500 Internal Server Error
  }
}

function generateAuthResponse (principalId, effect, methodArn) {
  // If you need to provide additional information to your integration
  // endpoint (e.g. your Lambda Function), you can add it to `context`
  const context = {
    'stringKey': 'stringval',
    'numberKey': 123,
    'booleanKey': true
  }
  const policyDocument = generatePolicyDocument(effect, methodArn)

  return {
    principalId,
    context,
    policyDocument
  }
}

function generatePolicyDocument (effect, methodArn) {
  if (!effect || !methodArn) return null

  const policyDocument = {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: methodArn
    }]
  }

  return policyDocument
}