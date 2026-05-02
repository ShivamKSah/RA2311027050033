/**
 * Logging Middleware - Main export file
 *
 * Re-exports the Log function and all TypeScript types
 * for use across the application.
 *
 * Usage:
 *   import { Log } from '../../logging_middleware/src';
 *   await Log("frontend", "info", "api", "Fetching data...");
 */

export { Log } from "./logger";
export type { Stack, Level, Package, FrontendPackage, SharedPackage, BackendPackage } from "./types";
