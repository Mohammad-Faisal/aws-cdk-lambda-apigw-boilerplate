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
  ManualApprovalStep,
  ShellStep,
  Step,
} from "aws-cdk-lib/pipelines";
import { AppStage } from "../constructs/stage";

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

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "TestPipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub(
          "Mohammad-Faisal/aws-cdk-lambda-apigw-boilerplate",
          "master"
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    const testingStage = pipeline.addStage(
      new AppStage(this, "dev", {
        env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "us-east-1" },
      })
    );

    testingStage.addPre(
      new ShellStep("Run Unit Tests", { commands: ["npm install", "npm test"] })
    );
    testingStage.addPost(
      new ManualApprovalStep("Manual approval before production")
    );

    const prodStage = pipeline.addStage(
      new AppStage(this, "prod", {
        env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "us-east-1" },
      })
    );
  }
}

// create are-usable lambda-dynamodb-apigateway integration
