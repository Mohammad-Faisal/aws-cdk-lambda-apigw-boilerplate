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
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
  Step,
} from "aws-cdk-lib/pipelines";

export interface AuthenticationStackProps extends StackProps {
  readonly stageName: string;
}

export class AuthenticationStack extends Stack {
  constructor(scope: Construct, id: string, props: AuthenticationStackProps) {
    super(scope, id, props);

    const api = new SecureRestApi(this, `${props.stageName}-SecureRestApi`, {
      environment: "dev",
      apiName: "template-api",
    });

    const myLambda = new CommonLambdaFunction(
      this,
      `${props.stageName}-HelloLambda`,
      {
        environment: "dev",
        functionName: "hello-lambda",
        functionPath: "../src/hello-lambda/app.ts",
      }
    );

    api.addLambdaIntegrationRoute("hello", "GET", myLambda.function);
    new CfnOutput(this, "apiUrl", { value: api.restAPI.url });

    const secret = new secretsmanager.Secret(this, "SecretValue", {
      secretName: "my-secret-token",
    });
    secret.grantRead(myLambda.function);
  }
}

// create are-usable lambda-dynamodb-apigateway integration
