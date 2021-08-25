// pages/payment/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:null
  },

    //联系
    callEveryone(e) {
      let phone = e.currentTarget.dataset.phone;
      wx.showModal({
        title: '联系客服',
        content: `是否要拨打电话 ${phone}`,
        success (res) {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: phone
            });
          }
        }
      })
    },

  toBuy(){
    if(getApp().globalData.userInfo){
      this.toPostData();
    }else{
      wx.getUserProfile({
        desc: '用于创建订单', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          getApp().globalData.userInfo = res.userInfo;
          this.toPostData();
        }
      });
    }
  },
  //跳转到下单页
  toPostData(){
    wx.redirectTo({
      url: '../postData/postData?id='+this.data.info.id +'&title='+this.data.info.serviceName
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.info){
      this.setData({
        info:JSON.parse(options.info)
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})