import { Rule } from '../src';

describe('rewrite rule', () => {
  test('rendering', () => {
    const rule = Rule.rewriteRule({
      pattern: 'foo',
      patternFlags: 'i',
      substitution: '/bar',
    });

    const config = rule._render();

    expect(config.rendered).toEqual(
      'rewriteRule({\n' +
      '  pattern: new RegExp("foo", "i"),\n' +
      '  substitution: "/bar",\n' +
      '}),',
    );
  });
});