# Testing code changes

Once you have implemented code changes, run autoformatter, linter and unit tests.

```
npm run format
npm run lint
npm run test
```

# Testing SVG rendering changes

When asked to make changes to the SVG rendering, you can verify how the SVG output looks like with the following tool:

```
npm run --silent render:svg
npm run --silent render:svg -- --category=AssaultRifle
npm run --silent render:svg -- --category=AssaultRifle --dataModelSeed=5f930404 --partSizeSeed=a784b217 --aestheticDetailSeed=44c43249
```

If you are running in GitHub Copilot Cloud, and creating a pull request that changes the SVG rendering, always provide a visual screenshot of the SVG for the user.

# Appearance

See the [style guide](doc/styleguide.md) for rules on the aesthetics when making visual changes.
