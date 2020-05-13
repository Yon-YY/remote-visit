//获取应用实例
const app = getApp();
const api = require('../../../utils/api');

Page({
  data: {
    hospitalCodeObj: '', // 医院编号空
    hospitalCode: [], // 有值的医院编号
    userId: '',
    patientName: '', // 患者姓名
    hospitalizationCode: '', // 住院号
    invitationCode: '', // 邀请码
    tapTime: '',
    template: 'bigsmall' // 模板
  },
  // 医院编号
  getHospitalCode: function(e) {
    var self = this;
    // console.log(e.detail);
    self.setData({
      hospitalCodeObj: e.detail
    });
  },
  // 患者姓名
  bindPatientName: function(e) {
    var self = this;
    self.setData({
      patientName: e.detail.value
    });
  },
  // 住院编号
  bindHospitalizationCode: function(e) {
    var self = this;
    self.setData({
      hospitalizationCode: e.detail.value
    });
  },
  // 邀请码
  bindInvitationCode: function(e) {
    var self = this;
    self.setData({
      invitationCode: e.detail.value
    });
  },

  // 添加
  tapRoom: function() {
    var self = this;
    // 防抖
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    // 医院编号
    if (!self.data.hospitalCodeObj) {
      wx.showToast({
        title: '请选择医院编号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // 姓名
    if (!self.data.patientName) {
      wx.showToast({
        title: '请输入名字',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // 住院号
    if (!self.data.hospitalizationCode) {
      wx.showToast({
        title: '请输入住院号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // 邀请码
    if (!self.data.invitationCode) {
      wx.showToast({
        title: '请输入邀请码',
        icon: 'none',
        duration: 2000
      })
      return
    }

    // 添加探视人
    var apiUrl = app.globalData.rtcUrl,
      requestParams = {
        'hospitalId': self.data.hospitalCodeObj.val,
        'patientName': self.data.patientName,
        'hospitalizedCode': self.data.hospitalizationCode,
        'inviteCode': self.data.invitationCode,
        'userId': self.data.userId
      };
    // 域名、接口、请求参数(可为空)、请求类型、请求头
    api.getData(apiUrl, '/api/bind/bindPatient', requestParams, 'POST').then((res) => {
      // console.log(res);
      wx.navigateTo({
        url: '../patientList/patientList'
      });
    });

    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 3000
    })

    self.setData({
      'tapTime': nowTime
    });
  },
  onLoad: function() {
    var self = this;
    // 获取医院编号相关信息
    var apiUrl = app.globalData.zhaohuUrl;
    // 域名、接口、请求参数(可为空)、请求类型、请求头
    api.getData(apiUrl, '/hospital/queryAllRtcHospitals', null, 'GET', 'application/x-www-form-urlencoded').then((res) => {
      // console.log(res);
      var jsonData = res.data;
      var newArr = jsonData.map((item) => {
        return {
          "id": item.index,
          "val": item.hospitalId,
          "text": item.hospitalFullName
        }
      });
      self.setData({
        hospitalCode: newArr
      });
    });

    // 获取userId
    wx.getStorage({
      key: 'userId',
      success(res) {
        self.setData({
          userId: res.data
        });
      }
    });
  }
});