import {
  Duration,
  StackProps,
  aws_lambda as lambda,
  aws_apigateway as apigateway,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

export interface CommonLambdaFunctionProps extends StackProps {
  functionPath: string;
  functionName: string;
  environment: string;
}

export class CommonLambdaFunction extends Construct {
  public function: NodejsFunction;
  constructor(scope: Construct, id: string, props: CommonLambdaFunctionProps) {
    super(scope, id);
    this.function = this.createLambdaFunction(
      props.environment,
      props.functionName,
      props.functionPath
    );
  }
  private createLambdaFunction(
    environment: string,
    functionName: string,
    functionPath: string
  ): NodejsFunction {
    //...
    const myLambda = new NodejsFunction(
      this,
      `${environment}-${functionName}`,
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        entry: path.join(__dirname, functionPath),
        handler: "handler",
        timeout: Duration.seconds(20),
        bundling: {
          minify: true,
          externalModules: ["aws-sdk"],
        },
      }
    );
    return myLambda;
  }
  // public addLambdaIntegrationRoute(
  //   route: string,
  //   httpMethod: string,
  //   lambdaFn: lambda.IFunction
  // ): void {
  //   const integration = new apigateway.LambdaIntegration(lambdaFn);
  //   const path = this.restAPI.root.addResource(route);
  //   path.addMethod(httpMethod, integration);
  // }
}
