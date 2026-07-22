/**
 * Polacraft v1.2.1 - Single Provider Interface contract
 */

import {
  HealthCheckResult,
  GenerationResult,
  VisionResult,
  TextGenerationOptions,
  VisionAnalysisOptions,
  StructuredDataOptions,
  ProviderCapabilities,
} from "./types";

export interface IAIProvider {
  readonly name: string;
  readonly capabilities: ProviderCapabilities;

  initialize(): Promise<void>;
  isAvailable(): boolean;
  generateText(options: TextGenerationOptions): Promise<GenerationResult<string>>;
  analyzeImage(options: VisionAnalysisOptions): Promise<GenerationResult<VisionResult>>;
  generateStructuredData<T>(options: StructuredDataOptions<T>): Promise<GenerationResult<T>>;
  healthCheck(): Promise<HealthCheckResult>;
  dispose(): Promise<void>;
}
