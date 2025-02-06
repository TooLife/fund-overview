<template>
  <div>
    <div class="add-button" @click="showDialog = true">
      <span class="add-icon">＋</span>
    </div>
    
    <div class="dialog-overlay" v-if="showDialog" @click="showDialog = false">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>新增交易记录</h3>
          <button class="close-btn" @click="showDialog = false">×</button>
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- 基金选择/新增部分 -->
          <div class="form-group">
            <label>基金名称</label>
            <div class="fund-select">
              <select v-if="!isNewFund" v-model="selectedFund" @change="handleFundSelect">
                <option value="" disabled selected>请选择基金</option>
                <option v-for="fund in funds" :key="fund.name" :value="fund.name">
                  {{ fund.name }}
                </option>
                <option value="new">输入新基金...</option>
              </select>
              <div v-else class="new-fund-input">
                <input 
                  v-model="form.fundName" 
                  type="text" 
                  required
                  placeholder="请输入基金名称"
                />
                <button type="button" class="btn-icon" @click="isNewFund = false">
                  <span class="material-icons">取消</span>
                </button>
              </div>
            </div>
          </div>

          <div class="form-grid">
            <!-- 价格部分 -->
            <div class="form-group">
              <label>当前价格</label>
              <div class="input-with-prefix">
                <span class="prefix">¥</span>
                <input 
                  v-model.number="form.price" 
                  type="number" 
                  step="0.0001"
                  required
                  placeholder="0.00"
                >
              </div>
            </div>

            <!-- 买入明细部分 -->
            <div class="form-group">
              <label>买入金额</label>
              <div class="input-with-prefix">
                <span class="prefix">¥</span>
                <input 
                  v-model.number="form.amount" 
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00"
                  @input="calculateShares"
                >
              </div>
            </div>

            <div class="form-group">
              <label>手续费</label>
              <div class="input-with-prefix">
                <span class="prefix">¥</span>
                <input 
                  v-model.number="form.fee" 
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00"
                  @input="calculateShares"
                >
              </div>
            </div>

            <div class="form-group">
              <label>份额</label>
              <div class="calculated-field">
                <span>{{ calculatedShares || '0.00' }}</span>
                <small>自动计算</small>
              </div>
            </div>
          </div>

          <div class="dialog-footer">
            <button type="button" class="btn-text" @click="showDialog = false">取消</button>
            <button type="submit" class="btn-primary">确认</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'

defineProps({
  funds: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['add'])

const showDialog = ref(false)
const isNewFund = ref(false)
const selectedFund = ref('')

const form = ref({
  fundName: '',
  price: '',
  amount: '',
  fee: '',
})

const calculatedShares = computed(() => {
  if (!form.value.amount || !form.value.price || !form.value.fee) return ''
  const actualAmount = form.value.amount - form.value.fee
  return (actualAmount / form.value.price).toFixed(2)
})

function handleFundSelect(event) {
  if (event.target.value === 'new') {
    isNewFund.value = true
    selectedFund.value = ''
  }
}

function calculateShares() {
  // 触发计算属性更新
  form.value = { ...form.value }
}

function resetForm() {
  form.value = {
    fundName: '',
    price: '',
    amount: '',
    fee: '',
  }
  selectedFund.value = ''
  isNewFund.value = false
}

function handleSubmit() {
  const fundName = isNewFund.value ? form.value.fundName : selectedFund.value
  
  if (isNewFund.value) {
    // 新增基金
    emit('add', {
      type: 'new',
      fund: {
        name: fundName,
        currentPrice: form.value.price,
        profit: 0,
        totalCost: form.value.amount,
        fundRecords: [{
          date: new Date().toISOString().split('T')[0],
          amount: form.value.amount,
          price: form.value.price,
          fee: form.value.fee,
          shares: calculatedShares.value,
          rate: 0,
          profit: 0,
          days: 0
        }]
      }
    })
  } else {
    // 添加交易记录
    emit('add', {
      type: 'record',
      fundName: fundName,
      record: {
        date: new Date().toISOString().split('T')[0],
        amount: form.value.amount,
        price: form.value.price,
        fee: form.value.fee,
        shares: calculatedShares.value,
        rate: 0,
        profit: 0,
        days: 0
      }
    })
  }

  resetForm()
  showDialog.value = false
}
</script>

<style scoped>
.add-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #FF4081;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  position: relative;
  z-index: 998;
  border: 2px solid white;
}

.add-button:hover {
  transform: scale(1.1);
  background: #F50057;
}

.add-icon {
  font-size: 28px;
  color: white;
  font-weight: normal;
  line-height: 1;
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
  width: 480px;
  max-width: 90%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  animation: slideUp 0.3s ease;
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

form {
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.input-with-prefix {
  position: relative;
  display: flex;
  align-items: center;
}

.prefix {
  position: absolute;
  left: 12px;
  color: #999;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 10px 12px 10px 28px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.new-fund-input {
  display: flex;
  gap: 8px;
}

.btn-icon {
  padding: 0;
  width: 80px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-icon:hover {
  background: #e0e0e0;
}

.calculated-field {
  background: #f8f9fa;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px dashed #e0e0e0;
  display: flex;
  flex-direction: column;
}

.calculated-field span {
  font-size: 14px;
  color: #333;
}

.calculated-field small {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.btn-text {
  padding: 10px 20px;
  border: none;
  background: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
}

.btn-text:hover {
  background: #f5f5f5;
}

.btn-primary {
  padding: 10px 24px;
  border: none;
  background: #2196f3;
  color: white;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #1976d2;
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}
</style> 