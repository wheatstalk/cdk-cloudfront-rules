import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { IntegFunctionLit } from './integ.function.lit';

test('snapshot', () => {
  const stack = new cdk.Stack();
  new IntegFunctionLit(stack);
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});