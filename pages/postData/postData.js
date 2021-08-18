// pages/postData/postData.js
import fly from "../../api/config"
import { checkParam } from '../../utils/validate.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: '../../assets/img/book.png',
    currentInput: 0,
    info: {},
    form: [],
    userName: '',
    phone: '',
    idCard: '',
    errorArr: [],
    paySuccess: false
  },


  bindInput(e) {
    var dataset = e.currentTarget.dataset;
    let index = this.data.form.findIndex(f => f.fieldId == dataset.id);
    // 拼接对象属性名，用于为对象属性赋值
    var attributeName = 'form[' + index + '].fieldValue';
    this.setData({
      [attributeName]: e.detail.value
    });
  },

  bindDateChange: function (e) {
    var dataset = e.currentTarget.dataset;
    let index = this.data.form.findIndex(f => f.fieldId == dataset.id);
    var attributeName = 'form[' + index + '].fieldValue';
    this.setData({
      [attributeName]: e.detail.value.replace(/-/g, '/')
    });
  },

  bindFocus(e) {
    this.setData({
      currentInput: e.currentTarget.dataset.id
    });
  },
  bindBlur() {
    this.setData({
      currentInput: 0
    });
  },
  //提交订单
  postCard() {
    if (this.initValidate()) {
      wx.showLoading({
        title: '正在提交',
        mask: true
      });
      if(getApp().globalData.userInfo){
        this.createOrder(getApp().globalData.userInfo);
      }else{
        wx.getUserProfile({
          desc: '用于创建订单', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          fail:() => {
            wx.hideLoading();
          },
          success: (res) => {
            getApp().globalData.userInfo = res.userInfo;
            this.createOrder(res.userInfo);
          }
        });
      }
    }

  },
  //创建订单Actions
  createOrder(userInfo){
    this.setData({
      'info.userName': userInfo.nickName
    });
    let obj = {
      serviceId: this.data.info.id,
      userName: this.data.info.userName || '佚名',
      starServiceTemplateBOList: this.data.form
    };
    fly.post('/order/createStarSocialOrder', obj).then(res => {
      res.code && this.setData({ paySuccess: true });
    }).finally(() => {
      wx.hideLoading();
    });
  },
  goIndex() {
    wx.switchTab({
      url: '../index/index',
    });
  },

  //验证函数
  initValidate() {
    let err = [];
    this.data.form.forEach((item, index) => {
      let rules = { required: true };
      item.fieldType == 2 && (rules.date = true);
      item.fieldType == 3 && (rules.idcard = true);
      item.fieldType == 4 && (rules.tel = true);
      item.fieldType == 5 && (rules.number = true);
      if (!checkParam('fieldValue', rules, item)) {
        err[index] = `请填写正确格式的${item.fieldName}`;
      }
    });
    this.setData({
      errorArr: err
    });
    return err.length == 0;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      wx.setNavigationBarTitle({ title: options.title });
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      fly.post('/service/template/selectStarSocialServiceDetailById/' + options.id).then(res => {
        wx.hideLoading();
        if (res.data) {
          this.setData({
            info: {
              price: res.data.servicePrice,
              phone: res.data.servicePhone,
              id: options.id
            },
            form: res.data.starServiceTemplateBOList
          });
        }
      });
    }
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