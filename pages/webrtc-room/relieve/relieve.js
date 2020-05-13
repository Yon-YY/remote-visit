//获取应用实例
const app = getApp();
const api = require('../../../utils/api');

Page({
  data: {
    familyBindPatientId: '',
    userId: '',
    patientName: ''
  },
  // 探视通话
  visit: function() {
    var self = this,
      visitApiUrl = app.globalData.rtcUrl,
      visitParams = {
        'familyBindPatientId': self.data.familyBindPatientId,
        'userId': self.data.userId
      };
    api.getData(visitApiUrl, '/api/connect/attempt', visitParams, 'POST').then((res) => {
      if (res.code === "400") {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
      wx.navigateTo({
        url: '../ring/ring?connectAttemptId=' + res.data
      })
    });
  },
  // 解除解绑弹框
  relieve: function() {
    var self = this;
    // 调用layer组件的open方法
    this.layer.open();
  },
  // 解除解绑
  onSuccess: function() {
    var self = this;
    var apiUrl = app.globalData.rtcUrl,
      requestParams = {
        'familyBindPatientId': self.data.familyBindPatientId,
        'userId': self.data.userId,
      };
    // 域名、接口、请求参数(可为空)、请求类型、请求头
    api.getData(apiUrl, '/api/bind/unbindPatient', requestParams, 'POST').then((res) => {
      // console.log(res);
      // 解绑成功返回列表
      wx.navigateTo({
        url: '../patientList/patientList'
      });
    });
  },
  onLoad: function(options) {
    var self = this;
    self.setData({
      patientName: options.patientName
    });
    wx.getStorage({
      key: 'patientData',
      success(res) {
        self.setData({
          familyBindPatientId: res.data.patientData.familyBindPatientId,
          userId: res.data.userId
        });
      }
    });
  },
  onReady: function() {
    // 获取layer组件
    this.layer = this.selectComponent('#layer');
  }
});