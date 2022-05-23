#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { PipelineStack } from "../lib/PipelineStack";

const app = new App();

const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

new PipelineStack(app, "PipelineStack", {
  env: devEnv,
});

app.synth();
