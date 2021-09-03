// pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:0,
    status:'success'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.phone){
      this.setData({
        phone:options.phone,
        status:options.result
      });
    }
  },
  goIndex() {
    wx.switchTab({
      url: '../index/index',
    });
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