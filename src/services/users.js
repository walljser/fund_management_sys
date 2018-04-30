import { API } from '@/config'
import axios from 'axios'


/**
 * [组合查询客户信息列表]
 * @param  {[type]} options.adminId [description]
 * @param  {[type]} options.token   [description]
 * @return {[type]}                 [description]
 */
// { adminId, clientId, clientName, sex , token }
const get = async (params) => {
  const DEFAULT = {
    adminId: '',
    clientId: '',
    clientName: '',
    sex: '',
    status: '',
    token: '',
    pageNo: ''
  }
  params = Object.assign(DEFAULT, params)
  const {
    adminId,
    clientId,
    clientName,
    sex,
    status,
    token,
    pageNo
  } = params
  return await axios.get(`${API}/admin/allClient.action`, {
    params: {
      adminId,
      qryClientId: clientId,
      qryClientName: clientName,
      qryClientSex: sex,
      qryClientActive: status,
      fundPageNo: pageNo,
      token
    }
  })
}


const update = async({clientId, active, adminId, token}) => {
  return await axios.get(`${API}/admin/adminFrozenOrThawClient.action`, {
    params: {
      adminId,
      clientId,
      active,
      token
    }
  })
}

export {
  get,
  update
}
