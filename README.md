# Assumptions made:
   - No need to bother with in depth login/login tests since login API's are not given. 
   - It does not have to be finished, the use of given practices is what is important.
   - No need for in-depth testing plan or too big of a test coverage for the above reasons.
   - No need for fancy animations.
   - No need for cloud deployment.

# Improvements/left to do:
   - ✅ Fix the problem with the types - some cucumber related pain.
   - ✅ Introduce Redux storage / Context
   - ✅ Introduce Router
   - Introduce CodeceptJS for even better BDD experience.
   - ❌ Indocude Docker and Moon - better stay with local stuff.
   - ✅ Introduce tests with playwright and APIs, intercepting the APIcalls, etc. 
   - Better error message for login (it is not secure currently :))
   - Security testing, performance testing
   - ✅ Better config files
   - ✅ Make the comments!
   - ❌ Reporting to some fancy site - preferebly DataDog
   - ✅ The use of custom paramteres are not consistent because of the problem said at the first point.
   - Introduce tagging for tests so you can set in the config which tests you want to run
   - Change from React Route to Tanstack Route

# While I still had time I decided to go through the todo list and make everything I can from it :)

### How to use:

- npm install - install dependencies

### Unit & Component Tests
```bash
# Run all unit tests (React Testing Library + Vitest)
npm test

# Run tests with interactive UI
npm run test:ui
```

### BDD Tests (Cucumber + Gherkin)
```bash
# Run BDD tests in headless mode
npm run bdd

# Run BDD tests with browser visible (development)
npm run bdd:dev

```

### Development Utilities
```bash
# Refresh VSCode custom parameters for BDD
npm run refresh-vscode
```