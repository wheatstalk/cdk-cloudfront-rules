// noinspection ES6ConvertVarToLetConst

function handler(event) {
  /** @type CFRequest */
  var request = event.request;

  console.log('event = ' + JSON.stringify(event));

  var variables = {
    'REMOTE_ADDR': event.viewer.ip,
    'REQUEST_URI': request.uri,
  };

  if (request.headers.host) {
    variables['HTTP_HOST'] = request.headers.host.value;
  }

  var finalResult = RULES.reduce((previousValue, rule, index) => {
    console.log('Reducing ' + JSON.stringify(previousValue));
    return rule({
      request: isRequest(previousValue) ? previousValue : undefined,
      response: isRequest(previousValue) ? undefined : previousValue,
      event: event,
      index: index,
      variables: variables,
    });
  }, request);

  console.log('Final result = ' + JSON.stringify(finalResult));

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
    .replace(/\$(\d+)/g, function (_, c1) { return found[parseInt(c1)] || ''; })
    // Variable replacements like %{HTTP_HOST}
    .replace(/%{(.*?)}/g, function (_, c1) { return variables[c1] || '' });
}

/**
 * @typedef RuleCallbackOptions
 * @type object
 * @property {CFRequest|undefined} request
 * @property {CFResponse|undefined} response
 * @property {object} event
 * @property {number} index
 * @property {Record<string, string>|undefined} variables
 */

/**
 * @typedef RuleCallback
 * @type function
 * @param {RuleCallbackOptions} options
 * @returns {CFRequest|CFResponse}
 */

/** @type {RuleCallback[]} */
var RULES = []; // ::RULES-REPLACEMENT

/**
 * @typedef RewriteRuleOptions
 * @type object
 * @property {RegExp} pattern
 * @property {string} substitution
 */
/**
 * @function
 * @param {RewriteRuleOptions} rewriteRuleOptions
 * @returns {RuleCallback}
 */
function rewriteRule(rewriteRuleOptions) {
  var pattern = rewriteRuleOptions.pattern;
  var substitution = rewriteRuleOptions.substitution;

  /** @type {RuleCallback} */
  function ruleCallback(options) {
    if (options.response)
      return options.response;

    var request = options.request;
    if (!pattern.test(request.uri))
      return request;

    request.uri = replace({
      pattern: pattern,
      substitution: substitution,
      input: request.uri,
      variables: options.variables,
    });

    return request;
  }

  return ruleCallback;
}

/**
 * @typedef RedirectRuleOptions
 * @type object
 * @property {RegExp} pattern
 * @property {string} location
 * @property {number} statusCode
 * @property {string} statusDescription
 */
/**
 * @function
 * @param {RedirectRuleOptions} redirectRuleOptions
 * @return {RuleCallback}
 */
function redirectRule(redirectRuleOptions) {
  var pattern = redirectRuleOptions.pattern;
  var location = redirectRuleOptions.location;
  var statusCode = redirectRuleOptions.statusCode;
  var statusDescription = redirectRuleOptions.statusDescription;

  /** @type {RuleCallback} */
  function ruleCallback(options) {
    if (options.response)
      return options.response;

    var request = options.request;
    if (!pattern.test(request.uri))
      return request;

    var finalLocation = replace({
      pattern: pattern,
      substitution: location,
      input: request.uri,
      variables: options.variables,
    });

    // noinspection UnnecessaryLocalVariableJS
    /** @type CFResponse */
    var response = {
      statusCode: statusCode,
      statusDescription: statusDescription,
      headers: {
        'location': {
          value: finalLocation,
        },
      },
    };

    return response;
  }

  return ruleCallback;
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