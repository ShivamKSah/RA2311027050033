# Logging Middleware

A reusable, structured logging package that sends log entries to a remote evaluation service endpoint.

## Features

- **Type-safe**: Strict TypeScript types for stack, level, and package identifiers
- **Silent failures**: Log API errors are caught silently to prevent application crashes
- **Async**: Non-blocking log delivery via async/await
- **Zero dependencies**: No external runtime dependencies

## Usage

```typescript
import { Log } from '../../logging_middleware/src';

// Log an informational message from the API layer
await Log("frontend", "info", "api", "Fetching notifications");

// Log an error from a component
await Log("frontend", "error", "component", "Failed to render card");
```

## Types

| Type | Values |
|------|--------|
| `Stack` | `"frontend"`, `"backend"` |
| `Level` | `"debug"`, `"info"`, `"warn"`, `"error"`, `"fatal"` |
| `FrontendPackage` | `"api"`, `"component"`, `"hook"`, `"page"`, `"state"`, `"style"` |
| `SharedPackage` | `"auth"`, `"config"`, `"middleware"`, `"utils"` |
| `BackendPackage` | `"cache"`, `"controller"`, `"cron_job"`, `"db"`, `"domain"`, `"handler"`, `"repository"`, `"route"`, `"service"` |

## Configuration

Set the `NEXT_PUBLIC_BEARER_TOKEN` environment variable with a valid Bearer token for authentication.
