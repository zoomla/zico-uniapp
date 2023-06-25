<script>
	export default {
		globalData: {
			//username: '白居易'
		},
		onLaunch:function() {
			// 1.1.0版本之前关于http拦截器代码，已平滑移动到/common/http.interceptor.js中
			// 注意，需要在/main.js中实例化Vue之后引入如下(详见文档说明)：
			// import httpInterceptor from '@/common/http.interceptor.js'
			// Vue.use(httpInterceptor, app)
			// process.env.VUE_APP_PLATFORM 为通过js判断平台名称的方法，结果分别如下：
			/**
			 * h5，app-plus(nvue下也为app-plus)，mp-weixin，mp-alipay......
			 */
			// tabbar中间按钮点击事件
			uni.onTabBarMidButtonTap(function(e){
				uni.navigateTo({
					url:'/pages/home/live',
					animationType:'slide-in-bottom',
					animationDuration:200
				})
				// uni.showToast({
				// 	title:'点击响应模拟测试',
				// 	duration: 1500,
				// 	icon:'none'
				// });
			})
			// uni.hideTabBar({}) //隐藏默认bar
			this.$u.vuex('vuex_version','1.1')
			
		},
	}
</script>
<style lang="scss">
@import "static/zico.scss"; 
@import "style/global.scss";
</style>