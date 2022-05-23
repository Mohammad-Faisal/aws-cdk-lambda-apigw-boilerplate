import * as cdk from "@aws-cdk/core";
import {
  Stack,
  StackProps,
  Duration,
  CfnOutput,
  aws_apigateway as apigateway,
  aws_lambda as lambda,
  aws_secretsmanager as secretsmanager,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { SecureRestApi } from "../constructs/SecureRestApi";
import { CommonLambdaFunction } from "../constructs/CommonLambdaFunction";

export interface AuthenticationStackProps extends StackProps {
  readonly stageName: string;
}

export class AuthenticationStack extends Stack {
  public readonly urlOutput: CfnOutput;
  constructor(scope: Construct, id: string, props: AuthenticationStackProps) {
    super(scope, id, props);

    const api = new SecureRestApi(this, `${props.stageName}-SecureRestApi`, {
      environment: props.stageName,
      apiName: "template-api",
    });

    const myLambda = new CommonLambdaFunction(
      this,
      `${props.stageName}-HelloLambda`,
      {
        environment: props.stageName,
        functionName: "hello-lambda",
        functionPath: "../src/hello-lambda/app.ts",
      }
    );

    api.addLambdaIntegrationRoute("hello", "GET", myLambda.function);

    // const secret = new secretsmanager.Secret(this, "SecretValue", {
    //   secretName: "my-secret-token",
    // });
    // secret.grantRead(myLambda.function);

    this.urlOutput = new CfnOutput(this, "apiUrl", { value: api.restAPI.url });
  }
}

// create are-usable lambda-dynamodb-apigateway integration
