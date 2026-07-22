/**
 * Polacraft v1.2.1 - AI Provider Factory (Dependency Injection & Abstraction Layer)
 */

import { IAIProvider } from "./provider";
import { OpenAIProvider } from "./openai";
import { GeminiProvider } from "./gemini";
import { AnthropicProvider } from "./anthropic";
import { AIProviderName } from "./types";
import { AILogger } from "./logger";

class AIProviderFactory {
  private static instanceMap: Map<string, IAIProvider> = new Map();

  /**
   * Retrieves or instantiates provider singleton matching configured requested name
   */
  static getProvider(providerName?: AIProviderName): IAIProvider {
    const selectedName = (providerName || process.env.AI_PROVIDER || "openai").toLowerCase() as AIProviderName;

    if (this.instanceMap.has(selectedName)) {
      return this.instanceMap.get(selectedName)!;
    }

    let provider: IAIProvider;

    switch (selectedName) {
      case "gemini":
        provider = new GeminiProvider();
        break;
      case "anthropic":
        provider = new AnthropicProvider();
        break;
      case "openai":
      default:
        provider = new OpenAIProvider();
        break;
    }

    AILogger.selection(provider.name, `Requested provider '${selectedName}' initialized via AIProviderFactory.`);
    this.instanceMap.set(selectedName, provider);
    return provider;
  }

  /**
   * Returns health checks for all registered AI providers
   */
  static async getAllHealthChecks() {
    const providers: IAIProvider[] = [
      new OpenAIProvider(),
      new GeminiProvider(),
      new AnthropicProvider()
    ];

    const results = await Promise.all(providers.map((p) => p.healthCheck()));
    return results;
  }
}

export const getAIProvider = (name?: AIProviderName) => AIProviderFactory.getProvider(name);
export const getAllAIHealthChecks = () => AIProviderFactory.getAllHealthChecks();
