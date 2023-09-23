import { ref } from 'vue'
import axios from 'axios'

export default function useAxios() {
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)

  const fetchData = async (url, token) => {
    //console.log('Token:', token) 
    loading.value = true
    error.value = null
    data.value = null

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      data.value = response.data
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  const postData = async (url, payload, token) => {
    //console.log('Token:', token)
    loading.value = true
    error.value = null
    data.value = null

    try {
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      data.value = response.data

    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    data,
    fetchData,
    postData,

  }
}
