# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### CloudFrontRules <a name="@wheatstalk/cdk-cloudfront-rules.CloudFrontRules"></a>

Produces a CloudFront function with rules support.

#### Initializers <a name="@wheatstalk/cdk-cloudfront-rules.CloudFrontRules.Initializer"></a>

```typescript
import { CloudFrontRules } from '@wheatstalk/cdk-cloudfront-rules'

new CloudFrontRules(scope: Construct, id: string, props?: CloudFrontRulesProps)
```

##### `scope`<sup>Required</sup> <a name="@wheatstalk/cdk-cloudfront-rules.CloudFrontRules.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="@wheatstalk/cdk-cloudfront-rules.CloudFrontRules.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="@wheatstalk/cdk-cloudfront-rules.CloudFrontRules.parameter.props"></a>

- *Type:* [`@wheatstalk/cdk-cloudfront-rules.CloudFrontRulesProps`](#@wheatstalk/cdk-cloudfront-rules.CloudFrontRulesProps)

---



#### Properties <a name="Properties"></a>

##### `function`<sup>Required</sup> <a name="@wheatstalk/cdk-cloudfront-rules.CloudFrontRules.property.function"></a>

```typescript
public readonly function: Function;
```

- *Type:* [`@aws-cdk/aws-cloudfront.Function`](#@aws-cdk/aws-cloudfront.Function)

The CloudFront function.

---


## Structs <a name="Structs"></a>

### CloudFrontRulesProps <a name="@wheatstalk/cdk-cloudfront-rules.CloudFrontRulesProps"></a>

Props for `RuleFunction`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { CloudFrontRulesProps } from '@wheatstalk/cdk-cloudfront-rules'

const cloudFrontRulesProps: CloudFrontRulesProps = { ... }
```

##### `rules`<sup>Optional</sup> <a name="@wheatstalk/cdk-cloudfront-rules.CloudFrontRulesProps.property.rules"></a>

```typescript
public readonly rules: IRule[];
```

- *Type:* [`@wheatstalk/cdk-cloudfront-rules.IRule`](#@wheatstalk/cdk-cloudfront-rules.IRule)[]
- *Default:* no rules - requests pass through untouched

Rules to apply.

---

### RewriteRuleOptions <a name="@wheatstalk/cdk-cloudfront-rules.RewriteRuleOptions"></a>

Options for rewrite rules.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { RewriteRuleOptions } from '@wheatstalk/cdk-cloudfront-rules'

const rewriteRuleOptions: RewriteRuleOptions = { ... }
```

##### `location`<sup>Required</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RewriteRuleOptions.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* `string`

Rewrite to this URI.

---

##### `pattern`<sup>Required</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RewriteRuleOptions.property.pattern"></a>

```typescript
public readonly pattern: string;
```

- *Type:* `string`

Nodejs-compatible regex pattern to match URIs.

---

##### `last`<sup>Optional</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RewriteRuleOptions.property.last"></a>

```typescript
public readonly last: boolean;
```

- *Type:* `boolean`

Stop rewriting if this rule matches and don't apply any more rewrites.

---

##### `patternFlags`<sup>Optional</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RewriteRuleOptions.property.patternFlags"></a>

```typescript
public readonly patternFlags: string;
```

- *Type:* `string`
- *Default:* 

RegExp flags.

---

##### `redirectType`<sup>Optional</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RewriteRuleOptions.property.redirectType"></a>

```typescript
public readonly redirectType: RedirectType;
```

- *Type:* [`@wheatstalk/cdk-cloudfront-rules.RedirectType`](#@wheatstalk/cdk-cloudfront-rules.RedirectType)
- *Default:* the rewrite does not redirect

Redirect to `location` with this HTTP status code.

---

## Classes <a name="Classes"></a>

### Rule <a name="@wheatstalk/cdk-cloudfront-rules.Rule"></a>

#### Initializers <a name="@wheatstalk/cdk-cloudfront-rules.Rule.Initializer"></a>

```typescript
import { Rule } from '@wheatstalk/cdk-cloudfront-rules'

new Rule()
```


#### Static Functions <a name="Static Functions"></a>

##### `rewriteRule` <a name="@wheatstalk/cdk-cloudfront-rules.Rule.rewriteRule"></a>

```typescript
import { Rule } from '@wheatstalk/cdk-cloudfront-rules'

Rule.rewriteRule(options: RewriteRuleOptions)
```

###### `options`<sup>Required</sup> <a name="@wheatstalk/cdk-cloudfront-rules.Rule.parameter.options"></a>

- *Type:* [`@wheatstalk/cdk-cloudfront-rules.RewriteRuleOptions`](#@wheatstalk/cdk-cloudfront-rules.RewriteRuleOptions)

---



## Protocols <a name="Protocols"></a>

### IRule <a name="@wheatstalk/cdk-cloudfront-rules.IRule"></a>

- *Implemented By:* [`@wheatstalk/cdk-cloudfront-rules.IRule`](#@wheatstalk/cdk-cloudfront-rules.IRule)

Interface for a rule.



## Enums <a name="Enums"></a>

### RedirectType <a name="RedirectType"></a>

Redirection status codes.

#### `TEMPORARY` <a name="@wheatstalk/cdk-cloudfront-rules.RedirectType.TEMPORARY"></a>

A temporary redirect.

---


#### `PERMANENT` <a name="@wheatstalk/cdk-cloudfront-rules.RedirectType.PERMANENT"></a>

A permanent redirect.

---

