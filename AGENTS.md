Once you have implemented code changes, run autoformatter, linter and unit tests.

```
npm run format
npm run lint
npm run test
```

When asked to make changes to the SVG rendering, you can verify how the SVG output looks like with the following tool:

```
npm run --silent render:svg
npm run --silent render:svg -- --category=AssaultRifle
npm run --silent render:svg -- --category=AssaultRifle --dataModelSeed=5f930404 --partSizeSeed=a784b217 --aestheticDetailSeed=44c43249
```
