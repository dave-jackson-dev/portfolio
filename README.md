# Dave Jackson Portfolio

The public engineering portfolio for [Dave Jackson](https://davejackson.dev), intended for
[`portfolio.davejackson.dev`](https://portfolio.davejackson.dev).

This repository is intentionally built in the open. It will evolve into a federated Angular
frontend with NestJS/CQRS services behind an API gateway. The architecture is designed to make
decisions, boundaries, testing, and delivery practices as visible as the finished portfolio.

## Current status

The workspace is in its foundation phase. The initial Angular application provides a simple
portfolio landing page while the target architecture is validated and implemented in vertical
slices.

Read the design work:

- [Architecture specification](docs/architecture/portfolio-architecture-spec.md)
- [Architecture review](docs/architecture/portfolio-architecture-review.md)

## Local development

Prerequisites: Node.js 22 and npm.

```bash
npm ci
npx nx serve portfolio-web
```

The app is available at `http://localhost:4200` by default.

## Verification

```bash
npx nx test portfolio-web
npx nx build portfolio-web
```

## Repository conventions

- Never commit `.env` files or credentials. Copy `.env.example` when one is introduced.
- Keep domain logic, application orchestration, infrastructure adapters, and presentation code in
  separate layers as described in the architecture specification.
- Use focused, legible commits. This repository is part of the portfolio itself.

## License

License selection is pending. Until a license is added, all rights are reserved.
