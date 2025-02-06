<template>
  <!-- 聊天图标按钮 -->
  <div class="chat-trigger" @click="showChat = true">
    <span class="chat-icon">💬</span>
  </div>

  <!-- 弹出式对话框 -->
  <div class="dialog-overlay" v-if="showChat" @click="showChat = false">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h3>AI 助手</h3>
        <button class="close-btn" @click="showChat = false">×</button>
      </div>

      <div class="chat-body">
        <div class="chat-history" ref="chatHistoryEl" v-if="chatHistory.length">
          <div 
            v-for="(chat, index) in chatHistory" 
            :key="index"
            :class="['chat-message', chat.type]"
          >
            <div class="message-header">
              <span class="message-icon">
                {{ chat.type === 'user' ? '👤' : AI_PROVIDERS[currentProvider].name }}
              </span>
              <span class="message-time">{{ chat.time }}</span>
            </div>
            <div 
              class="message-content"
              v-if="chat.type === 'user'"
            >{{ chat.content }}</div>
            <div 
              class="message-content markdown-body"
              v-else
              v-html="parseMarkdown(chat.content)"
            ></div>
          </div>
        </div>

        <div class="chat-input-section">
          <div class="input-group">
            <textarea 
              v-model="question" 
              @keyup.enter.exact="handleAsk"
              @keydown="handleInput"
              :placeholder="`使用 ${AI_PROVIDERS[currentProvider].name} 询问基金相关问题...`"
              :disabled="isLoading"
              ref="inputArea"
              rows="1"
            ></textarea>
            <div class="action-group">
              <div class="provider-select">
                <select v-model="currentProvider">
                  <option 
                    v-for="(provider, key) in AI_PROVIDERS" 
                    :key="key" 
                    :value="key"
                  >
                    {{ provider.icon }} {{ provider.name }}
                  </option>
                </select>
              </div>
              <button 
                class="btn-primary"
                @click="handleAsk" 
                :disabled="isLoading || !question.trim()"
              >
                {{ isLoading ? '思考中...' : '发送' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { marked } from 'marked'
import { chatWithAI } from '../services/aiService'
import { AI_PROVIDERS } from '../services/aiProviders'

const showChat = ref(false)
const question = ref('')
const isLoading = ref(false)
const currentProvider = ref('DEEPSEEK')
const chatHistory = ref([])
const inputArea = ref(null)
const chatHistoryEl = ref(null)

// 配置 marked
marked.setOptions({
  breaks: true, // 支持 GitHub 风格的换行
  gfm: true,    // 启用 GitHub 风格的 Markdown
  sanitize: false // 允许 HTML 标签
})

// Markdown 解析函数
function parseMarkdown(content) {
  if (!content) return ''
  return marked(content)
}

function formatTime() {
  return new Date().toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 自动调整输入框高度
function adjustTextareaHeight() {
  const textarea = inputArea.value
  if (!textarea) return
  
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px' // 最大高度120px
}

// 处理输入事件
function handleInput(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    return
  }
  nextTick(() => {
    adjustTextareaHeight()
  })
}

// 监听聊天历史变化，自动滚动到底部
watch(chatHistory, () => {
  nextTick(() => {
    if (chatHistoryEl.value) {
      chatHistoryEl.value.scrollTop = chatHistoryEl.value.scrollHeight
    }
  })
}, { deep: true })

async function handleAsk() {
  if (!question.value.trim() || isLoading.value) return
  
  const userQuestion = question.value
  chatHistory.value.push({
    type: 'user',
    content: userQuestion,
    time: formatTime()
  })
  
  isLoading.value = true
  try {
    const response = await chatWithAI(currentProvider.value, userQuestion)
    chatHistory.value.push({
      type: 'ai',
      content: response,
      time: formatTime()
    })
    question.value = ''
    // 重置输入框高度
    if (inputArea.value) {
      inputArea.value.style.height = '40px'
    }
  } catch (error) {
    chatHistory.value.push({
      type: 'error',
      content: '抱歉，发生了错误，请稍后再试。',
      time: formatTime()
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.chat-trigger {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #2196f3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  z-index: 998;
  border: 2px solid white;
}

.chat-trigger:hover {
  transform: scale(1.1);
  background: #1976d2;
}

.chat-icon {
  font-size: 24px;
  color: white;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  padding: 0;
  border-radius: 16px;
  width: 600px;
  max-width: 95%;
  height: 80vh; /* 改为固定高度 */
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  animation: slideUp 0.3s ease;
  display: flex;
  flex-direction: column;
  margin-top: auto; /* 将对话框推到底部 */
  margin-bottom: 20px; /* 底部留出一些空间 */
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  border-radius: 50%;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #666;
}

.chat-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止内容溢出 */
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.chat-message {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 12px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-message.user {
  background: #e3f2fd;
  margin-left: 20%;
}

.chat-message.ai {
  background: white;
  margin-right: 20%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
}

.message-icon {
  font-size: 16px;
}

.message-content {
  line-height: 1.6;
  color: #333;
  font-size: 14px;
  white-space: pre-wrap; /* 保留空格和换行 */
}

/* Markdown 样式 */
.markdown-body {
  padding: 0;
}

.markdown-body :deep(p) {
  margin: 0.5em 0;
}

.markdown-body :deep(code) {
  padding: 0.2em 0.4em;
  background-color: rgba(175, 184, 193, 0.2);
  border-radius: 6px;
  font-family: ui-monospace, monospace;
  font-size: 0.85em;
}

.markdown-body :deep(pre) {
  padding: 16px;
  background-color: #f6f8fa;
  border-radius: 6px;
  overflow: auto;
  margin: 0.5em 0;
}

.markdown-body :deep(pre code) {
  padding: 0;
  background: none;
}

.markdown-body :deep(ul), 
.markdown-body :deep(ol) {
  padding-left: 2em;
  margin: 0.5em 0;
}

.markdown-body :deep(blockquote) {
  margin: 0.5em 0;
  padding: 0 1em;
  color: #656d76;
  border-left: 0.25em solid #d0d7de;
}

.markdown-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5em 0;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: 6px 13px;
  border: 1px solid #d0d7de;
}

.markdown-body :deep(tr:nth-child(2n)) {
  background-color: #f6f8fa;
}

/* 代码高亮滚动条 */
.markdown-body :deep(pre)::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.markdown-body :deep(pre)::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.markdown-body :deep(pre)::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.chat-input-section {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  background: white;
  border-radius: 0 0 16px 16px;
  margin-top: auto; /* 确保输入框在底部 */
}

.input-group {
  display: flex;
  gap: 12px;
}

.action-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.provider-select {
  width: 120px; /* 调整宽度以适应按钮宽度 */
}

.provider-select select {
  width: 100%;
  padding: 8px 28px 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  height: 36px;
}

.input-group textarea {
  flex: 1;
  min-width: 200px;
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  min-height: 40px;
  max-height: 120px; /* 最大高度 */
  resize: none;
  line-height: 1.5;
  overflow-y: auto;
}

.input-group textarea:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.btn-primary {
  height: 36px;
  width: 120px; /* 与选择器等宽 */
  padding: 0;
  border: none;
  background: #2196f3;
  color: white;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-primary:hover:not(:disabled) {
  background: #1976d2;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 自定义文本框滚动条 */
.input-group textarea::-webkit-scrollbar {
  width: 6px;
}

.input-group textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.input-group textarea::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

/* 自定义滚动条 */
.chat-history::-webkit-scrollbar {
  width: 6px;
}

.chat-history::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-history::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}
</style> 