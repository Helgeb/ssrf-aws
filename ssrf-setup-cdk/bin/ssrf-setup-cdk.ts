#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import "source-map-support/register";
import { SsrfSetupCdkStack } from "../lib/ssrf-setup-cdk-stack";

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID!;
const AWS_REGION = process.env.AWS_REGION!;
const env = { region: AWS_REGION, account: AWS_ACCOUNT_ID };

const app = new cdk.App();
new SsrfSetupCdkStack(app, "SsrfSetupCdkStack", { env });
