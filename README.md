# Integration Manager Example

![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)
![NestJS](https://img.shields.io/badge/NestJS-11-ea2845.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)
![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey.svg)

A **seed/starter codebase** for building Integration Manager microservices using NestJS and Hexagonal Architecture. This project demonstrates a CQRS-inspired pattern where **read operations (Queries)** are served through a REST API and **write operations (Commands)** are consumed from AWS SQS message queues. The microservice integrates with an external service as its data source for both reading and writing.

---

## Badges

![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-pending-yellow.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey.svg)

---

## Table of Contents

- [Key Features](#key-features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage / Running](#usage--running)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Key Features

- **Hexagonal Architecture (Ports & Adapters)** — Clean separation between domain logic, application use cases, and infrastructure concerns
- **CQRS Pattern** — Commands (write operations) and Queries (read operations) are handled through different entry points
- **REST API for Queries** — Read operations are exposed via versioned HTTP endpoints with Swagger documentation
- **SQS Consumers for Commands** — Write operations are consumed from AWS SQS queues using a cron-based polling mechanism
- **External Service Integration** — Repository port pattern enables plugging in any external data source
- **Environment Validation** — Startup-time validation of environment variables using Joi schemas
- **Structured Logging** — Transient logger adapter based on NestJS Logger with context support
- **Swagger/OpenAPI** — Auto-generated API documentation with request/response DTOs
- **Base Classes** — Reusable abstractions (`UseCase`, `Command`, `Query`, `Message`, `SQSConsumerBase`) to enforce consistent patterns across modules

---

## Architecture

This project follows the **Hexagonal Architecture** (also known as Ports & Adapters), combined with a CQRS-inspired separation of reads and writes.

```
                    ┌──────────────────────────────────────────────┐
                    │                 INTERFACE                     │
  HTTP Request ───► │  Controllers (REST API)   ── Queries ──┐    │
                    │                                         │    │
  SQS Message  ───► │  Consumers (SQS Polling)  ── Commands ──┤    │
                    └──────────────────────────────────────────┤────┘
                                                               │
                    ┌──────────────────────────────────────────┤────┐
                    │              APPLICATION                  │    │
                    │                                          ▼    │
                    │  Use Cases (ProductCreator, ProductsFinder...)│
                    │         │                                     │
                    │         │ depends on Port (interface)         │
                    └─────────┤─────────────────────────────────────┘
                              │
                    ┌─────────┤─────────────────────────────────────┐
                    │         ▼        DOMAIN                       │
                    │  Entities (Product)                           │
                    │  Commands (CreateProduct, UpdateProduct, ...)  │
                    │  Queries (FindAllProducts, FindProductById)    │
                    │  Ports (ProductRepositoryPort, LoggerPort)     │
                    └─────────┬─────────────────────────────────────┘
                              │
                    ┌─────────┤─────────────────────────────────────┐
                    │         ▼     INFRASTRUCTURE                  │
                    │  Adapters (ProductExternalServiceAdapter)      │
                    │  Implements Ports → calls external services    │
                    └───────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Directory | Responsibility |
|-------|-----------|----------------|
| **Base** | `src/base/` | External service configurations (SQS client, logger, env), route definitions, and base classes (`UseCase`, `Command`, `Query`, `Message`, `SQSConsumerBase`) that other classes extend |
| **Domain** | `src/modules/*/domain/` | Entities, value objects, commands, queries, and ports (interfaces). Zero dependencies on frameworks or infrastructure |
| **Application** | `src/modules/*/application/` | Use cases that orchestrate domain logic. Depend only on domain ports |
| **Infrastructure** | `src/modules/*/infrastructure/` | Adapters that implement domain ports by connecting to external services (APIs, databases, etc.) |
| **Interface** | `src/modules/*/interface/` | Entry points to the application — REST controllers for queries and SQS consumers for commands |

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or yarn/pnpm)
- **AWS Account** with SQS queue configured (for message consumption)
- **AWS Credentials** with permissions to read/delete messages from SQS

---

## Installation & Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd integration-manager-example
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your specific configuration (see [Environment Variables](#environment-variables) for details).

---

## Usage / Running

```bash
# Development (with hot reload)
npm run start:dev

# Debug mode
npm run start:debug

# Production build
npm run build
npm run start:prod

# Linting
npm run lint

# Code formatting
npm run format
```

---

## API Documentation

This project uses **Swagger/OpenAPI** via `@nestjs/swagger`. Once the application is running, API documentation is available at:

> `http://localhost:<PORT>/api`

*(Swagger setup may need to be configured in `main.ts` if not yet enabled.)*

### Products Module

#### Query Endpoints (REST API)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | Find all products (paginated via `page` and `limit` query params) |
| `GET` | `/products/:id` | Find a single product by ID |

#### Command Consumers (SQS)

| Consumer | Queue | Description |
|----------|-------|-------------|
| `CreateProductSQSConsumer` | Configured via `SQS_QUEUE_URL` | Polls SQS every minute for create-product messages |
| `UpdateProductSQSConsumer` | *To be configured* | Consumes update-product messages |
| `RemoveProductSQSConsumer` | *To be configured* | Consumes remove-product messages |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Returns `Hello World` (basic health check) |

---

## Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Port number for the HTTP server | Yes | `3000` |
| `NODE_ENV` | Application environment (`development`, `test`, `staging`, `production`) | Yes | `development` |
| `AWS_REGION` | AWS region for SQS client | Yes | `us-east-1` |
| `SQS_QUEUE_URL` | Full URL of the SQS queue to consume messages from | Yes | `https://sqs.us-east-1.amazonaws.com/123456789/my-queue` |
| `AWS_ACCESS_KEY_ID` | AWS access key for authentication | No | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for authentication | No | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |

> **Note:** AWS credentials are optional if running on infrastructure with an IAM role attached (e.g., EC2, ECS, Lambda).

---

## Project Structure

```
src/
├── main.ts                              # Application entry point
├── app.module.ts                        # Root module — imports all global and feature modules
├── app.controller.ts                    # Root controller (health check)
│
├── base/                                # Shared configurations and base classes
│   ├── config/
│   │   ├── env/                         # Environment config module with Joi validation
│   │   │   ├── env-config.module.ts
│   │   │   ├── env-config.service.ts
│   │   │   └── env-config.validation.ts
│   │   ├── logger/                      # Logger adapter (NestJS Logger wrapped behind a port)
│   │   │   ├── logger-di-tokens.ts
│   │   │   ├── logger.adapter.ts
│   │   │   └── logger.module.ts
│   │   ├── message/                     # SQS client initialization module
│   │   │   ├── message.di-tokens.ts
│   │   │   └── message.module.ts
│   │   └── routes/                      # Centralized route definitions
│   │       └── app.routes.ts
│   └── lib/
│       ├── application/
│       │   └── use-case.base.ts         # Abstract UseCase<Input, Output>
│       ├── controllers/
│       │   └── generic.response.dto.ts  # Reusable success response DTO
│       ├── domain/
│       │   ├── command.base.ts          # Abstract Command base class
│       │   ├── query.base.ts            # Abstract Query base class
│       │   ├── message.base.ts          # Abstract Message base class
│       │   └── logger.port.ts           # LoggerPort interface
│       └── interface/
│           └── sqs.consumer.base.ts     # SQS consumer base with polling and deletion logic
│
└── modules/
    └── products/                        # Feature module: Products
        ├── products.module.ts           # NestJS module wiring
        ├── products-di.tokens.ts        # DI token symbols
        │
        ├── domain/                      # Domain layer
        │   ├── entities/
        │   │   └── product.ts           # Product entity
        │   ├── commands/
        │   │   ├── create-product.command.ts
        │   │   ├── update-product.command.ts
        │   │   └── remove-product.command.ts
        │   ├── queries/
        │   │   ├── find-all-products.query.ts
        │   │   └── find-product-by-id.query.ts
        │   └── ports/
        │       └── product.repository.port.ts   # Repository port interface
        │
        ├── application/                 # Application layer (use cases)
        │   ├── commands/
        │   │   ├── product-creator.ts
        │   │   ├── product-updater.ts
        │   │   └── product-remover.ts
        │   └── queries/
        │       ├── products-finder.ts
        │       └── product-by-id-finder.ts
        │
        ├── infrastructure/              # Infrastructure layer (adapters)
        │   └── repository/
        │       └── external-service/
        │           └── product.external-service.adapter.ts  # Implements ProductRepositoryPort
        │
        └── interface/                   # Interface layer (entry points)
            ├── controllers/
            │   ├── find-all-products/
            │   │   ├── find-all-products.http.controller.ts
            │   │   ├── dto/
            │   │   │   ├── find-all-product.query-params.dto.ts
            │   │   │   └── products.response.dto.ts
            │   │   └── mapper/
            │   │       └── find-all-products.mapper.ts
            │   └── find-product-by-id/
            │       ├── find-product-by-id.http.controller.ts
            │       ├── dto/
            │       │   ├── find-product-by-id.params.dto.ts
            │       │   └── product.response.dto.ts
            │       └── mapper/
            │           └── find-product-by-id.mapper.ts
            └── consumer/
                ├── create-product/
                │   ├── create-product.sqs.consumer.ts
                │   ├── dto/
                │   │   └── create-product.message.ts
                │   └── mapper/
                │       └── create-product.mapper.ts
                ├── update-product/
                │   ├── update-product.sqs.consumer.ts
                │   ├── dto/
                │   │   └── update-product.message.ts
                │   └── mapper/
                │       └── update-product.mapper.ts
                └── remove-product/
                    ├── remove-product.sqs.consumer.ts
                    ├── dto/
                    │   └── remove-product.message.ts
                    └── mapper/
                        └── remove-product.mapper.ts

test/
├── app.e2e-spec.ts                      # End-to-end test for root endpoint
└── jest-e2e.json                        # Jest configuration for e2e tests
```

---

## Testing

### Running Tests

```bash
# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# Test coverage
npm run test:cov

# End-to-end tests
npm run test:e2e

# Debug tests
npm run test:debug
```

### Testing Strategy

The project uses **Jest** as its testing framework with `ts-jest` for TypeScript support.

- **Unit tests** (`*.spec.ts`) — Test individual use cases, mappers, and domain logic in isolation. Located alongside source files.
- **End-to-end tests** (`test/*.e2e-spec.ts`) — Test the full HTTP request lifecycle using `supertest` against a running NestJS application instance.

> **Note:** This starter template includes a basic e2e test. Unit tests should be added as the project evolves.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Follow the existing code structure and architectural patterns:
   - Domain logic in `domain/`
   - Use cases in `application/`
   - External service integrations in `infrastructure/`
   - Controllers and consumers in `interface/`
4. Write tests for new functionality
5. Ensure linting passes (`npm run lint`)
6. Commit your changes (`git commit -m 'feat: add my feature'`)
7. Push to the branch (`git push origin feature/my-feature`)
8. Open a Pull Request

---

## License

This project is **UNLICENSED**.
