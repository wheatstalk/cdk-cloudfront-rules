import * as fs from 'fs';
import * as path from 'path';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cdk from '@aws-cdk/core';
import { IRule } from './rules';

/** Props for `RuleFunction` */
export interface RulesFunctionProps {
  /**
   * Rules to apply.
   * @default - the request passes through untouched
   */
  readonly rules?: IRule[];
}

/**
 * Produces a CloudFront function with rules support.
 */
export class RulesFunction extends cdk.Construct {
  /** The CloudFront function */
  public readonly function: cloudfront.Function;

  constructor(scope: cdk.Construct, id: string, props: RulesFunctionProps = {}) {
    super(scope, id);

    // By default, no rules.
    const rules = props.rules ?? [];

    const functionsDir = path.join(__dirname, '..', 'functions');
    const codePath = path.join(functionsDir, 'cloudfront-function.js');
    const codeTemplate = fs.readFileSync(codePath).toString('utf-8');
    const inlineCode = renderInlineCode(codeTemplate, rules);

    this.function = new cloudfront.Function(this, 'Function', {
      code: cloudfront.FunctionCode.fromInline(inlineCode),
    });
  }
}

/** @internal */
export function renderRules(rules: IRule[]) {
  const renderedRuleParts: string[] = rules.map(
    rule => rule._render().rendered,
  );
  return `[\n${renderedRuleParts.join('\n')}\n]`;
}

/** @internal */
export function renderInlineCode(template: string, rules: IRule[]): string {
  const generatedRules =
    '// GENERATED\n' +
    `var RULES = ${renderRules(rules)};\n` +
    '// END GENERATED\n';

  return template.replace('var RULES = []; // ::RULES-REPLACEMENT', generatedRules);
}