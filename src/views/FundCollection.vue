<template>
  <div class="fund-container">
    <div class="stats-panel">
      <div class="stats-card main-stats">
        <div class="stats-header">
          <h3>投资概览</h3>
          <div class="total-profit" :class="{ 
            'positive': totalProfit > 0,
            'negative': totalProfit < 0 
          }">
            {{ totalProfit > 0 ? '+' : '' }}¥{{ totalProfit.toFixed(2) }}
            <span class="profit-rate">{{ totalProfitRate.toFixed(2) }}%</span>
          </div>
        </div>
        <div class="progress-section">
          <div class="progress-info">
            <span>投资进度</span>
            <span>{{ (investmentProgress * 100).toFixed(1) }}%</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill"
              :style="{ width: `${investmentProgress * 100}%` }"
            ></div>
          </div>
          <div class="progress-details">
            <div class="detail-item">
              <span class="label">已投入</span>
              <span class="value">¥{{ totalCost.toFixed(2) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">计划投入</span>
              <span class="value">¥{{ plannedInvestment.toFixed(2) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">剩余可投</span>
              <span class="value highlight">¥{{ remainingInvestment.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-stats">
        <div class="quick-stat-card">
          <span class="stat-label">持仓基金</span>
          <span class="stat-value">{{ funds.length }}</span>
        </div>
        <div class="quick-stat-card">
          <span class="stat-label">交易次数</span>
          <span class="stat-value">{{ totalTransactions }}</span>
        </div>
        <div class="quick-stat-card">
          <span class="stat-label">月均投入</span>
          <span class="stat-value">¥{{ monthlyAverage.toFixed(2) }}</span>
        </div>
      </div>
    </div>

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
              <span class="price">¥{{ fund.currentPrice }}</span>
            </div>
            
            <div class="card-stats">
              <div class="stat-item">
                <span class="label">收益</span>
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
                <span class="label">成本</span>
                <span class="value">¥{{ fund.totalCost }}</span>
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

const totalProfit = computed(() => {
  return funds.value.reduce((sum, fund) => {
    // 计算每个基金的实际收益
    const profit = fund.fundRecords.reduce((fundSum, record) => {
      const currentValue = Number(record.shares) * Number(fund.currentPrice)
      const cost = Number(record.amount)
      return fundSum + (currentValue - cost)
    }, 0)
    return sum + profit
  }, 0)
})

const totalCost = computed(() => {
  return funds.value.reduce((sum, fund) => {
    // 计算每个基金的实际成本（包含所有交易记录）
    const fundCost = fund.fundRecords.reduce((fundSum, record) => {
      return fundSum + Number(record.amount)
    }, 0)
    return sum + fundCost
  }, 0)
})

const totalProfitRate = computed(() => {
  if (!totalCost.value) return 0
  return (totalProfit.value / totalCost.value) * 100
})

// 设置计划投资金额（这个值可以从配置或用户设置获取）
const plannedInvestment = ref(100000)

const remainingInvestment = computed(() => {
  return Math.max(0, plannedInvestment.value - totalCost.value)
})

const investmentProgress = computed(() => {
  if (!plannedInvestment.value) return 0
  return Math.min(totalCost.value / plannedInvestment.value, 1)
})

const totalTransactions = computed(() => {
  return funds.value.reduce((sum, fund) => sum + fund.fundRecords.length, 0)
})

const monthlyAverage = computed(() => {
  if (!totalTransactions.value) return 0
  
  // 获取最早和最新交易日期
  const dates = funds.value.flatMap(fund => 
    fund.fundRecords.map(record => new Date(record.date))
  )
  
  if (!dates.length) return 0
  
  const earliestDate = new Date(Math.min(...dates))
  const latestDate = new Date(Math.max(...dates))
  
  // 计算月份差
  const months = (latestDate.getFullYear() - earliestDate.getFullYear()) * 12 +
    (latestDate.getMonth() - earliestDate.getMonth()) + 1
  
  return totalCost.value / Math.max(months, 1)
})
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
  margin-bottom: 32px;
}

.stats-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.main-stats {
  margin-bottom: 20px;
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

.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.quick-stat-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}
</style> 