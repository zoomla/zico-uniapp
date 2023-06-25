import md5Libs from "uview-ui/libs/function/md5";

const install = (Vue,vm)=>{
	vm.$zoomla.md5 = (str)=>{
		return md5Libs.md5(str)
	}
	//获取Url参数
	// vm.$zoomla.getQueryString = (str)=>{
	// 	return decodeURIComponent((new RegExp('[?|&]'+ str +'=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1]
	// 						.replace(/\+/g, '%20')) || '';
	// }
	//格式化输出时间
	vm.$zoomla.timeFormat = (timeStr,showtime = true)=>{
		let formatPattern = showtime ?'yyyy-mm-dd hh:MM:ss':'yyyy-mm-dd';
		return vm.$u.timeFormat(Date.parse(timeStr),formatPattern);
	}
	vm.$zoomla.getWxUserInfo = ()=>{
		uni.getUserProfile({
			desc:'授权头像、昵称',
			success: (res)=>{
				let param = {
					encryptedData: res.encryptedData,
					iv: res.iv,
					userFace: res.userInfo.avatarUrl,
					honeyName: res.userInfo.nickName,
					sex: res.userInfo.gender,
				}
				vm.$u.vuex('wxuserprofile',param);
				vm.$u.route('/pages/member/login')
			},
			fail:(fail)=>{
				console.log(fail)
			}
		})
	}
	
	//登录
	vm.$zoomla.setLogin = (mu)=>{
		let token = vm.$zoomla.md5(JSON.stringify(mu))
		vm.$u.vuex('vuex_token',token)
		vm.$u.vuex('vuex_user',mu)
		vm.$u.route({type:'switchTab',url:'/pages/home/ucenter'}) 
	}
	//通用商城栏目列表链接
	vm.$zoomla.goto_shopNid = (nid)=>{
		console.log(nid)
		uni.navigateTo({
				url:'/pages/shop/shop_class?nid='+nid
		})
	}
	//是否登录
	vm.$zoomla.isLogin = (redirect = true)=>{
		let vuexUser = vm.$store.state.vuex_token;
		if(vm.$u.test.isEmpty(vuexUser)) {
			if(redirect){
				uni.navigateTo({
					url: '/pages/member/wxauth',
					animationType: 'pop-in',
					animationDuration: 200
				})
				return false;
			}
			return false;
		};
		return true;
	}
	//退出 
	vm.$zoomla.loginOut = (post = false)=>{
		uni.clearStorageSync();
		vm.$u.vuexReset();		
		uni.switchTab({
			url: "/pages/home/ucenter"
		})
	}
	
	//获取用户信息
	vm.$zoomla.getMemberInfo = ()=>{
		if(!vm.$zoomla.isLogin(false)) return false;
		let openid = vm.$store.state.vuex_user.userId;
		vm.$u.api.memberInfo(openid).then((res)=>{
			vm.$u.vuex('vuex_user',res.result)
		}).catch((err)=>{
			vm.$zoomla.loginOut();
		})
	}


/**
 * 处理富文本里的图片宽度自适应
 * 1.去掉img标签里的style、width、height属性
 * 2.img标签添加style属性：max-width:100%;height:auto
 * 3.修改所有style里的width属性为max-width:100%
 * 4.去掉<br/>标签
 * @param html
 * @returns {void|string|*}
 */
	vm.$zoomla.formatRichText =(html) => {
		let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
			match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
			match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
			match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
			return match;
		});
		newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
			match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
			return match;
		});
		newContent = newContent.replace(/<br[^>]*\/>/gi, '');
		newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin-top:10rpx;margin-bottom:10rpx;"');
		return newContent;
	}
	
}
export default {
	install
}

