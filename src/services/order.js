import {
  API
} from '@/config'
import axios from 'axios'

/**
 * [组合查询用户账单]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const get = async (params) => {
  console.log(params)
  const DEFAULT = {
    trasId: '',
    transType: '',
    clientId: '',
    targetId: '',
    pageNo: 1,
    token: '',
    adminId: ''
  }
  params = Object.assign(DEFAULT, params)
  const {
    transId,
    transType,
    clientId,
    targetId,
    pageNo,
    token,
    adminId
  } = params
  return await axios.get(`${API}/clientTrans/loadBalanceListByHelper.action`, {
    params: {
      adminId,
      transId,
      transType,
      'clientUser.ClientId': clientId,
      targetId,
      pageNo,
      token
    }
  })
}

export {
  get
}
