export default {
    // Feature files location
    paths: ['tests/features/**/*.feature'],
    // Step definitions location - include TypeScript files
    import: [
        'tests/support/hooks.ts',
        'tests/support/world.ts',
        'tests/support/config.ts',
        'tests/support/refreshCustomParameters.ts',
        'tests/step-definitions/*.ts'
    ],
    // TypeScript support
    loader: ['ts-node/esm'],
    // Format options - simplified
    format: ['progress'],
    // Parallel execution
    parallel: 0,
    // Tags
    tags: 'not @ignore',
    // Publish results
    publish: false,
    // Dry run for validation
    dryRun: false,
    // Fail fast
    failFast: false
};


