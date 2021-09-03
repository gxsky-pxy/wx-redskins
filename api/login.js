var isLogin = false;
export async function doLogin() {
	//如果正在登录中则不执行
	if (isLogin) return false;
	isLogin = true;
	const code = await wxLogin();
	const d = await login(code);
	wx.setStorageSync('token', d.data.token);
	isLogin = false
	return true

}

function wxLogin() {
	return new Promise(resolve => {
		wx.login({
			success: res => {
				resolve(res.code);
			}
		});
	});
	// 发送 res.code 到后台换取 openId, sessionKey, unionId

}

function login(code) {
	return new Promise(resolve => {
		wx.request({
			url: getApp().globalData.baseUrl + 'login/appLogin',
			data: { loginCode: code },
			method: 'POST',
			success(res) {
				resolve(res.data)
			}
		})
	})
}
