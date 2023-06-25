// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
let xcx_login_url = 'user_sync';
let xcx_user_info = 'user_get';
let xcx_content_list = 'content_list';

const install = (Vue, vm) => {
	
	//小程序手机号登录
	let mpLogin = (userinfo)=>vm.$u.post(xcx_login_url,userinfo);
	//获取用户信息
	let memberInfo = (openid)=>vm.$u.post(xcx_user_info,{uid:openid});
	
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {mpLogin,memberInfo};
	
	Vue.prototype.$zoomla = {};	
}

export default {
	install
}