// noinspection ES6ConvertVarToLetConst

if (typeof module !== 'undefined') {
  // Test environment.
  module.exports = {
    handler,
    replace,
    rewriteRule,
  };
}

/**
 * Logging function that calls the callback when it wants to output logs.
 * @param {() => string} cb
 */
function log(cb) {
  // console.log(cb());
}

function handler(event) {
  /** @type CFRequest */
  var request = event.request;

  log(() => 'event = ' + JSON.stringify(event));

  var variables = {
    'REMOTE_ADDR': event.viewer.ip,
    'REQUEST_URI': request.uri,
  };

  if (request.headers.host) {
    variables['HTTP_HOST'] = request.headers.host.value;
  }

  var context = {};

  var finalResult = RULES.reduce((previousValue, rule, index) => {
    log(() => 'Reducing ' + JSON.stringify(previousValue));
    return rule({
      request: isRequest(previousValue) ? previousValue : undefined,
      response: isRequest(previousValue) ? undefined : previousValue,
      event: event,
      index: index,
      variables: variables,
      context: context,
    });
  }, request);

  log(() => 'Final result = ' + JSON.stringify(finalResult));

  return finalResult;
}

/**
 * @param {CFRequest|CFResponse} previousValue
 * @return {boolean}
 */
function isRequest(previousValue) {
  return !previousValue.statusCode;
}

/**
 * @typedef ReplaceOptions
 * @type object
 * @property {RegExp} pattern
 * @property {string} substitution
 * @property {string} input
 * @property {Record<string, string>|undefined} variables
 */
/**
 * RewriteRule-like string replacement
 * @param {ReplaceOptions} options
 */
function replace(options) {
  var pattern = options.pattern;
  var substitution = options.substitution;
  var input = options.input;
  var variables = options.variables || {};

  var found = input.match(pattern);
  if (!found) {
    return input;
  }

  return substitution
    // Pattern capture group replacements $1, $2, ..., $N
    .replace(CAPTURE_GROUP_REGEX, function (_, c1) { return found[parseInt(c1)] || ''; })
    // Variable replacements like %{HTTP_HOST}
    .replace(VARIABLE_REGEX, function (_, c1) { return variables[c1] || '' });
}

// Compile these once
var CAPTURE_GROUP_REGEX = /\$(\d+)/g;
var VARIABLE_REGEX = /%{(.*?)}/g;

/**
 * @typedef RuleOptions
 * @type object
 * @property {CFRequest|undefined} request
 * @property {CFResponse|undefined} response
 * @property {object} event
 * @property {object} context
 * @property {Record<string, string>|undefined} variables
 */

/**
 * @typedef Rule
 * @type function
 * @param {RuleOptions} options
 * @returns {CFRequest|CFResponse}
 */

/** @type {Rule[]} */
var RULES = []; // ::RULES-REPLACEMENT

/**
 * @typedef RewriteRuleConfig
 * @type object
 * @property {RegExp} pattern
 * @property {string} substitution
 * @property {number} redirectStatusCode
 * @property {boolean|undefined} last
 */
/**
 * @param {RewriteRuleConfig} config
 * @returns {Rule}
 */
function rewriteRule(config) {
  /**
   * @param {RuleOptions} options
   * @returns {CFRequest|CFResponse}
   */
  function apply(options) {
    if (options.response)
      return options.response;

    var request = options.request;
    if (options.context.rewriteRuleLast || !config.pattern.test(request.uri))
      return request;

    if (config.last) {
      options.context.rewriteRuleLast = true;
    }

    var finalLocation = replace({
      pattern: config.pattern,
      substitution: config.substitution,
      input: request.uri,
      variables: options.variables,
    });

    if (config.redirectStatusCode) {
      // noinspection UnnecessaryLocalVariableJS
      /** @type CFResponse */
      var response = {
        statusCode: config.redirectStatusCode,
        statusDescription: 'Found',
        headers: {
          'location': {
            value: finalLocation,
          },
        },
      };

      return response;
    } else {
      request.uri = finalLocation;
      return request;
    }
  }

  return apply;
}

// <editor-fold desc="CloudFront JSDocs">

/**
 * @typedef CFQueryStringBase
 * @type object
 * @property {string} value
 */

/**
 * @typedef CFQueryString
 * @extends CFQueryStringBase
 * @property {CFQueryStringBase[]|undefined} multiValue
 */

/**
 * @typedef CFHeaderBase
 * @type object
 * @property {string} value
 */

/**
 * @typedef CFHeaderMultiValue
 * @type object
 * @property {CFHeaderBase[]|undefined} multiValue
 */

/**
 * @typedef {CFHeaderBase & CFHeaderMultiValue} CFHeader
 */

/**
 * @typedef CFCookieBase
 * @type object
 * @property {string} value
 * @property {string} attributes
 */

/**
 * @typedef CFCookie
 * @extends CFCookieBase
 * @property {CFCookieBase[]|undefined} multiValue
 */

/**
 * @typedef CFRequest
 * @type object
 * @property {string} method
 * @property {string} uri
 * @property {Record<string, CFQueryString>} querystring
 * @property {Record<string, CFHeader>} headers
 * @property {Record<string, CFCookie>} cookies
 */

/**
 * @typedef CFResponse
 * @type object
 * @property {number} statusCode
 * @property {string|undefined} statusDescription
 * @property {Record<string, CFHeader>} headers
 * @property {Record<string, CFCookie>|undefined} cookies
 */

// </editor-fold>