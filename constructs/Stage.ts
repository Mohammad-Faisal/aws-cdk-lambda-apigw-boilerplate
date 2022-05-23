import * as cdk from "aws-cdk-lib";
import { CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AuthenticationStack } from "../lib/AuthenticationStack";

export class AppStage extends cdk.Stage {
  public readonly urlOutput: CfnOutput;
  constructor(scope: Construct, stageName: string, props?: cdk.StageProps) {
    super(scope, stageName, props);

    const authStack = new AuthenticationStack(this, `AuthenticationService`, {
      stageName,
    });

    this.urlOutput = authStack.urlOutput;
  }
}
