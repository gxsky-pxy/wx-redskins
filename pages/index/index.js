// index.js
// 获取应用实例
const app = getApp()
import fly from "../../api/config"
Page({
  data: {
    background: [],
    grids:[]
  },
  toDetail(e){
    wx.navigateTo({
      url: '../payment/index?info='+JSON.stringify(e.currentTarget.dataset.info)
    });
  },
  //轮播图
  getChart(){
    return new Promise(resolve => {
    fly.get('chart/findRotationList').then(res => {
        if(res.data){
          resolve(res.data.length>0?res.data.map(m => m.rotationChart):[]);
        }
    });
    });
  },
  //cell菜单内容
  getService(){
    return new Promise(resolve => {
        fly.post('service/selectStarSocialServiceList',{starSocialServiceQuery:{}}).then(res => {
          resolve(res?res.rows:[]);
        });
    });
  },
  onLoad() {
    wx.showLoading({
      title: '加载中',
      mask:true
    });
    fly.all([this.getChart(),this.getService()]).then(res => {
      wx.hideLoading();
      this.setData({
        background:res[0]||[],
        grids:res[1]||[]
      })
    });


  }
})
