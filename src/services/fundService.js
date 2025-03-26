const API_BASE_URL = 'http://127.0.0.1:8000/api'

export async function getFunds() {
  try {
    const response = await fetch(`${API_BASE_URL}/funds/overview`)
    if (!response.ok) {
      throw new Error('获取基金列表失败')
    }
    return await response.json()
  } catch (error) {
    console.error('API 调用错误:', error)
    throw error
  }
}

export async function getFundEstimate(fundCode) {
  try {
    const response = await fetch(`${API_BASE_URL}/funds/${fundCode}/estimate`)
    if (!response.ok) {
      throw new Error('获取基金估值失败')
    }
    return await response.json()
  } catch (error) {
    console.error('API 调用错误:', error)
    throw error
  }
}

export async function addFund(fundData) {
  try {
    const response = await fetch(`${API_BASE_URL}/funds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fundData)
    })
    if (!response.ok) {
      throw new Error('添加基金失败')
    }
    return await response.json()
  } catch (error) {
    console.error('API 调用错误:', error)
    throw error
  }
}

export async function addFundRecord(fundCode, recordData) {
  try {
    const response = await fetch(`${API_BASE_URL}/funds/${fundCode}/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recordData)
    })
    if (!response.ok) {
      throw new Error('添加交易记录失败')
    }
    return await response.json()
  } catch (error) {
    console.error('API 调用错误:', error)
    throw error
  }
} 