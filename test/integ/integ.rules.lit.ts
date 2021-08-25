import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as cdk from '@aws-cdk/core';
import { RedirectType, Rule, CloudFrontRules } from '../../src';

export class IntegRulesLit extends cdk.Stack {
  constructor(_scope: cdk.Construct, props: cdk.StackProps = {}) {
    super(_scope, 'IntegRulesLit', props);

    const scope = this;

    // ::SNIP
    // Create a CloudFrontRules construct
    const cloudFrontRules = new CloudFrontRules(scope, 'RulesFunction', {
      rules: [
        // Rewrite URIs matching /rewrite-* to /* using a capture group. (Think
        // Apache/.htaccess RewriteRule)
        Rule.rewriteRule({
          pattern: '^/rewrite-(.*)',
          location: '/$1',
        }),

        // Redirect /redirect-* to https://www.example.com/*
        Rule.rewriteRule({
          pattern: '^/redirect-(.*)',
          patternFlags: 'i', // case insensitive
          location: 'https://www.example.com/$1',
          redirectType: RedirectType.TEMPORARY,
        }),

        // Note: Rules are applied in the order they're provided. Rewrite rules
        // are applied while there has not yet been a redirect or matching
        // rewrite with the 'last' option.
        //
        // In this example, were you to visit a URI like
        // /rewrite-redirect-foobar, the first rule will rewrite you to
        // /redirect-foobar and then the second rule will match,
        // redirecting you to https://www.example.com/foobar
      ],
    });

    // Create your CloudFront distribution.
    const distribution = new cloudfront.Distribution(scope, 'Distribution', {
      defaultBehavior: {
        origin: new cloudfront_origins.HttpOrigin('www.example.com', {
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        }),

        // Associate the produced function with VIEWER_REQUEST events.
        functionAssociations: [{
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          function: cloudFrontRules.function,
        }],
      },
    });
    // ::END-SNIP

    // Should see example.com
    new cdk.CfnOutput(scope, 'DistributionHref', {
      value: cdk.Fn.join('', ['https://', distribution.distributionDomainName, '/']),
    });

    // Link should redirect you to https://www.example.com/foobar
    new cdk.CfnOutput(scope, 'DistributionRedirectToExampleCom', {
      value: cdk.Fn.join('', ['https://', distribution.distributionDomainName, '/rewrite-redirect-foobar']),
    });
  }
}

if (!module.parent) {
  const app = new cdk.App();
  new IntegRulesLit(app, {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });
}