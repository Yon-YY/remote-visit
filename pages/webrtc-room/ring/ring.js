//获取应用实例
const app = getApp();
const api = require('../../../utils/api');

Page({
  data: {
    familyBindPatientId: '',
    userId: '',
    connectAttemptId: '',
    attemptResult: '',
    timer: null
  },
  // 轮询方法
  polling: function() {
    var self = this,
      pollingApiUrl = app.globalData.rtcUrl,
      pollingParams = {
        'connectAttemptId': self.data.connectAttemptId
      }
    // 清除定时器
    var counter = 0;
    self.data.timer = setInterval(() => {
      api.getData(pollingApiUrl, '/api/connect/polling', pollingParams, 'POST').then((res) => {
        console.log(res);
        if (counter === 20) {
          wx.showToast({
            title: '对方无人接听',
            icon: 'none',
            duration: 3000
          })
          clearInterval(self.data.timer);
          return;
        }
        // 清除定时器
        if (res.data.attemptResult === 1) {
          clearInterval(self.data.timer);
          wx.navigateTo({
            url: '../room/room?userId=' + res.data.userId + '&roomId=' + res.data.roomCode + '&userSig=' + res.data.userSig
          })
        } else if (res.data.attemptResult === 2) {
          wx.showToast({
            title: res.data.attemptResultText,
            icon: 'none',
            duration: 3000
          })
        } else {
          wx.showToast({
            title: res.data.attemptResultText,
            icon: 'none',
            duration: 3000
          })
          clearInterval(self.data.timer);
        }
        counter++;
      })
    }, 3000);
  },
  disconnect: function() {
    var apiUrl = app.globalData.rtcUrl,
      requestParams = {
        "attemptResult": 6,
        "connectAttemptId": this.data.connectAttemptId
      };
    // 域名、接口、请求参数(可为空)、请求类型、请求头
    api.getData(apiUrl, '/api/connect/feedback', requestParams, 'POST').then((res) => {
      // console.log(res);
      wx.navigateBack({
        delta: 1
      })
    });
    clearInterval(this.data.timer);
  },
  onLoad: function(options) {
    var self = this;
    wx.getStorage({
      key: 'patientData',
      success(res) {
        self.setData({
          familyBindPatientId: res.data.patientData.familyBindPatientId,
          userId: res.data.userId
        });
      }
    });
    self.setData({
      connectAttemptId: options.connectAttemptId
    })
    this.polling();
  },
  onUnload: function() {
    clearInterval(this.data.timer);
  }
});