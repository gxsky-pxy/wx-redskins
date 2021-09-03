// pages/orderList/orderlist.js
import fly from "../../api/config"
const createRecycleContext = require('miniprogram-recycle-view')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    length: 0,
    //停止下拉刷新
    stopPull: true,
    height: 667,
    loading: true,
    queryParams: {
      pageNum: 1,
      pageSize: 10
    },
    _postflg: true,//是否可以加载列表，用户误触控制
    ctx: null,
    total: 0,
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var than = this;
    wx.getSystemInfo({
      success: function (res) {
        than.setData({ height: res.windowHeight });
        //创建RecycleContext对象来管理 recycle-view 定义的的数据
        than.ctx = createRecycleContext({
          id: 'recycleId',
          dataKey: 'orderList',
          page: than,
          itemSize: {
            height: 200,//215
            width: res.windowWidth - 32
          }
        })
        than.getOrderList();//请求接口
      },
    });
  },

  //滚动到底部监听，分页加载
  bindscrolltolower(e) {
    if (!this.data.stopPull && this.data._postflg && this.ctx.getList().length < this.data.total) {
      this.setData({
        loading: true
      });
      this.data.queryParams.pageNum = this.data.queryParams.pageNum + 1;
      this.data._postflg = false;
      this.getOrderList();
    }
  },

  getOrderList() {
    fly.post('order/selectStarSocialMyOrderList', this.data.queryParams).then(res => {
      if (res) {
        if (this.data.stopPull) {
          this.ctx.splice(0, this.ctx.getList().length, res.rows);
        } else {
          this.ctx.append(res.rows);
        }
        let obj = {
          length: this.ctx.getList().length,
          loading: false
        };
        this.data.stopPull && (obj.stopPull = false);
        this.setData(obj);

        this.data._postflg = true;
        this.data.total = res.total;
      }
    });
  },
  //recycleView下拉重新加载
  _refresherrefresh() {
    if (!this.data.loading) {
      this.setData({
        stopPull: true
      });
      this.data.queryParams.pageNum = 1;
      this.getOrderList();
    } else {
      this.setData({
        stopPull: false
      });
    }
  },
  //联系
  callEveryone(e) {
    let phone = e.currentTarget.dataset.phone;
    wx.showModal({
      title: '提示',
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

  //立即支付
  signOrder(e){
    wx.showLoading({
      title: '正在提交',
      mask: true
    });
    let item = e.currentTarget.dataset.item,index = e.currentTarget.dataset.index;
    fly.post('/order/getOrderPaySign',{id:item.id}).then(res => {
      wx.hideLoading();
      if(res && res.code == 200){
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: `prepay_id=${res.data.prepay_id}`,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: (res) => {
            let obj = Object.assign({},item,{
              payStatus:1,
              status:0,
              statusName:'待处理'
            });
            this.ctx.splice(index, 1, [obj]);
          },
          fail: (err) => {
            console.log('报错了', err);
            wx.showToast({
              title: '支付失败',
              icon:'none'
            });
          }
        });
      }else{
        wx.showToast({
          title: '发起支付失败，请稍后重试',
          icon:'none'
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.log('报错', err);
    });
  },

  //取消订单
  cancelOrder(e){
    wx.showModal({
      title: '取消订单',
      content: '真的不再考虑一下吗？',
      success :(res) => {
        if (res.confirm) {
          let item = e.currentTarget.dataset.item,index = e.currentTarget.dataset.index;
          wx.showLoading({
            title: '正在提交',
            mask: true
          });
          fly.post('/order/closeOrder',{id:item.id}).then(res => {
            wx.hideLoading();
            if(res && res.code == 200){
              if((res.data == 'OK') || (res.data == 'PAYSUCCESS')){ //OK-退单成功 ，PAYSUCCESS - 订单已支付不允许退单
                let obj = Object.assign({},item,{
                  payStatus:res.data == 'OK'?3:1,
                  status:res.data == 'OK'?2:0,
                  statusName:res.data == 'OK'?'已取消':'待处理'
                });
                this.ctx.splice(index, 1, [obj]);
              }else{
                wx.showToast({
                  title: res.data == 'NOORDER'?'查询不到订单信息，请刷新':'操作失败，请稍后重试',
                  icon:'none'
                });
              }
            }
          }).catch(err => {
            wx.hideLoading();
            console.log('报错', err);
          });
        }
      }
    });
  },

  //倒计时结束关闭订单
  finishDate(e){
    let item = e.currentTarget.dataset.item,index = e.currentTarget.dataset.index;
    let obj = Object.assign({},item,{
      payStatus:3,
      status:2,
      statusName:'已取消'
    });
    this.ctx.splice(index, 1, [obj]);
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