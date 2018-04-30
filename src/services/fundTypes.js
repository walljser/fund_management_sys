import {
  API
} from '@/config'
import axios from 'axios'

/**
 * [获取基金类型信息]
 * @param  {[type]} token [description]
 * @return {[type]}       [description]
 */
const get = async () => {
  return await axios.get(`${API}/admin/adminGetFundType.action`)
}

const remove = async ({adminId, typeId, token}) => {
  return await axios.get(`${API}/admin/adminDeleteFundType.action`, {
    params: {
      adminId,
      fundTypeId: typeId,
      token
    }
  })
}

const add = async ({adminId, name, desc, token}) => {
  return await axios.get(`${API}/admin/adminAddFundType`, {
    params: {
      adminId,
      fundTypeName: name,
      fundTypeDescribe: desc,
      token
    }
  })
}

export {
  add,
  get,
  remove
}
