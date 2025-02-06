<template>
  <div class="dialog-overlay" v-if="show" @click="$emit('close')">
    <div class="dialog-content" @click.stop>
      <h3>新增交易记录</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>买入日期</label>
          <input 
            v-model="form.date" 
            type="date" 
            required
          >
        </div>
        <div class="form-group">
          <label>买入金额</label>
          <input 
            v-model="form.amount" 
            type="number"
            step="0.01"
            required
            placeholder="请输入买入金额"
          >
        </div>
        <div class="form-group">
          <label>买入价格</label>
          <input 
            v-model="form.price" 
            type="number"
            step="0.01"
            required
            placeholder="请输入买入价格"
          >
        </div>
        <div class="dialog-footer">
          <button type="button" class="btn-cancel" @click="$emit('close')">取消</button>
          <button type="submit" class="btn-confirm">确认</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'add'])

const form = ref({
  date: '',
  amount: '',
  price: ''
})

function handleSubmit() {
  const shares = Number(form.value.amount) / Number(form.value.price)
  emit('add', {
    ...form.value,
    shares: shares.toFixed(2),
    rate: 0,
    profit: 0,
    days: 0
  })
  form.value = { date: '', amount: '', price: '' }
}
</script>

<style scoped>
/* 使用与 AddFundDialog 相同的样式 */
</style> 