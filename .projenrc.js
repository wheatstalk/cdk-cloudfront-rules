const pj = require('projen');
const project = new pj.AwsCdkConstructLibrary({
  author: 'Josh Kellendonk',
  authorAddress: 'joshkellendonk@gmail.com',
  cdkVersion: '1.95.2',
  defaultReleaseBranch: 'main',
  name: '@wheatstalk/cdk-cloudfront-rules',
  repositoryUrl: 'https://github.com/wheatstalk/cdk-cloudfront-rules.git',

  description: 'A rule-based CloudFront Function as a CDK Construct',
  keywords: [
    'cdk',
    'cloudfront',
    'functions',
    'rewrites',
    'redirects',
    'projen',
  ],

  workflowNodeVersion: '14',

  releaseEveryCommit: true,
  releaseToNpm: true,
  npmAccess: pj.NpmAccess.PUBLIC,

  projenUpgradeSecret: 'YARN_UPGRADE_TOKEN',
  autoApproveUpgrades: true,
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['github-actions', 'github-actions[bot]', 'misterjoshua'],
  },

  cdkDependenciesAsDeps: false,
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-cloudfront',
  ],

  cdkTestDependencies: [
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-s3-deployment',
    '@aws-cdk/aws-apigatewayv2',
    '@aws-cdk/aws-cloudfront',
    '@aws-cdk/aws-cloudfront-origins',
    '@aws-cdk/aws-apigatewayv2-integrations',
  ],

  devDeps: [
    'aws-cdk',
    'ts-node',
    'typescript',
    'markmac@^0.1',
    'shx',
    '@wheatstalk/lit-snip@^0.0',
  ],

  gitignore: [
    'cdk.out',
    '.idea',
  ],

  npmignore: [
    'cdk.out',
    '.idea',
  ],


  // cdkDependencies: undefined,        /* Which AWS CDK modules (those that start with "@aws-cdk/") does this library require when consumed? */
  // cdkTestDependencies: undefined,    /* AWS CDK modules required for testing. */
  // deps: [],                          /* Runtime dependencies of this module. */
  // description: undefined,            /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                       /* Build dependencies for this module. */
  // packageName: undefined,            /* The "name" in package.json. */
  // projectType: ProjectType.UNKNOWN,  /* Which type of project this is (library/app). */
  // release: undefined,                /* Add release management to this project. */
});

project.package.setScript('integ:rules', 'cdk --app "ts-node -P tsconfig.jest.json test/integ/integ.rules.lit.ts"');

const macros = project.addTask('readme-macros');
macros.exec('shx mv README.md README.md.bak');
macros.exec('shx cat README.md.bak | markmac > README.md');
macros.exec('shx rm README.md.bak');
project.buildTask.spawn(macros);

project.synth();