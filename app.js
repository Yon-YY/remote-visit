const api = require('./utils/api');
const CryptoJS = require('./utils/tripledes');
const DES = require('./utils/encryptDES');

App({
  onLaunch: function(options) {
    var self = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.globalData.isAuthorized = true;
          wx.getUserInfo({
            success: res => {
              wx.redirectTo({
                url: '../patientList/patientList'
              });
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var apiUrl = this.globalData.zhaohuUrl,
          requestParams = {
            'code': res.code
          };

        requestParams = DES.encryptByDES(JSON.stringify(requestParams), 'Kbs3.0&!', 'Kbs3.0&!');
        var checkSumStr = CryptoJS.MD5(requestParams).toString();

        // 域名、接口、请求参数(可为空)、请求类型、请求头、checkSum
        api.encryptionGetData(apiUrl, '/WxMiniProgram/code2Session', requestParams, 'POST', 'application/json;charset=UTF-8', checkSumStr).then((res) => {
          // 本地存储发送 res.code 到后台返回的数据
          wx.setStorage({
            key: 'userId',
            data: res.data.userId
          });
        });
      }
    });
  },
  globalData: {
    userInfo: null,
    // rtcUrl: "http://192.168.100.22:8090",
    // zhaohuUrl: "http://192.168.100.107:8055",
    rtcUrl: "http://rtc.kangdoctor.cn",
    zhaohuUrl: "http://zhaohuv2.kangdoctor.cn",
    // zhaohuUrl: "http://192.168.100.34:8080",
    isAuthorized: false
  }
})