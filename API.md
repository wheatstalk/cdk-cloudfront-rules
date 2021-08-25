# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### RulesFunction <a name="@wheatstalk/cdk-cloudfront-rules.RulesFunction"></a>

Produces a CloudFront function with rules support.

#### Initializer <a name="@wheatstalk/cdk-cloudfront-rules.RulesFunction.Initializer"></a>

```typescript
import { RulesFunction } from '@wheatstalk/cdk-cloudfront-rules'

new RulesFunction(scope: Construct, id: string, props?: RulesFunctionProps)
```

##### `scope`<sup>Required</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RulesFunction.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RulesFunction.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RulesFunction.parameter.props"></a>

- *Type:* [`@wheatstalk/cdk-cloudfront-rules.RulesFunctionProps`](#@wheatstalk/cdk-cloudfront-rules.RulesFunctionProps)

---



#### Properties <a name="Properties"></a>

##### `function`<sup>Required</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RulesFunction.property.function"></a>

- *Type:* [`@aws-cdk/aws-cloudfront.Function`](#@aws-cdk/aws-cloudfront.Function)

The CloudFront function.

---


## Structs <a name="Structs"></a>

### RedirectRuleOptions <a name="@wheatstalk/cdk-cloudfront-rules.RedirectRuleOptions"></a>

Options for redirect rules.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { RedirectRuleOptions } from '@wheatstalk/cdk-cloudfront-rules'

const redirectRuleOptions: RedirectRuleOptions = { ... }
```

##### `location`<sup>Required</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RedirectRuleOptions.property.location"></a>

- *Type:* `string`

Redirect to this location.

---

##### `pattern`<sup>Required</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RedirectRuleOptions.property.pattern"></a>

- *Type:* `string`

Nodejs-compatible regex pattern to match URIs.

---

##### `patternFlags`<sup>Optional</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RedirectRuleOptions.property.patternFlags"></a>

- *Type:* `string`

RegExp flags.

---

##### `statusCode`<sup>Optional</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RedirectRuleOptions.property.statusCode"></a>

- *Type:* [`@wheatstalk/cdk-cloudfront-rules.RedirectStatusCode`](#@wheatstalk/cdk-cloudfront-rules.RedirectStatusCode)
- *Default:* RedirectStatusCode.PERMANENT

Use this HTTP status code.

---

##### `statusDescription`<sup>Optional</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RedirectRuleOptions.property.statusDescription"></a>

- *Type:* `string`
- *Default:* appropriate text for `statusCode`

Use this redirection text.

---

### RewriteRuleOptions <a name="@wheatstalk/cdk-cloudfront-rules.RewriteRuleOptions"></a>

Options for rewrite rules.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { RewriteRuleOptions } from '@wheatstalk/cdk-cloudfront-rules'

const rewriteRuleOptions: RewriteRuleOptions = { ... }
```

##### `pattern`<sup>Required</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RewriteRuleOptions.property.pattern"></a>

- *Type:* `string`

Nodejs-compatible regex pattern to match URIs.

---

##### `substitution`<sup>Required</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RewriteRuleOptions.property.substitution"></a>

- *Type:* `string`

Rewrite to this URI.

---

##### `patternFlags`<sup>Optional</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RewriteRuleOptions.property.patternFlags"></a>

- *Type:* `string`

RegExp flags.

---

### RulesFunctionProps <a name="@wheatstalk/cdk-cloudfront-rules.RulesFunctionProps"></a>

Props for `RuleFunction`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { RulesFunctionProps } from '@wheatstalk/cdk-cloudfront-rules'

const rulesFunctionProps: RulesFunctionProps = { ... }
```

##### `rules`<sup>Optional</sup> <a name="@wheatstalk/cdk-cloudfront-rules.RulesFunctionProps.property.rules"></a>

- *Type:* [`@wheatstalk/cdk-cloudfront-rules.IRule`](#@wheatstalk/cdk-cloudfront-rules.IRule)[]
- *Default:* the request passes through untouched

Rules to apply.

---

## Classes <a name="Classes"></a>

### Rule <a name="@wheatstalk/cdk-cloudfront-rules.Rule"></a>

#### Initializer <a name="@wheatstalk/cdk-cloudfront-rules.Rule.Initializer"></a>

```typescript
import { Rule } from '@wheatstalk/cdk-cloudfront-rules'

new Rule()
```


#### Static Functions <a name="Static Functions"></a>

##### `redirectRule` <a name="@wheatstalk/cdk-cloudfront-rules.Rule.redirectRule"></a>

```typescript
import { Rule } from '@wheatstalk/cdk-cloudfront-rules'

Rule.redirectRule(options: RedirectRuleOptions)
```

###### `options`<sup>Required</sup> <a name="@wheatstalk/cdk-cloudfront-rules.Rule.parameter.options"></a>

- *Type:* [`@wheatstalk/cdk-cloudfront-rules.RedirectRuleOptions`](#@wheatstalk/cdk-cloudfront-rules.RedirectRuleOptions)

---

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



## Enums <a name="Enums"></a>

### RedirectStatusCode <a name="RedirectStatusCode"></a>

Redirection status codes.

#### `TEMPORARY` <a name="@wheatstalk/cdk-cloudfront-rules.RedirectStatusCode.TEMPORARY"></a>

A temporary redirect.

---


#### `PERMANENT` <a name="@wheatstalk/cdk-cloudfront-rules.RedirectStatusCode.PERMANENT"></a>

A permanent redirect.

---

