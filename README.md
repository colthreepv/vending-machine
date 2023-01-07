# vending-machine

The project requires:

- node 18.x LTS
- yarn

Install dependencies with `yarn` then run:

- `cp packages/backend/.env.example packages/backend/.env`
- `yarn workspace backend start` or `yarn workspace backend start:dev`

Tests can be run with:

- `yarn workspace backend test`
- `yarn workspace backend test:e2e`

Tests cover most common usecases, and they are much faster to run than calling API(s) via Postman

## Failed experiments

- ❌ Strapi, failed. Too much effort learning the details on overrides, was not worth it
- ❌ pnpm, Strapi didn't work well with it, just reverted to yarn berry
