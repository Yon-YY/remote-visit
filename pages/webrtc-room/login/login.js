//获取应用实例
const app = getApp();

const api = require('../../../utils/api');
const CryptoJS = require('../../../utils/tripledes');
const DES = require('../../../utils/encryptDES');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    getUserInfoFail: false,
    userId: null,
    refuseTips: true
  },
  // 授权弹框
  onSuccess: function(e) {
    app.globalData.isAuthorized = true;
    if (e.detail.detail.userInfo) {
      this.login();
    } else {
      this.openSetting();
    }
  },
  // 登录
  login: function() {
    var self = this;
    wx.login({
      success: function(res) {
        // 获取用户信息
        wx.getUserInfo({
          success: function(res) {
            app.globalData.userInfo = res.userInfo;
            self.setData({
              getUserInfoFail: false,
              userInfo: res.userInfo,
              hasUserInfo: true,
              refuseTips: false
            })
            self.setData({
              userId: wx.getStorageSync("userId")
            });

            //TODO 添加上传用户信息功能
            var apiUrl = app.globalData.zhaohuUrl,
              requestParams = res.userInfo;

            requestParams.userId = self.data.userId;
            requestParams = DES.encryptByDES(JSON.stringify(res.userInfo), 'Kbs3.0&!', 'Kbs3.0&!');
            var checkSumStr = CryptoJS.MD5(requestParams).toString();

            // 域名、接口、请求参数(可为空)、请求类型、请求头、checkSum
            api.encryptionGetData(apiUrl, '/WxMiniProgram/updateUserInfo', requestParams, 'POST', 'application/json;charset=UTF-8', checkSumStr).then((res) => {
              wx.redirectTo({
                url: '../patientList/patientList'
              });
            });
            wx.redirectTo({
              url: '../patientList/patientList'
            });
          },
          fail: function(res) {
            self.setData({
              getUserInfoFail: true
            })
          }
        })
      }
    })
  },
  // encryptByDES: function(message, key, iv) {
  //   var keyHex = CryptoJS.enc.Utf8.parse(key);
  //   var ivHex = CryptoJS.enc.Utf8.parse(iv);
  //   var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
  //     iv: ivHex,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.Pkcs7
  //   });
  //   return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  // },
  //跳转设置页面授权
  openSetting: function() {
    var self = this;
    if (wx.openSetting) {
      wx.openSetting({
        success: function(res) {
          //尝试再次登录
          self.login();
        }
      })
    } else {
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用, 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
      })
    }
  },
  onLoad: function() {
    // 登录初始化
    this.login();
    if (app.globalData.userInfo) {
      wx.redirectTo({
        url: '../patientList/patientList'
      });
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (!this.data.hasUserInfo) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        wx.redirectTo({
          url: '../patientList/patientList'
        });
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          wx.redirectTo({
            url: '../patientList/patientList'
            // url: '../relieve/relieve'
          });
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: res => {
          this.setData({
            getUserInfoFail: true
          })
        }
      })
    }
  }
});