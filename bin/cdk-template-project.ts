#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { CdkTemplateProjectStack } from "../lib/cdk-template-project-stack";

const app = new App();

const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

new CdkTemplateProjectStack(app, "CdkTemplateProjectStack", {
  env: devEnv,
  zoneName: "default",
});

app.synth();
