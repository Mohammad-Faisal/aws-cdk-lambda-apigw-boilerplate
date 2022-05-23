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
import * as path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { SecureRestApi } from "../constructs/SecureRestApi";
import { CommonLambdaFunction } from "../constructs/CommonLambdaFunction";

export interface CdkTemplateProjectStackProps extends StackProps {
  readonly zoneName: string;
}

export class CdkTemplateProjectStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: CdkTemplateProjectStackProps
  ) {
    super(scope, id, props);

    const api = new SecureRestApi(this, "SecureRestApi", {
      environment: "dev",
      apiName: "template-api",
    });

    const myLambda = new CommonLambdaFunction(this, "HelloLambda", {
      environment: "dev",
      functionName: "hello-lambda",
      functionPath: "../src/hello-lambda/app.ts",
    });

    api.addLambdaIntegrationRoute("hello", "GET", myLambda.function);
    new CfnOutput(this, "apiUrl", { value: api.restAPI.url });

    const secret = new secretsmanager.Secret(this, "SecretValue", {
      secretName: "my-secret-token",
    });
    secret.grantRead(myLambda.function);
  }
}

// create are-usable lambda-dynamodb-apigateway integration
