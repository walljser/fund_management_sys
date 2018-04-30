import {
  API
} from '@/config'
import axios from 'axios'

/**
 * [获取广告列表]
 * @return {[type]} [description]
 */
const get = async () => {
  return await axios.get(`${API}/admin/adminLoadFeature.action`)
}

/**
 * [添加新广告]
 * @param  {[type]} options.title [description]
 * @param  {[type]} options.info1 [description]
 * @param  {[type]} options.info2 [description]
 * @param  {[type]} options.info3 [description]
 * @param  {[type]} token         [description]
 * @return {[type]}               [description]
 */
const add = async ({ title, info1, info2, info3 }, {adminId, token}) => {
  return await axios.get(`${API}/admin/adminAddFeature.action`, {
    params: {
      adminId,
      'featureTitle': title,
      'featureDescribe': info1,
      'featureInfo': info2,
      'featureInfo2': info3,
      token
    }
  })
}

/**
 * [删除广告]
 * @param  {[type]} featureId [description]
 * @param  {[type]} token     [description]
 * @return {[type]}           [description]
 */
const remove = async ({adminId, featureId, token}) => {
  return await axios.get(`${API}/admin/adminDeleteFeature.action`, {
    params: {
      adminId,
      featureId,
      token
    }
  })
}

/**
 * [修改广告]
 * @param  {[type]} options.id    [description]
 * @param  {[type]} options.title [description]
 * @param  {[type]} options.info1 [description]
 * @param  {[type]} options.info2 [description]
 * @param  {[type]} options.info3 [description]
 * @param  {[type]} token         [description]
 * @return {[type]}               [description]
 */
const update = async ({ id, title, info1, info2, info3 }, {adminId, token}) => {
  return await axios.get(`${API}/admin/adminUpdateFeature.action`, {
    params: {
      adminId,
      featureId: id,
      featureTitle: title,
      featureDescribe: info1,
      featureInfo: info2,
      featureInfo2: info3,
      token
    }
  })
}

export {
  get,
  add,
  remove,
  update
}
