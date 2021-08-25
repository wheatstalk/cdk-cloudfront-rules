// @ts-ignore
// eslint-disable-next-line
const fun = require('../functions/cloudfront-function');

describe('replace', () => {
  test('a matching input', () => {
    // GIVEN
    const uri = '/index.html';

    // WHEN
    const replaced = fun.replace({
      pattern: new RegExp('^/(.*)\\.(.*)$'),
      substitution: '/?file=$1&ext=$2&variable=%{VARIABLE}',
      input: uri,
      variables: {
        VARIABLE: 'foo',
      },
    });

    // THEN
    expect(replaced).toEqual('/?file=index&ext=html&variable=foo');
  });

  test('a non-matching input', () => {
    // GIVEN
    const uri = '/original';

    // WHEN
    const replaced = fun.replace({
      pattern: new RegExp('^/(.*)\\.(.*)$'),
      substitution: '/never',
      input: uri,
      variables: {
        VARIABLE: 'foo',
      },
    });

    // THEN
    expect(replaced).toEqual('/original');
  });
});

describe('rewriteRule', () => {
  let context: Record<string, any> = {};
  let request = { uri: '/matching' };
  let event = { request };

  beforeEach(() => {
    context = {};
    request = { uri: '/matching' };
    event = { request };
  });

  test('regular rewrite', () => {
    // GIVEN
    const rule = fun.rewriteRule({
      pattern: new RegExp('^/matching'),
      substitution: '/replaced',
    });

    // WHEN
    const res = rule({
      request,
      event,
      context,
    });

    // THEN
    expect(res.uri).toEqual('/replaced');
    expect(context.rewriteRuleLast).toBeUndefined();
  });

  test('redirect', () => {
    // GIVEN
    const rule = fun.rewriteRule({
      pattern: new RegExp('^/matching'),
      substitution: 'https://www.example.com/replaced',
      redirectStatusCode: 308,
    });

    // WHEN
    const res = rule({
      request,
      event,
      context,
    });

    // THEN
    expect(res.statusCode).toEqual(308);
    expect(res.headers.location.value).toEqual('https://www.example.com/replaced');
  });

  test('last rewrite', () => {
    // GIVEN
    const rule1 = fun.rewriteRule({
      pattern: new RegExp('^/matching'),
      substitution: '/last',
      last: true,
    });

    const rule2 = fun.rewriteRule({
      pattern: new RegExp('.*'),
      substitution: '/after',
    });

    const out1 = rule1({
      request,
      event,
      context,
    });

    // WHEN
    const out2 = rule2({
      request: out1,
      event,
      context,
    });

    // THEN
    expect(out2.uri).toEqual('/last');
  });
});
