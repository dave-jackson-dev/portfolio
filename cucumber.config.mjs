/**
 * Root-level Cucumber assembly for both `cucumber-js` and editor integrations.
 * Step definitions remain TypeScript and use the same ts-node registration as the existing gate.
 */
export default {
  paths: ['features/**/*.feature'],
  require: ['features/step-definitions/**/*.ts'],
  requireModule: ['ts-node/register'],
  format: ['progress'],
};
