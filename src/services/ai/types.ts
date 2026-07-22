/**
 * Polacraft v1.2.1 - AI Foundation Shared Types & Interfaces
 */

export type AIProviderName = "openai" | "gemini" | "anthropic" | "azure" | "custom";

export interface ProviderCapabilities {
  textGeneration: boolean;
  visionAnalysis: boolean;
  structuredOutput: boolean;
  streaming: boolean;
  functionCalling: boolean;
}

export interface AISettings {
  enabled: boolean;
  provider: AIProviderName;
  defaultTone: string;
  defaultLanguage: string;
  maxDescriptionLength: number;
}

export interface VisionResult {
  provider: string;
  movie: string | null;
  actor: string | null;
  character: string | null;
  visibleText: string[];
  posterStyle: string;
  dominantColors: string[];
  language: string;
  confidence: {
    movie: number;
    actor: number;
    character: number;
  };
  reviewRequired: boolean;
}

export interface GenerationResult<T = string> {
  success: boolean;
  provider: string;
  data: T;
  executionTimeMs: number;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIError {
  success: false;
  provider: string;
  reason: string;
  code?: string;
}

export interface HealthCheckResult {
  providerName: string;
  available: boolean;
  configured: boolean;
  capabilities: ProviderCapabilities;
  version: string;
  mockMode: boolean;
  statusMessage: string;
}

export interface TextGenerationOptions {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface VisionAnalysisOptions {
  imageUrl: string;
  prompt?: string;
}

export interface StructuredDataOptions<T> {
  prompt: string;
  schemaDescription: string;
  fallback: T;
}
