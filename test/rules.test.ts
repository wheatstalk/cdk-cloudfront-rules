import { RedirectType, Rule } from '../src';

describe('rewrite rule', () => {
  test('rendering a rewrite', () => {
    // GIVEN
    const rule = Rule.rewriteRule({
      pattern: 'foo',
      patternFlags: 'i',
      location: '/bar',
    });

    // WHEN
    const config = rule._render();

    // THEN
    expect(config.rendered).toEqual(
      'rewriteRule({\n' +
      '  pattern: new RegExp("foo", "i"),\n' +
      '  substitution: "/bar",\n' +
      '  redirectStatusCode: undefined,\n' +
      '  last: undefined,\n' +
      '}),',
    );
  });

  test('rendering a last rewrite', () => {
    // GIVEN
    const rule = Rule.rewriteRule({
      pattern: 'foo',
      patternFlags: 'i',
      location: '/bar',
      last: true,
    });

    // WHEN
    const config = rule._render();

    // THEN
    expect(config.rendered).toEqual(
      'rewriteRule({\n' +
      '  pattern: new RegExp("foo", "i"),\n' +
      '  substitution: "/bar",\n' +
      '  redirectStatusCode: undefined,\n' +
      '  last: true,\n' +
      '}),',
    );
  });

  test('rendering a redirect', () => {
    // GIVEN
    const rule = Rule.rewriteRule({
      pattern: 'foo',
      patternFlags: 'i',
      location: '/bar',
      redirectType: RedirectType.PERMANENT,
    });

    // WHEN
    const config = rule._render();

    // THEN
    expect(config.rendered).toEqual(
      'rewriteRule({\n' +
      '  pattern: new RegExp("foo", "i"),\n' +
      '  substitution: "/bar",\n' +
      '  redirectStatusCode: 308,\n' +
      '  last: undefined,\n' +
      '}),',
    );
  });
});