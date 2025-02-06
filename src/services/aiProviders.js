export const AI_PROVIDERS = {
  OPENAI: {
    name: 'OpenAI',
    icon: '',
    model: 'gpt-4o-mini',
    baseURL: 'https://api.openai.com/v1',
    apiKey: process.env.VUE_APP_OPENAI_API_KEY
  },
  DEEPSEEK: {
    name: 'Deepseek',
    icon: '',
    model: 'deepseek-chat',
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: process.env.VUE_APP_DEEPSEEK_API_KEY
  }
} 