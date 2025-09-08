export default {
    // Feature files location
    paths: ['tests/features/**/*.feature'],
    // Step definitions location - include TypeScript files
    import: [
        'tests/step-definitions/*.ts',
        'tests/support/*.ts'
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


