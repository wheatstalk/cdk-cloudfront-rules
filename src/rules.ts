/** Interface for a rule */
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
}

/**
 * Options for rewrite rules
 */
export interface RewriteRuleOptions {
  /** Nodejs-compatible regex pattern to match URIs */
  readonly pattern: string;

  /**
   * RegExp flags
   * @default -
   * */
  readonly patternFlags?: string;

  /** Rewrite to this URI */
  readonly location: string;

  /**
   * Redirect to `location` with this HTTP status code.
   * @default - the rewrite does not redirect
   */
  readonly redirectType?: RedirectType;

  /** Stop rewriting if this rule matches and don't apply any more rewrites. */
  readonly last?: boolean;
}

/** Redirection status codes */
export enum RedirectType {
  /** A temporary redirect */
  TEMPORARY = 'temporary',

  /** A permanent redirect */
  PERMANENT = 'permanent',
}

class RewriteRule implements IRule {
  private readonly patternExpression: string;
  private readonly redirectStatusCode?: number;

  constructor(private readonly options: RewriteRuleOptions) {
    this.patternExpression = renderRegExpExpression(options.pattern, options.patternFlags);
    this.redirectStatusCode = mapRedirectTypeToStatusCode(options.redirectType);

    if (!options.redirectType && !options.location.startsWith('/')) {
      throw new Error('`location` must begin with a forward slash when rewriting');
    }
  }

  _render(): RuleConfig {
    return {
      rendered: `
rewriteRule({
  pattern: ${this.patternExpression},
  substitution: ${renderSimpleExpression(this.options.location)},
  redirectStatusCode: ${renderSimpleExpression(this.redirectStatusCode)},
  last: ${renderSimpleExpression(this.options.last)},
}),
`.trim(),
    };
  }
}

function mapRedirectTypeToStatusCode(redirectType?: RedirectType): number|undefined {
  if (redirectType === undefined) {return undefined;}

  switch (redirectType) {
    case RedirectType.PERMANENT:
      return 308;
    case RedirectType.TEMPORARY:
      return 302;
    default:
      throw new Error(`Unknown status code ${redirectType}`);
  }
}

function renderSimpleExpression(value: unknown): string {
  return value !== undefined ? JSON.stringify(value) : 'undefined';
}

function renderRegExpExpression(pattern: string, patternFlags?: string) {
  // Throw if the pattern expression and flags are not valid in node.
  new RegExp(pattern, patternFlags);

  const patternFlagsExpression = patternFlags
    ? JSON.stringify(patternFlags)
    : 'undefined';

  return `new RegExp(${JSON.stringify(pattern)}, ${patternFlagsExpression})`;
}
