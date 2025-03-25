<template>
  <div class="fund-container">
    <div class="fund-content">
      <div class="cards-grid">
        <div 
          v-for="fund in funds" 
          :key="fund.name"
          class="fund-card"
          @click="handleFundSelect(fund.name)"
        >
          <div class="card-content">
            <div class="card-header">
              <h3>{{ fund.name }}</h3>
              <span class="price">
                <span class="price-label">估值:</span>
                {{ fund.currentPrice }}
              </span>
            </div>
            
            <div class="card-stats">
              <div class="stat-item">
                <span class="label">总收益</span>
                <span 
                  class="value"
                  :class="{ 
                    'positive': Number(fund.profit) > 0,
                    'negative': Number(fund.profit) < 0
                  }"
                >
                  ¥{{ fund.profit }}
                </span>
              </div>
              <div class="stat-item">
                <span class="label">总成本</span>
                <span class="value">¥{{ fund.totalCost }}</span>
              </div>
              <div class="stat-item daily-profit">
                <span class="label">
                  {{ formatDate(fund.lastUpdateDate || new Date()) }}收益
                </span>
                <span 
                  class="value"
                  :class="{ 
                    'positive': Number(fund.dailyProfit) > 0,
                    'negative': Number(fund.dailyProfit) < 0
                  }"
                >
                  {{ fund.dailyProfit > 0 ? '+' : '' }}¥{{ calculateDailyProfit(fund).toFixed(2) }}
                  <span class="daily-rate">
                    {{ fund.dailyProfit > 0 ? '+' : '' }}{{ calculateDailyRate(fund).toFixed(2) }}%
                  </span>
                </span>
              </div>
            </div>

            <div class="card-footer">
              <span class="records-count">
                {{ fund.fundRecords.length }} 笔交易
              </span>
            </div>
          </div>
        </div>
      </div>

      <FundDetail 
        v-if="selectedFund"
        :fund-name="selectedFund" 
        :records="selectedFundRecords"
        @back="handleBack"
      />
    </div>

    <div class="float-buttons">
      <FundAdd :funds="funds" @add="handleAdd" />
      <div class="ai-wrapper">
        <FundAI />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import FundDetail from './FundDetail.vue'
import FundAI from '../components/FundAI.vue'
import FundAdd from '../components/FundAdd.vue'
import fundsData from '../assets/data/funds.json'

const router = useRouter()
const funds = ref(fundsData.funds)
const selectedFund = ref('')

const selectedFundRecords = computed(() => {
  const fund = funds.value.find(f => f.name === selectedFund.value)
  return fund ? fund.fundRecords : []
})

function handleFundSelect(fundName) {
  router.push({
    name: 'FundDetail',
    params: { name: fundName }
  })
}

function handleBack() {
  selectedFund.value = ''
}

function handleAdd(data) {
  if (data.type === 'new') {
    funds.value.push(data.fund)
  } else {
    const fund = funds.value.find(f => f.name === data.fundName)
    if (fund) {
      fund.fundRecords.push(data.record)
      fund.totalCost = fund.fundRecords.reduce((sum, r) => sum + Number(r.amount), 0)
      fund.currentPrice = data.record.price
    }
  }
}

// 计算当日收益
function calculateDailyProfit(fund) {
  const totalShares = fund.fundRecords.reduce((sum, record) => 
    sum + Number(record.shares), 0)
  const priceDiff = Number(fund.currentPrice) - Number(fund.previousPrice || fund.currentPrice)
  return totalShares * priceDiff
}

// 计算当日收益率
function calculateDailyRate(fund) {
  if (!fund.previousPrice) return 0
  return ((Number(fund.currentPrice) - Number(fund.previousPrice)) / Number(fund.previousPrice)) * 100
}

// 添加日期格式化函数
function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>

<style scoped>
.fund-container {
  padding: 24px;
  height: 100vh;
  background: #f8f9fa;
}

.fund-content {
  height: calc(100% - 48px);
  position: relative;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.fund-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.fund-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #e0e0e0;
}

.card-content {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.price {
  font-size: 20px;
  font-weight: 500;
  color: #2196f3;
  display: flex;
  align-items: center;
  gap: 4px;
}

.price-label {
  font-size: 12px;
  font-weight: normal;
  color: #999;
}

.card-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 12px;
  color: #666;
}

.value {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.value.positive {
  color: #4caf50;
}

.value.negative {
  color: #f44336;
}

.card-footer {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.records-count {
  font-size: 12px;
  color: #666;
}

.float-buttons {
  position: fixed;
  left: 30px;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 997;
}

.ai-wrapper {
  margin-top: 15px;
}

.ai-wrapper :deep(.chat-trigger) {
  position: static;
  margin: 0;
}

.stats-panel {
  margin-bottom: 24px;
}

.stats-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.main-stats {
  margin-bottom: 0;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.stats-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.total-profit {
  font-size: 24px;
  font-weight: 600;
}

.profit-rate {
  font-size: 16px;
  margin-left: 8px;
  opacity: 0.8;
}

.positive {
  color: #4caf50;
}

.negative {
  color: #f44336;
}

.progress-section {
  padding: 20px 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.progress-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2196f3, #64b5f6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 12px;
  color: #666;
}

.value {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.value.highlight {
  color: #2196f3;
}

.daily-profit {
  grid-column: 1 / -1;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: 4px;
}

.daily-rate {
  font-size: 12px;
  margin-left: 8px;
  opacity: 0.8;
}

.daily-profit .label {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
}
</style> 