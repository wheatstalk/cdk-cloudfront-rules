import { Rule, renderRules, renderInlineCode } from '../src';

test('rendering rules', () => {
  // GIVEN
  const rules = [
    Rule.rewriteRule({
      pattern: '/index.html',
      location: '/rewritten',
    }),
  ];

  // WHEN
  const result = renderRules(rules);

  // THEN
  expect(result).toEqual(
    '[\n' +
    'rewriteRule({\n' +
    '  pattern: new RegExp("/index.html", undefined),\n' +
    '  substitution: "/rewritten",\n' +
    '  redirectStatusCode: undefined,\n' +
    '  last: undefined,\n' +
    '}),\n' +
    ']',
  );
});

test('rendering a template', () => {
  // GIVEN
  const template = `
FOO BAR
var RULES = []; // ::RULES-REPLACEMENT
BAZ
`;
  const rules = [
    Rule.rewriteRule({
      pattern: '/index.html',
      location: '/rewritten',
    }),
  ];

  // WHEN
  const inlineCode = renderInlineCode(template, rules);

  // THEN
  expect(inlineCode).toEqual(expect.stringContaining('// GENERATED'));
  expect(inlineCode).toEqual(expect.stringContaining('/rewritten'));
});