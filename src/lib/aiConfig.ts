export interface AIConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  viaProxy: boolean;
}

const FALLBACK_BASE_URL = 'http://localhost:20128/v1';
const FALLBACK_MODEL = 'cmc/deepseek/deepseek-v4.1-flash';

export function getAIConfig(): AIConfig {
  const env = import.meta.env;
  const absoluteBase = env.VITE_AI_BASE_URL || FALLBACK_BASE_URL;
  const viaProxy = import.meta.env.DEV;

  return {
    baseUrl: viaProxy ? '/ai/v1' : absoluteBase,
    apiKey: env.VITE_AI_API_KEY || '',
    model: env.VITE_AI_MODEL || FALLBACK_MODEL,
    viaProxy,
  };
}

export function isAIConfigured(): boolean {
  const config = getAIConfig();
  return Boolean(config.baseUrl && config.model && config.apiKey);
}
