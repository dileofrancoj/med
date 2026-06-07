# AGENTS.md

## Build and test commands
- **Install dependencies:** `npm install`
- **Build the application:** `npm run build`
- **Run locally (Development):** `npm run start:dev`
- **Run production build:** `npm run start`
- **Run all tests:** `npm run test`
- **Run tests with watch mode:** `npm run test:watch`
- **Lint the code:** `npm run lint`
- **Format the code:** `npm run format`

## Project overview
This microservice resolves search results for food vendors and products for the webview search detail and prepares the tracking payload.

Key entrypoints:
- `src/index.ts`: Application entry point and server startup.
- `src/routes/search_routes.ts`: API route definitions and handler registration.
- `src/handlers/`: Express HTTP request handlers and input validation.
- `src/services/`: Core business logic and orchestration.
- `src/repositories/`: Data access layer and mock data storage.

### Repository layout
```
.
├── src/
│   ├── index.ts             # Main application entry point (Server setup & Express start)
│   ├── api/                 # OpenAPI/Swagger specifications
│   ├── common/              # Shared utilities and headers
│   ├── constants/           # Application-wide constants
│   ├── handlers/            # Express HTTP handlers (Req/Res parsing and validation)
│   ├── mappers/             # Data transformation logic (DTOs to Domain)
│   ├── models/              # TypeScript Interfaces & Types for domain and DTOs
│   ├── repositories/        # Data access layer
│   ├── routes/              # Express routing definitions and middleware configuration
│   ├── services/            # Core business logic implementation
│   └── utils/               # Helper functions and configuration management (dotenv/config)
├── tests/                   # Setup files or global test utilities
├── package.json             # Dependencies and Node scripts
├── tsconfig.json            # TypeScript configuration
├── vitest.config.ts         # Vitest configuration
├── eslint.config.mjs        # ESLint configuration
├── .prettierrc              # Prettier configuration
└── AGENTS.md                # Agent and workflow instructions for the Node project
```

## Key technologies
- **Language:** TypeScript
- **Package manager:** NPM
- **Framework:** Express
- **Testing:** Vitest

## Code style guidelines
- Follow standard TypeScript and Node.js clean code conventions.
- Maintain consistency with the layered (clean) architecture.
- **Imports:** Standard relative path imports should not use `.js` suffixes (e.g., `import { config } from './utils/config'`).
- **Formatting:** Code formatting is enforced via Prettier (`npm run format`).
- **Linting:** Code linting is enforced via ESLint (`npm run lint`).

## Testing instructions
- To run the full test suite, use `npm run test`.
- To watch tests during development, use `npm run test:watch`.

## Security considerations
- **Secret Management:** Never commit hardcoded secrets or `.env` files. Use environment variables managed via dotenv configuration.

## Extra instructions
- **Pull Request Template:** When preparing a Pull Request, follow the template at `.github/PULL_REQUEST_TEMPLATE.md`.
- **Changelog Update:** When preparing a Pull Request, you MUST create a new entry in `CHANGELOG.md` respecting its existing structure (e.g., using `#### [Version](Link)` followed by `> Day Month Year` and categories like `#### 🚀 New Features` or `#### 🐛 Bug Fix`).

### Agent development cycle (default, unless overridden)
- This is the default workflow for this repository.
- **Override:** Only override this workflow if the task explicitly says to use a different workflow (e.g., "override the default workflow" / "follow this workflow instead") or provides its own step-by-step "Workflow / Way of working". If overridden, do not merge workflows.
- **Plan once:** Before coding, propose a TODO list oriented to iterative implementation and STOP. Ask for approval once. After approval, proceed without asking for the plan again unless new information invalidates it.
- **Test-first (when supported):** If the repo has an existing test framework AND documented test command(s) (as listed in this AGENTS.md), write/update tests that specify the new behavior before implementing the production change.
- **Quality gate (must answer “yes” before finishing):**
  - **Task alignment:** Does the change meet every requirement from the original request (and nothing unrelated)?
  - **Tests for new logic:** Did I add/adjust unit tests covering the success path and relevant error or edge cases (when supported in this repo)?
  - **Idiomatic + consistent:** Does the implementation follow repo conventions and language idioms?
  - **Clarity + simplicity:** Is the code easy to read and minimizes complexity?
  - **Error handling:** Are failure modes handled explicitly using the repo’s idioms (exceptions, Result types, validations, retries), with no silent failures?
- **Final verification (only using verified commands listed above):** Run the applicable validation commands that exist in this repo and are listed in "Build and test commands":
  - build/compile validation (if listed)
  - tests covering what you changed (single/scope if documented, otherwise full test command)
  - lint/format/typecheck (if listed)
