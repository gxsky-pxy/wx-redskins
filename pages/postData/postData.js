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
    errorArr: []
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
      wx.requestSubscribeMessage({
        tmplIds: ['H4-R3QZTVCWYK3WIz0Negp4It26dakA4DnjphhElzGY', 'MZoOjXeMI8skcqrNxynB8LdUJvg7MBVqnL7gxBSD2sQ', 'veOaoLD4xQtALnVMjEysZuIZnehQlYyJtzk6QvR3G90'],
        fail: (err) => {
          console.log(err)
        },
        success: (res) => {
          wx.showLoading({
            title: '正在提交',
            mask: true
          });
          this.createOrder(getApp().globalData.userInfo);
        }
      });
    }

  },

  //创建订单Actions
  createOrder(info) {
    this.setData({
      'info.userName': info.nickName
    });
    let obj = {
      serviceId: this.data.info.id,
      userName: this.data.info.userName || '佚名',
      starServiceTemplateBOList: this.data.form
    };

    fly.post('/order/createPrePayStarSocialOrder', Object.assign({
      encryptedData: getApp().globalData.userInfo.encryptedData,
      iv: getApp().globalData.userInfo.iv
    }, obj), { timeout: 60000 }).then(res => {
      wx.hideLoading();
      if(res && res.code){
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: `prepay_id=${res.data.prepay_id}`,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: (res) => {
            wx.redirectTo({
              url: '../result/result?phone=' + this.data.info.phone + '&result=success'
            });
          },
          fail: (err) => {
            console.log('报错了', err);
            wx.redirectTo({
              url: '../result/result?phone=' + this.data.info.phone + '&result=fail'
            });
          }
        });
      }else{
        wx.showToast({
          title: '提交订单出错,请稍后重试',
          icon:'none'
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.log('报错', err);
      wx.redirectTo({
        url: '../result/result?phone=' + this.data.info.phone + '&result=error'
      });
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
      switch (item.fieldType) {
        case 2:
          rules.date = true;
          break;
        case 3:
          rules.idcard = true;
          break;
        case 4:
          rules.number = true;
          //rules.tel = true;
          rules.minlength = 5;
          rules.maxlength = 20;
          break;
        case 5:
          rules.number = true;
          rules.minlength = 1;
          rules.maxlength = 20;
          break;
        default:
          rules.minlength = 1;
          rules.maxlength = 100;
          break;
      }

      if (!checkParam('fieldValue', rules, item)) {
        err[index] = `请填写正确格式的${item.fieldName}`;
        rules.minlength && rules.maxlength && (err[index] = `${err[index]},长度(${rules.minlength}-${rules.maxlength})`);
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
      success(res) {
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