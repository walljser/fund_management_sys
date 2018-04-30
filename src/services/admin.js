import { API } from '@/config'
import axios from 'axios'

const get = async (username, password) => {
  const res = await axios.get(`${API}/admin/adminLogin.action`, {
    params: {
      userNo: username,
      userPwd: password
    }
  })
  return res
}

export {
  get
}
