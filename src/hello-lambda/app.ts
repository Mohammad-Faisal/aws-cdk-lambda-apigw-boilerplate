import * as AWS from "aws-sdk";

exports.handler = async function (event: any, context: any) {
  console.log("request ", JSON.stringify(event));

  const config = { region: "us-east-1" };
  let secretsManager = new AWS.SecretsManager(config);
  let secretValue = await secretsManager
    .getSecretValue({ SecretId: "my-secret-token" })
    .promise();
  // if ("SecretString" in secretValue) {
  //   secret = secretValue.SecretString;
  // } else {
  //   let buff = new Buffer(secretValue.SecretBinary, "base64");
  //   return (decodedBinarySecret = buff.toString("ascii"));
  // }
  const responseText = secretValue.SecretString + "updated";

  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers":
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization",
    },

    isBase64Encoded: false,
    multiValueHeaders: {},
    statusCode: 200,
    body: JSON.stringify(responseText),
  };
};
