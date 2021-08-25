import * as fs from 'fs';
import * as path from 'path';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cdk from '@aws-cdk/core';
import { IRule } from './rules';

/** Props for `RuleFunction` */
export interface CloudFrontRulesProps {
  /**
   * Rules to apply.
   * @default - no rules - requests pass through untouched
   */
  readonly rules?: IRule[];
}

/**
 * Produces a CloudFront function with rules support.
 */
export class CloudFrontRules extends cdk.Construct {
  /** The CloudFront function */
  public readonly function: cloudfront.Function;

  constructor(scope: cdk.Construct, id: string, props: CloudFrontRulesProps = {}) {
    super(scope, id);

    // By default, no rules.
    const rules = props.rules ?? [];

    // Render the function as inline code.
    const codePath = path.join(__dirname, '..', 'functions', 'cloudfront-function.js');
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