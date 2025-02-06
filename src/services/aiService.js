import OpenAI from "openai"
import { AI_PROVIDERS } from './aiProviders'

const openai = new OpenAI({
  apiKey: AI_PROVIDERS.OPENAI.apiKey,
  baseURL: AI_PROVIDERS.OPENAI.baseURL,
  dangerouslyAllowBrowser: true
})

// OpenAI 服务
async function chatWithOpenAI(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: AI_PROVIDERS.OPENAI.model,
      store: true,
      messages: [
        {"role": "system", "content": "你是一个投资理财助手，专门回答关于基金投资的问题。"},
        {"role": "user", "content": message}
      ]
    })
    return completion.choices[0].message.content
  } catch (error) {
    console.error('OpenAI 对话出错:', error)
    throw error
  }
}

// Deepseek 服务
async function chatWithDeepseek(message) {
  try {
    const response = await fetch(`${AI_PROVIDERS.DEEPSEEK.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_PROVIDERS.DEEPSEEK.apiKey}`
      },
      body: JSON.stringify({
        model: AI_PROVIDERS.DEEPSEEK.model,
        messages: [
          {"role": "system", "content": "你是一个投资理财助手，专门回答关于基金投资的问题。"},
          {"role": "user", "content": message}
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`Deepseek API 错误: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Deepseek 对话出错:', error)
    throw error
  }
}

// 统一的 AI 服务接口
export async function chatWithAI(provider, message) {
  switch (provider) {
    case 'OPENAI':
      return await chatWithOpenAI(message)
    case 'DEEPSEEK':
      return await chatWithDeepseek(message)
    default:
      throw new Error('未知的 AI 提供商')
  }
} 