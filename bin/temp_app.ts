#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TempAppStack } from '../lib/temp_app-stack';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';

const app = new cdk.App();
const rootStack = new TempAppStack(app, 'TempAppStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

// NestedStack A
let nestA = new cdk.NestedStack(rootStack, 'NestedStackA');
new cdk.aws_s3.Bucket(nestA, "WebsiteBucketA", {});
new cdk.aws_s3.Bucket(nestA, "WebsiteBucketB", {});
new cdk.aws_dynamodb.Table(nestA, "TableA", {
  partitionKey: { name: 'id', type: cdk.aws_dynamodb.AttributeType.STRING }
});

// nestB
let nestB = new cdk.NestedStack(rootStack, 'NestedStackB');
new cdk.aws_sns.Topic(nestB, "NotificationTopic");
new cdk.aws_sqs.Queue(nestB, "MessageQueue");

// nestC in nestA
let nestC = new cdk.NestedStack(nestA, 'NestedStackC');
new cdk.aws_s3.Bucket(nestC, "nestCBucket");

// nestD in nestB
let nestD = new cdk.NestedStack(nestB, 'NestedStackD');
new cdk.aws_dynamodb.Table(nestD, 'nestDTable', {
  partitionKey: {name: 'part-name', type: AttributeType.STRING}
});
// nestE in nestC
let nestE = new cdk.NestedStack(nestC, 'NestedStackE');
new cdk.aws_cloudwatch.Alarm(nestE, "CPUUtilizationAlarm", {
  metric: new cdk.aws_cloudwatch.Metric({
    namespace: 'AWS/EC2',
    metricName: 'CPUUtilization',
  }),
  threshold: 70,
  evaluationPeriods: 2,
});
// nestF in nestE
let nestF = new cdk.NestedStack(nestE, 'NestedStackF');
new cdk.aws_s3.Bucket(nestF, 'nestFBucket', {})
