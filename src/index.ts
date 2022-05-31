#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { PipelineStack } from "./stacks/PipelineStack";
import { BuildConfig } from "./config/build-config";
import { loadBuildConfig } from "./config/load-built-config";
import { ServerlessStack } from "./stacks/ServerlessStack";
import { VpcStack } from "./stacks/VpcStack";
import { PeeringStack } from "./stacks/PeeringStack";
import { Ec2InstanceStack } from "./stacks/Ec2InstanceStack";

const app = new App();

async function main() {
  const stageName = process.env.STAGE_NAME;

  if (!stageName) {
    throw new Error("Please provide the stage name");
  }

  console.log("stage name ", stageName);
  const buildConfig: BuildConfig = await loadBuildConfig(app, stageName);

  console.log("build config is  ", buildConfig);

  const vpcPeers = new VpcStack(app, "VpcStack", {
    vpcSetup: {
      // They are red , blue ,green
      cidrs: ["10.0.0.0/16", "10.1.0.0/16", "10.2.0.0/16"], // <--- two non-overlapping CIDR ranges for our two VPCs
      maxAzs: 1, // <--- to keep the costs down, we'll stick to 1 availability zone per VPC (obviously, not something you'd want to do in production)
    },
  });

  new Ec2InstanceStack(app, "InstancePeersStack", {
    vpcs: vpcPeers.createdVpcs,
  });

  // I want to reach Red from Blue
  new PeeringStack(app, "Blue-Red-Peering", {
    vpcs: [vpcPeers.createdVpcs[1], vpcPeers.createdVpcs[0]],
  });

  // I want to reach Red from Green
  new PeeringStack(app, "Green-Red-Peering", {
    vpcs: [vpcPeers.createdVpcs[2], vpcPeers.createdVpcs[0]],
  });

  //   new ServerlessStack(app, `${stageName}-ServerlessStack`, {
  //     stageName,
  //   });

  //   new PipelineStack(app, `${stageName}-PipelineStack`, {
  //     env: {
  //       account: buildConfig.AWS_ACCOUNT_ID,
  //       region: buildConfig.AWS_PROFILE_REGION,
  //     },
  //   });

  app.synth();
}

main();
