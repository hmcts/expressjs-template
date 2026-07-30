declare module '@hmcts/nodejs-healthcheck' {
  import type { Application } from 'express';

  export interface HealthResult {
    status: 'UP' | 'DOWN';
    [key: string]: unknown;
  }

  export interface HealthCheck {
    readonly __healthCheck?: never;
  }

  export interface HealthcheckConfig {
    checks?: Record<string, HealthCheck>;
    readinessChecks?: Record<string, HealthCheck>;
    buildInfo?: Record<string, unknown>;
  }

  export interface WebCheckOptions {
    callback?: (error: unknown, response: unknown) => HealthResult;
    timeout?: number;
    deadline?: number;
  }

  export function addTo(app: Application, config?: HealthcheckConfig): void;

  export function raw(check: () => HealthResult | Promise<HealthResult>): HealthCheck;

  export function web(url: string, options?: WebCheckOptions): HealthCheck;

  export function up(): HealthResult;

  export function down(): HealthResult;
}
