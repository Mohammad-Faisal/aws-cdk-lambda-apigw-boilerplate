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

export interface ServerlessStackProps extends StackProps {
  readonly stageName: string;
}

export class ServerlessStack extends Stack {
  public readonly urlOutput: CfnOutput;
  constructor(scope: Construct, id: string, props: ServerlessStackProps) {
    super(scope, id, props);

    const api = new SecureRestApi(this, "SecureRestApi", {
      environment: props.stageName,
      apiName: "serverless-api",
    });

    const secret = new secretsmanager.Secret(this, "SecretValue", {
      secretName: "my-secret-token",
    });

    const myLambda = new CommonLambdaFunction(this, "SecretReaderLambda", {
      environment: props.stageName,
      functionName: "secret-reader-lambda",
      functionPath: "../lambdas/secret-reader-lambda/app.ts",
    });

    api.addLambdaIntegrationRoute("read-secret", "GET", myLambda.function);

    secret.grantRead(myLambda.function);

    this.urlOutput = new CfnOutput(this, "apiUrl", { value: api.restAPI.url });
  }
}
