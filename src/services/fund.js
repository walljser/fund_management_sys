import { API } from '@/config'
import axios from 'axios'

const add = async ({ name, desc, date }, { adminId, typeId, token }) => {
  token = token.replace(/\"/g, "")
  const res = await axios.get(`${API}/admin/adminFundAdd.action`, {
    params: {
      adminId,
      'fund.FundName': name,
      'fund.fundType.fundTypeId': typeId,
      'fund.FundDescribe': desc,
      'fund.date': date,
      'token': token
    }
  })
  return res
}

const test = async (pageNumber = 1) => {
  const res = await axios.get(`${API}/admin/adminLoadFund.action`, {
    params: {
      fundPageNo: pageNumber
    }
  })
  return res
}

/**
 * [组合查询获取基金列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const get = async (params) => {
  const DEAFULT = {
    fundId: '',
    fundName: '',
    status: '',
    typeId: '',
    currentPage: 5
  }
  params = Object.assign(DEAFULT, params)
  const {
    fundId,
    fundName,
    status,
    typeId,
    currentPage
  } = params
  return await axios.get(`${API}/admin/lookFundByHelper.action`, {
    params: {
      qryFundNo: fundId,
      qryFundName: fundName,
      qryfundTypeId: typeId,
      qryFundStatus: status,
      fundPageNo: currentPage
    }
  })
}

const remove = async ({adminId, fundNo, token }) =>{
  return await axios.get(`${API}/admin/adminDeleteFund.action`, {
    params: {
      adminId,
      'fund.FundNo': fundNo,
      token
    }
  })
}

/**
 * [批量删除]
 * @param  {[type]} fundNos [基金号列表]
 * @param  {[type]} token   [token]
 * @return {[type]}         [description]
 */
const batchRemove = async ({adminId, fundNos, token}) => {
  return await axios.get(`${API}/admin/adminBatchDelete.action`, {
    params: {
      adminId,
      fundNoArr: fundNos,
      token
    }
  })
}

const update = async ({ id, name, status, desc }, {adminId, typeId, token}) => {
  console.log('token: ' + token)
  console.log(typeof id)
  return await axios.get(`${API}/admin/adminUpdateFund.action`, {
    params: {
      adminId,
      'fund.FundNo': id,
      'fund.FundName': name,
      'fund.FundStatus': status,
      'fund.FundDescribe': desc,
      'fund.fundType.fundTypeId': typeId,
      token
    }
  })
}

/**
 * [修改基金状态]
 * @param  {[type]} options.adminId    [description]
 * @param  {[type]} options.fundId     [description]
 * @param  {[type]} options.fundStatus [description]
 * @return {[type]}                    [description]
 */
const modifyStatus = async ({ adminId, fundId, fundStatus, token}) => {
  console.log(111)
  return await axios.get(`${API}/admin/adminModifyFundStatus.action`, {
    params: {
      adminId,
      'fund.FundNo': fundId,
      fundStatus,
      token
    }
  })
}


export {
  add,
  get,
  remove,
  update,
  batchRemove,
  modifyStatus
}
