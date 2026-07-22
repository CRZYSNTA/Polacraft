/**
 * Polacraft v1.2.1 - Centralized AI Logger
 */

export class AILogger {
  static info(message: string, meta?: Record<string, unknown>) {
    console.log(`[AI INFO] [${new Date().toISOString()}] ${message}`, meta ? JSON.stringify(meta) : "");
  }

  static warn(message: string, meta?: Record<string, unknown>) {
    console.warn(`[AI WARN] [${new Date().toISOString()}] ${message}`, meta ? JSON.stringify(meta) : "");
  }

  static error(message: string, meta?: Record<string, unknown>) {
    console.error(`[AI ERROR] [${new Date().toISOString()}] ${message}`, meta ? JSON.stringify(meta) : "");
  }

  static selection(providerName: string, reason: string) {
    this.info(`Provider Selected: ${providerName}`, { reason });
  }

  static healthCheck(providerName: string, status: boolean, isMock: boolean) {
    this.info(`Health Check Executed: ${providerName}`, { available: status, mockMode: isMock });
  }
}
