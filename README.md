# CDK CloudFront Rules

This CDK construct produces a CloudFront Function (not to be confused with
Lambda @ Edge) that simplifies CloudFront-based URL rewriting and redirects.

## Example

<!-- <macro exec="lit-snip ./test/integ/integ.rules.lit.ts"> -->
```ts
// Create a CloudFrontRules construct
const cloudFrontRules = new CloudFrontRules(scope, 'CloudFrontRules', {
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
```
<!-- </macro> -->
