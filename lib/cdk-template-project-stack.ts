import * as cdk from "@aws-cdk/core";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import {
  CodePipeline,
  CodePipelineSource,
  ManualApprovalStep,
  ShellStep,
  Step,
} from "aws-cdk-lib/pipelines";
import { AppStage } from "../constructs/Stage";

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
