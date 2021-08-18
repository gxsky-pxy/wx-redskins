// app.js

import { doLogin } from "./api/login"
App({
  onLaunch() {
    this.login();
    // 登录
  },

  async login() {
    const check = await this.checkSession();
    if(check){
      // doLogin();
      this.globalData.token = wx.getStorageSync('token');
    }else{
      console.log('报错了');
    }
  },
  async checkSession() {
    return new Promise(resolve => {
      wx.checkSession({
        success () {
          //session_key 未过期，并且在本生命周期一直有效
          resolve(true)
        },
        fail () {
          // session_key 已经失效，需要重新执行登录流程
          // doLogin();
        }
      })
    })

  },
  globalData: {
    userInfo: null,
    // baseUrl:'http://192.168.2.15:26088/'
    baseUrl:'http://test.social.gxidt.cn/test-api/'
  }
})
