import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 600000, // 10 minutes timeout for long-running requests
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }
    throw new Error(error.message || 'An unexpected error occurred')
  }
)

export const summarizeVideo = async (url) => {
  const response = await api.post('/video/summarize', { url })
  return response.data
}

export const analyzeChannel = async (url) => {
  const response = await api.post('/channel/analyze', { url })
  return response.data
}

export const getJobStatus = async (jobId, type) => {
  const endpoint = type === 'video' ? '/video/status' : '/channel/status'
  const response = await api.get(`${endpoint}/${jobId}`)
  return response.data
}

export default api