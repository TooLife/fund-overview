<template>
  <div class="dialog-overlay" v-if="show" @click="$emit('close')">
    <div class="dialog-content" @click.stop>
      <h3>新增基金</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>基金名称</label>
          <input 
            v-model="form.name" 
            type="text" 
            required
            placeholder="请输入基金名称"
          >
        </div>
        <div class="form-group">
          <label>当前价格</label>
          <input 
            v-model="form.currentPrice" 
            type="number" 
            step="0.01"
            required
            placeholder="请输入当前价格"
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
  name: '',
  currentPrice: '',
})

function handleSubmit() {
  emit('add', {
    ...form.value,
    profit: 0,
    totalCost: 0,
    fundRecords: []
  })
  form.value = { name: '', currentPrice: '' }
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #2196f3;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.dialog-footer button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-confirm {
  background: #2196f3;
  color: white;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-confirm:hover {
  background: #1976d2;
}
</style> 