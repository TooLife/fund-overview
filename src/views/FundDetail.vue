<template>
  <div class="detail-container">
    <div class="detail-header">
      <button class="back-btn" @click="handleBack">
        返回
      </button>
      <h2>{{ name }}</h2>
    </div>

    <div class="fund-details-table">
      <table>
        <thead>
          <tr>
            <th>买入日期</th>
            <th>金额</th>
            <th>价格</th>
            <th>份额</th>
            <th>收益率</th>
            <th>收益金额</th>
            <th>持有天数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.date">
            <td>{{ record.date }}</td>
            <td>¥{{ record.amount }}</td>
            <td>¥{{ record.price }}</td>
            <td>{{ record.shares }}</td>
            <td>{{ record.rate }}%</td>
            <td>¥{{ record.profit }}</td>
            <td>{{ record.days }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import fundsData from '../assets/data/funds.json'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

const router = useRouter()

const records = computed(() => {
  const fund = fundsData.funds.find(f => f.name === props.name)
  return fund ? fund.fundRecords : []
})

function handleBack() {
  router.push({ name: 'FundCollection' })
}
</script>

<style scoped>
.detail-container {
  padding: 24px;
  height: 100vh;
  background: #f8f9fa;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-btn {
  padding: 0 16px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: #ffffff;
  color: #397bed;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  font-size: 14px;
}

.fund-details-table {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

th {
  background: #f8f9fa;
  font-weight: 500;
  color: #666;
}

tr:hover {
  background: #f8f9fa;
}
</style> 