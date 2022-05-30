#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { PipelineStack } from "./stacks/PipelineStack";
import { BuildConfig } from "./config/build-config";
import { loadBuildConfig } from "./config/load-built-config";
import { ServerlessStack } from "./stacks/ServerlessStack";

const app = new App();

async function main() {
  const stageName = process.env.STAGE_NAME;

  if (!stageName) {
    throw new Error("Please provide the stage name");
  }

  console.log("stage name ", stageName);
  const buildConfig: BuildConfig = await loadBuildConfig(app, stageName);

  console.log("build config is  ", buildConfig);

  new ServerlessStack(app, `${stageName}-PipelineStack`, {
    stageName,
  });

  //   new PipelineStack(app, `${stageName}-PipelineStack`, {
  //     env: {
  //       account: buildConfig.AWS_ACCOUNT_ID,
  //       region: buildConfig.AWS_PROFILE_REGION,
  //     },
  //   });

  app.synth();
}

main();
