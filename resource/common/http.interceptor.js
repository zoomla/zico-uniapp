const appid = 'cd3c2bf95091673cd0a7f2d551cda6dd';
const apikey = '4b434af0977dbe552e7f4a4e24e731d9';
const hostApi = 'https://c.z01.com'; //'http://localhost:7777';

const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		baseUrl: hostApi,
		
		// 如果将此值设置为true，拦截回调中将会返回服务端返回的所有数据response，而不是response.data
		// 设置为true后，就需要在this.$u.http.interceptor.response进行多一次的判断，请打印查看具体值
		// originalData: true, 
		// 设置自定义头部content-type
		header: {
			'content-type': 'application/x-www-form-urlencoded',
			// 'content-type': 'application/json'
		}
	});
	const formatApiUrl = (url)=>{
		let apis = '/api/WXAPP';
		let param = {
			apiId: appid,
			apiKey: apikey,
			action: url
		};
		apis += vm.$u.queryParams(param);				
		return apis;
	}
	Vue.prototype.$u.createUrl = (url)=>formatApiUrl(url);
	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {
		//config.header.Token = 'xxxxxx';
		// options.url = validate.url(options.url) ? options.url : (this.config.baseUrl + (options.url.indexOf('/') == 0 ?
		// 	options.url : '/' + options.url));
		// 方式一，存放在vuex的token，假设使用了uView封装的vuex方式，见：https://uviewui.com/components/globalVariable.html
		// config.header.token = vm.token;
		config.url = formatApiUrl(config.url);
		//需要登录				
		// 方式二，如果没有使用uView封装的vuex方法，那么需要使用$store.state获取
		// config.header.token = vm.$store.state.token;
		
		// 方式三，如果token放在了globalData，通过getApp().globalData获取
		// config.header.token = getApp().globalData.username;
		
		// 方式四，如果token放在了Storage本地存储中，拦截是每次请求都执行的，所以哪怕您重新登录修改了Storage，下一次的请求将会是最新值
		// const token = uni.getStorageSync('token');
		// config.header.token = token;
		
		return config; 
	}
	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		// 如果把originalData设置为了true，这里得到将会是服务器返回的所有的原始数据
		// 判断可能变成了res.statueCode，或者res.data.code之类的，请打印查看结果
		if(res.retcode != -1 ){
			try {
				// result字段不一定是一个JSON字符串
				// 需要防止这里因为转换失败报错从而导致成功的请求无法被处理
				res.result = JSON.parse(res.result);
			} catch (e) {console.debug(e);}
			return res;
		}else return false;
	}
}

export default {
	install
}