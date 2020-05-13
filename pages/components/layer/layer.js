Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 弹框标题
    title: {
      type: String,
      value: ''
    },
    // 弹框内容
    content: {
      type: String,
      value: ''
    },
    // 是否显示取消按钮
    showCancel: {
      type: Boolean,
      value: true
    },
    // 确认按钮文本
    confirmText: {
      type: String,
      value: '确定'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: true
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close: function() {
      this.setData({
        isShow: !this.data.isShow
      });
    },
    open: function() {
      this.setData({
        isShow: !this.data.isShow
      });
    },
    Success: function(e) {
      var myEventDetail = e // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('Success', myEventDetail, myEventOption)
      this.close();
    },
    Cancel: function(e) {
      var myEventDetail = e // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('Cancel', myEventDetail, myEventOption)
      this.close();
    }
  }
})