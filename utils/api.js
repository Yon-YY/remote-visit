// 域名
// export const API_URL = 'http://192.168.100.34:8090';
// export const API_URL = 'http://192.168.1.160';
// 域名、接口、请求参数、请求类型、请求头
function obtainApi(apiUrl, interfaceUrl, params, method, headers) {
  const API_URL = apiUrl;
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_URL}${interfaceUrl}`,
      data: params || null,
      method: method || 'GET',
      header: {
        'content-type': headers || 'application/json;charset=UTF-8'
      },
      success: resolve,
      fail: reject
    });
  });
}
/** 
 * 参数加密请求
 * 域名、接口、请求参数、请求类型、请求头
**/
function encryptionObtainApi(apiUrl, interfaceUrl, params, method, headers, checkSum) {
  const API_URL = apiUrl;
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_URL}${interfaceUrl}`,
      data: params || null,
      method: method || 'GET',
      header: {
        'content-type': headers || 'application/json;charset=UTF-8',
        'checkSum': checkSum || null,
        'isEncrypt': 'true'
      },
      success: resolve,
      fail: reject
    });
  });
}
module.exports = {
  encryptionGetData: function(apiUrl, interfaceUrl, data, method, headers, checkSum) {
    return encryptionObtainApi(apiUrl, interfaceUrl, data, method, headers, checkSum).then(res => res.data);
  },
  getData: function (apiUrl, interfaceUrl, data, method, headers) {
    return obtainApi(apiUrl, interfaceUrl, data, method, headers).then(res => res.data);
  }
}