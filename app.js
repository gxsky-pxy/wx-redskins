// app.js
import { doLogin } from "./api/login"
App({
  onLaunch() {
    const accountInfo = wx.getAccountInfoSync();
    switch (accountInfo.miniProgram.envVersion) {
      case 'develop':
        this.globalData.baseUrl = 'https://test.social.gxidt.cn/test-api/'; //开发
        break;
      case 'trial':
        this.globalData.baseUrl = 'https://test.social.gxidt.cn/test-api/';//体验
        break;
      case 'release':
        this.globalData.baseUrl = 'http://test.social.gxidt.cn/test-api/';//正式
        break;
      default:
        this.globalData.baseUrl = 'https://test.social.gxidt.cn/test-api/';
        break;
    }
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
          doLogin();
        }
      })
    })

  },
  globalData: {
    userInfo: null,
    // baseUrl:'http://192.168.2.15:18082/'
    baseUrl:'https://test.social.gxidt.cn/test-api/'
  }
})
