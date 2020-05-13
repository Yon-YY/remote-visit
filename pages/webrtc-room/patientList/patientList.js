//获取应用实例
const app = getApp();
const api = require('../../../utils/api');

Page({
  data: {
    patientList: [],
    userId: ''
  },
  getStorageData: function() {
    var self = this;
    wx.getStorage({
      key: 'userId',
      success(res) {
        var userId = res.data;
        var apiUrl = app.globalData.rtcUrl,
          requestParams = {
            'userId': userId
          };
        // 域名、接口、请求参数(可为空)、请求类型、请求头
        api.getData(apiUrl, '/api/bind/getAllPatients', requestParams, 'POST').then((res) => {
          console.log(res)
          self.setData({
            patientList: res.data,
            userId: userId
          });
        });
      }
    });
  },
  addPatient: function() {
    wx.navigateTo({
      url: '../main/main'
    });
  },
  patientOperation: function(e) {
    var self = this,
      index = e.currentTarget.dataset.index,
      patientData = self.data.patientList[index],
      userId = self.data.userId;

    wx.setStorage({
      key: 'patientData',
      data: {
        patientData,
        userId
      }
    });
    wx.navigateTo({
      url: '../relieve/relieve?patientName=' + patientData.patientName
    });
  },
  onLoad: function() {},
  onShow: function() {
    this.getStorageData();
  }
});