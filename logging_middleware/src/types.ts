/**
 * TypeScript types and enums for the logging middleware.
 * Defines strict types for stack, level, and package identifiers.
 */

/** Represents the application stack layer */
export type Stack = "frontend" | "backend";

/** Log severity levels ordered from least to most severe */
export type Level = "debug" | "info" | "warn" | "error" | "fatal";

/** Frontend-specific package identifiers */
export type FrontendPackage = "api" | "component" | "hook" | "page" | "state" | "style";

/** Shared package identifiers used by both frontend and backend */
export type SharedPackage = "auth" | "config" | "middleware" | "utils";

/** Backend-specific package identifiers */
export type BackendPackage =
  | "cache"
  | "controller"
  | "cron_job"
  | "db"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service";

/** Union of all valid package identifiers */
export type Package = FrontendPackage | SharedPackage | BackendPackage;
