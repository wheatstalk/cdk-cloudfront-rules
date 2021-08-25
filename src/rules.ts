export interface IRule {
  /** @internal */
  _render(): RuleConfig;
}

/** @internal */
export interface RuleConfig {
  readonly rendered: string;
}

export abstract class Rule {
  static rewriteRule(options: RewriteRuleOptions): IRule {
    return new RewriteRule(options);
  }

  static redirectRule(options: RedirectRuleOptions): IRule {
    return new RedirectRule(options);
  }
}

/**
 * Options for rewrite rules
 */
export interface RewriteRuleOptions {
  /** Nodejs-compatible regex pattern to match URIs */
  readonly pattern: string;
  /** RegExp flags */
  readonly patternFlags?: string;
  /** Rewrite to this URI */
  readonly substitution: string;
}

class RewriteRule implements IRule {
  private readonly patternExpression: string;

  constructor(private readonly options: RewriteRuleOptions) {
    this.patternExpression = renderRegExpExpression(options.pattern, options.patternFlags);

    if (!this.options.substitution.startsWith('/')) {
      throw new Error('`location` must begin with a forward slash');
    }
  }

  _render(): RuleConfig {
    return {
      rendered: `
rewriteRule({
  pattern: ${this.patternExpression},
  substitution: ${JSON.stringify(this.options.substitution)},
}),
`.trim(),
    };
  }
}

/** Options for redirect rules */
export interface RedirectRuleOptions {
  /** Nodejs-compatible regex pattern to match URIs */
  readonly pattern: string;

  /** RegExp flags */
  readonly patternFlags?: string;

  /** Redirect to this location */
  readonly location: string;

  /**
   * Use this HTTP status code
   * @default RedirectStatusCode.PERMANENT
   */
  readonly statusCode?: RedirectStatusCode;

  /**
   * Use this redirection text
   * @default - appropriate text for `statusCode`
   */
  readonly statusDescription?: string;
}

/** Redirection status codes */
export enum RedirectStatusCode {
  /** A temporary redirect */
  TEMPORARY = 302,
  /** A permanent redirect */
  PERMANENT = 308
}

class RedirectRule implements IRule {
  private readonly patternExpression: string;
  private readonly statusCode: RedirectStatusCode;
  private readonly statusDescription: string;
  constructor(private readonly options: RedirectRuleOptions) {
    // Defaults
    this.statusCode = options.statusCode ?? RedirectStatusCode.PERMANENT;
    this.statusDescription = options.statusDescription ?? 'Found';

    this.patternExpression = renderRegExpExpression(this.options.pattern, this.options.patternFlags);

    if (/^\s*$/.test(options.location)) {
      throw new Error('Invalid redirect location');
    }

    if (/^\s*$/.test(this.statusDescription)) {
      throw new Error('Invalid status description');
    }
  }

  _render(): RuleConfig {
    return {
      rendered: `
redirectRule({
  pattern: ${this.patternExpression},
  location: ${JSON.stringify(this.options.location)},
  statusCode: ${JSON.stringify(this.statusCode)},
  statusDescription: ${JSON.stringify(this.statusDescription)},
}),
`.trim(),
    };
  }
}

function renderRegExpExpression(pattern: string, patternFlags?: string) {
  // Throw if the pattern expression and flags are not valid in node.
  new RegExp(pattern, patternFlags);

  const patternFlagsExpression = patternFlags
    ? JSON.stringify(patternFlags)
    : 'undefined';

  return `new RegExp(${JSON.stringify(pattern)}, ${patternFlagsExpression})`;
}