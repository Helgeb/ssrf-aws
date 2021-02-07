import * as ec2 from "@aws-cdk/aws-ec2";
import * as iam from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";
// import * as cr from "@aws-cdk/custom-resources";

const MY_IP = process.env.MY_IP!;

export class SsrfSetupCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "VPC", {
      maxAzs: 1,
      natGateways: 0,
    });

    const instance = new ec2.Instance(this, "ssrf", {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        cpuType: ec2.AmazonLinuxCpuType.X86_64,
      }),
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    instance.connections.allowFrom(
      ec2.Peer.ipv4(`${MY_IP}/32`),
      ec2.Port.tcp(5000),
      "webtraffic"
    );

    instance.connections.allowFrom(
      ec2.Peer.ipv4(`${MY_IP}/32`),
      ec2.Port.tcp(22),
      "ssh"
    );

    instance.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["s3:*"],
        effect: iam.Effect.ALLOW,
        resources: ["*"],
      })
    );

    // new cr.AwsCustomResource(this, "InstanceMetadataOptions", {
    //   onUpdate: {
    //     service: "EC2",
    //     action: "modifyInstanceMetadataOptions",
    //     parameters: {
    //       InstanceId: instance.instanceId,
    //       HttpEndpoint: "enabled",
    //       HttpTokens: "required",
    //     },
    //     region: this.region,
    //     physicalResourceId: cr.PhysicalResourceId.of(instance.instanceId),
    //   },
    //   policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
    //     resources: [
    //       `arn:aws:ec2:${this.region}:${this.account}:instance/${instance.instanceId}`,
    //     ],
    //   }),
    // });
  }
}
