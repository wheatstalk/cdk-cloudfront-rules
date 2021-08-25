import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { IntegRulesLit } from './integ.rules.lit';

test('snapshot', () => {
  const stack = new cdk.Stack();
  new IntegRulesLit(stack);
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});