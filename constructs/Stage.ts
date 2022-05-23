import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AuthenticationStack } from "../lib/AuthenticationStack";

export class AppStage extends cdk.Stage {
  constructor(scope: Construct, stageName: string, props?: cdk.StageProps) {
    super(scope, stageName, props);

    const authStack = new AuthenticationStack(this, "AuthenticationStack", {
      stageName,
    });
  }
}
