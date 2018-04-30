import {
  API
} from '@/config'
import axios from 'axios'

const get = async (fundId) => {
  return await axios.get(`${API}/fundtrans/loadRateRecord.action`, {
    params: {
      fundId
    }
  })
}

export {
  get
}
