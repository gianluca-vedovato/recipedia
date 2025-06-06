# Testing Automation Setup

This project now has automated testing configured with Git hooks to ensure code quality before commits and pushes.

## Pre-commit Hook

- **Triggers**: Before each commit
- **What it does**:
  - Runs ESLint with auto-fix on modified files
  - Runs Vitest tests only for files related to the staged changes
- **Files**: `.husky/pre-commit`
- **Configuration**: `lint-staged` section in `package.json`

## Pre-push Hook

- **Triggers**: Before each push to remote repository
- **What it does**: Runs the complete test suite (`npm run test -- --run`)
- **Files**: `.husky/pre-push`

## Configuration Details

### lint-staged Configuration (package.json)

```json
"lint-staged": {
  "*.{ts,tsx,js,jsx}": [
    "eslint --fix",
    "vitest related --run"
  ]
}
```

This configuration means:

- For any staged TypeScript/JavaScript files
- First run ESLint with auto-fix
- Then run Vitest tests related to those files

### Hook Files

- `.husky/pre-commit`: Executes `npx --no-install lint-staged`
- `.husky/pre-push`: Executes `npm run test -- --run`

## How It Works

1. **On Commit**:

   - Git runs the pre-commit hook
   - Hook calls lint-staged
   - lint-staged processes only staged files
   - ESLint fixes code style issues
   - Vitest runs tests related to the changed files
   - If any step fails, commit is prevented

2. **On Push**:
   - Git runs the pre-push hook
   - Hook runs the full test suite
   - If tests fail, push is prevented

## Benefits

- **Faster commits**: Only tests related to changed files run during commit
- **Comprehensive push validation**: Full test suite runs before pushing
- **Code quality**: ESLint ensures consistent code style
- **Prevents broken code**: Failed tests prevent problematic code from being committed/pushed

## Usage

Once set up, the hooks run automatically. You don't need to do anything special:

```bash
# This will automatically run pre-commit hook
git commit -m "your message"

# This will automatically run pre-push hook
git push origin main
```

To bypass hooks (use sparingly):

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify origin main
```
