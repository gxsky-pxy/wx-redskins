// var Fly = require("flyio/dist/npm/wx") //npm引入方式
var Fly = require("../api/wx.umd.min") //wx.js为您下载的源码文件
var fly = new Fly(); //创建fly实例
var ht = require("./login")

function getToken() {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'token',
      success(res) {
        console.log(res.data)
        resolve(res.data)
      },
      fail(err) {
        resolve(false)
      }
    })
  });
}

fly.interceptors.request.use(function (request) {
  let token = wx.getStorageSync('token')
  if (!request.notToken) {
    //没有token且请求不是白名单的都锁住
    if (!token) {
      fly.lock()
      return ht.doLogin().then((d) => {
        request.headers["Authorization"] = wx.getStorageSync('token');
        console.log("token请求成功，值为: ", d);
        return request; //只有最终返回request对象时，原来的请求才会继续

      }).finally(() => {
        fly.unlock();//解锁后，会继续发起请求队列中的任务，详情见后面文档
      });
    } else {
      request.headers["Authorization"] = token;
    }
  } else {
    return request;
  }
})

fly.interceptors.response.use(
  async (response) => {
    //只将请求结果的data字段返回
    if (response.data.code == 200) {
      return response.data
    } else {
      var reg = RegExp(/请先登录/);
      if(response.data.msg.match(reg)){
        fly.lock()
        //去登陆 成功之后再unlock
        const isLoginSuccess = await ht.doLogin()
        if (isLoginSuccess) {
          fly.unlock()
        }
        //新执行本次由于token过期被服务器拒绝的接口
        return fly.request(response.request)
      }else{
        wx.showToast({
          title: response.data.msg,
          icon: 'error'
        });
        return false;
      }

    }

  },
  async (err) => {
    if (err.status === 401) {
      //401之后，把后面的请求都锁死 防止再次401
      fly.lock()
      //去登陆 成功之后再unlock
      const isLoginSuccess = await ht.doLogin()
      if (isLoginSuccess) {
        fly.unlock()
      }
      //新执行本次由于token过期被服务器拒绝的接口
      return fly.request(err.request)
    }
  }
)

// Set the base url
fly.config.baseURL = getApp().globalData.baseUrl || "http://test.social.gxidt.cn/test-api/";

export default fly;