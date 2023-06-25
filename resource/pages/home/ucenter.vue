<template>
	<view>
		<view class="ucenter_info">
		<view class="ucenter_infoBox">
			<view class="ucenter_checkIn" :class="signInOk ? 'ok' : ''" @click="signIn">
				<view class="ucenter_checkInStat">
					<u-icon name="calendar-fill"></u-icon>
					<view class="ucenter_checkInTxt">每日签到</view>
				</view>
				<view class="ucenter_checkInStat ok">
					<u-icon name="checkbox-mark"></u-icon>
					<view class="ucenter_checkInTxt">今日已签到</view>
				</view>
			</view>
			<view class="ucenter_infoLeft">
				<image v-if="vuex_token" :src="safeFaceUrl(vuex_user.userFace)" mode="aspectFit"></image>
				<image v-else src="//www.sjtzj.com/UploadFiles/Images/weixin/a2.jpg"></image>
				<view v-if="vuex_token"> {{vuex_user.honeyName}}
					<view class="ucenter_money">
						<button class="mini-btn" type="default" size="mini" plain="true"
							@click="$u.route('/pages/member/jifen')">{{vuex_user.point || 0}}积分</button>
						<button class="mini-btn" type="default" size="mini" plain="true"
							@click="$u.route('/pages/member/money')">¥{{vuex_user.purse.toFixed(2)}}元</button>
						<button class="mini-btn" type="info" size="mini" plain="true"
							@click="$u.route('/pages/member/pay')">点击充值</button>
					</view>
				</view>
				<navigator v-else url="../member/wxauth">动妖访客<text class="u-font-13">(点击登录)</text></navigator>
				<!-- <navigator v-else url="../member/wxauth">去登录</navigator> -->
			</view>
			<!-- 				<view class="ucenter_login">
				<image :src="vuex_user.userFace" mode="aspectFit"></image>
				<button v-if="vuex_token" @click="loginout">退出登录</button>
				<navigator v-else url="../member/wxauth">去登录</navigator>
				</view> -->
			<!-- <button size="mini" open-type="share" plain="true">分享助力</button> -->
			<view class="ucenter_infoR">
				<!-- <button size="mini" type="default" open-type="contact" plain="true">
					<u-icon name="server-man"></u-icon>在线客服
				</button> -->
				<u-icon name="setting" @click="uClick('/pages/member/setting')"></u-icon>
			</view>
			</view>
			<view class="ucenter_open">
				<view class="ucenter_open_sys">
					<view>开通逐浪动妖VIP会员</view>
					<view>每月仅需30元/畅享16项特权</view>
				</view>
				<u-button type="primary" @click="goto('/pages/shop/shop_class?nid=46')">立即开通</u-button>
			</view>
			<view class="ucenter_infoAfter"></view>
		</view>


		<view class="ucenter_box">
			<view class="ucenter_box_4">
				<view class="ucenter_box_4list" @click="uClick('/pages/member/fav')">
					<view><i class="zi zi_loves"></i></view>
					<text>我的收藏</text>
				</view>
				<view class="ucenter_box_4list" @click="uClick('/pages/member/myorder')">
					<view><i class="zi zi_gem"></i></view>
					<text>商城订单</text>
				</view>
				<view class="ucenter_box_4list" @click="uClick('/pages/member/mybiao')">
					<view><i class="zi zi_clipboardlist"></i></view>
					<text>作品管理</text>
				</view>
				<view class="ucenter_box_4list" @click="$u.route('/pages/channel/biao')">
					<view><i class="zi zi_SquareTable"></i></view>
					<text>技术展区</text>
				</view>
<!-- 				<view class="ucenter_box_4list" @click="$u.route('/pages/member/mybiao')">
					<view><i class="zi zi_SquareTable"></i></view>
					<text>裱件2管理</text>
				</view> -->
			</view>

			<u-cell-group>
				<!-- <u-cell-item icon="setting-fill" title="个人设置" @click="uClick('/pages/channel/biao')"></u-cell-item> -->
				<u-cell-item v-if="vuex_user.groupId == 3" icon="pushpin-fill" title="动妖创作云" value="字研所官方工具"
					@click="goto('/pages/channel/hui?nid=54')"></u-cell-item>
				<u-cell-item icon="shopping-cart" title="服务商城" value="官方服务订阅" @click="goto('/pages/shop/shop')">
				</u-cell-item>
				<u-cell-item icon="thumb-up" title="H5作品" value="创作的H5作品" @click="goto('/pages/shop/shop')">
				</u-cell-item>
				<u-cell-item icon="tags" title="技术预约" value="预约技术服务" @click="goto('/pages/channel/yuyue')">
				</u-cell-item>
				<u-cell-item icon="bookmark" title="关于动妖" value="品牌理念阐述" @confirm="goto('/pages/shop/shop')"
					@click="open"></u-cell-item>
				<u-cell-item icon="info-circle" title="团队风采" value="创业团队的故事" @click="open2"></u-cell-item>
				<u-cell-item icon="phone" title="联系我们" value="一个电话上门收裱" @click="call_phone(13177777714)"></u-cell-item>
			</u-cell-group>
			<view class="ucenter_loginOut">
				<button type="default" plain="true" v-if="vuex_token" @click="loginout">退出登录</button>
				<!-- <navigator v-else url="../member/wxauth">去登录</navigator> -->
			</view>
			<view class="ucenter_copyright">
				动妖创作云 版权所有 <span @click="goto('/pages/webview/copyright_privacy')" style="padding: 0 10rpx;">隐私政策</span>  <span @click="goto('/pages/webview/copyright_server')">服务协议</span><br />
				Powered by 江西出海软件科技有限公司<br/>
				24小时全天侯客服热线：13177777714<br />
				<text @click="goto('/pages/webview/zfont-f')">逐浪字库</text>与<text
					@click="goto('/pages/webview/z01-ico')">zico图标</text>呈现∞<text
					<!-- @click="goto('/pages/webview/sjtzj-com')">瘦金体之家sjtzj.com</text>官网支持  -->
					<br>
				基于<text @click="goto('/pages/webview/z01-com')">Zoomla!逐浪CMS</text>内核 <text
					@click="goto('/pages/webview/73ic-com')">去上云73ic.com</text>驱动<br />
				字研所、佶雅阁、逐浪是注册商标<br>
			</view>
		</view>

		<u-modal v-model="show" :title-style="{color: 'red'}" :title="title" confirm-text="☛ 进入江西字研所频道"
			@confirm="confirm">
			<view class="slot-content">
				<rich-text :nodes="content"></rich-text>
			</view>
		</u-modal>
		<u-modal v-model="show2" :title-style="{color: 'red'}" :title="title2">
			<view class="slot-content">
				<rich-text :nodes="content2"></rich-text>
			</view>
		</u-modal>

<mybar></mybar>	
	</view>
</template>
<script>
	export default {
		data() {
			return {
				show: false,
				title: '字者新生-中国文字逐浪造！',
				content: `
					字者，新生，代表一切美好的事物孕育。<br>
					研者，摩者是也，从手从石，创造无限。<br><br>
					字研所小程序，是由国内领先的字库与软件研发机构-逐浪团队打造的官方应用，服务于广大用户，推送最新资讯。<br>
					同时还提供专业的瘦金体书法研究、线下书法展、装裱、文房用品交易、艺术品收藏等服务，感谢您的访问，并期待您将【江西字研所】小程序介绍推送给更多的书友，谢谢！
				`,
				show2: false,
				title2: '创立20年的专业字库智造团队',
				content2: `<img src="https://www.sjtzj.com/UploadFiles/Images/weixin/team.jpg" width="100%"><strong>笨、难、丑、朴,专注做中国互联网的鲁班。</strong><br>
				南昌、上海、北京，20载立业，国内首个开放字库软件的技术团队，先后服务中化集团、中国电建、水电基础局、远东宏信、中国金茂以及军工、世界五百强。<br><br>
				<strong>软件公司的公司</strong><br>国内唯一具备字库、图标、图库、CMS、OA、ERP全闭环web呈现知识独立自主知识产权的服务商，并建立<u>国内唯一从字库生产、手工装裱、古藉修复、文字创作、软件研发一体的全产业链文字机构</u>，官网www.ziti163.com。
				`,
				version_number: '',
				signInOk: false, //是否已签到
			};
		},
		methods: {
			getUserInfo(e) {
				console.log(1121)
				// uni.login({
				// 	success: (res) => {
				// 		console.log(res)
				// 	}
				// })
				// console.log(e)
				if (uni.getUserProfile) {
					console.log('ok')
				} else {
					console.log('no')
				}
				uni.getUserProfile({
					desc: '登录',
					success: (res) => {
						console.log(res, 2)
					},
					fail: (fail) => {
						console.log(fail, 11)
					}
				})
			},
			login() {
				this.$zoomla.isLogin();
			},
			loginout() {
				uni.showLoading();
				this.$u.vuexReset();
				this.$zoomla.loginOut();
				this.EventBus.$on("cartHaveChange");
				uni.hideLoading();
			},
			uClick(url, tab = false) { //未登录则跳到登录页，否则进入目标页
				if (!this.$zoomla.isLogin()) {
					return;
				}
				if (tab) {
					uni.switchTab({
						url: url,
						animationDuration: 200,
						animationType: 'pop-in'
					})
				} else {
					uni.navigateTo({
						url: url,
						animationDuration: 200,
						animationType: 'pop-in'
					})
				}
			},
			goto(url) { //通用clik链接方法
				uni.navigateTo({
					url: url
				})
			},
			call_phone(phone) {
				uni.makePhoneCall({ //拔打电话
					phoneNumber: '' + phone
				});
			},
			signIn() { // 用户签到
				if (!this.$zoomla.isLogin()) {
					return;
				}
				const that = this;
				let mu = this.$store.state.vuex_user;
				// 查找签到积分设置
				that.$u.get("user_score_setting").then(settingRes => {
					if (settingRes.result <= 0) {
						return; // 未设置签到积分
					}
					// 查找积分日志
					that.$u.get("user_exp_list_log", {
						uid: mu.userId
					}).then(logListRes => {
						for (let i = 0; i < logListRes.result.length; i++) {
							const item = logListRes.result[i];
							if (new Date(item.HisTime).toLocaleDateString() == new Date()
								.toLocaleDateString()) {
								uni.showToast({
									title: '今日已签到',
									icon: 'none'
								});
								return; // 今日已签到
							}
						}
						// 操作积分
						that.$u.post("user_exp_update", {
							uid: mu.userId,
							exp: settingRes.result
						}).then(updateRes => {
							that.signInOk = true;
							// 记录日志
							let logData = {
								UserID: mu.userId,
								score: settingRes.result,
								score_before: mu.point,
								HisTime: this.$u.timeFormat(new Date(), "yyyy-mm-dd hh:MM:ss"),
								Operator: mu.userId,
								Detail: "签到",
								ScoreType: 3
							};
							that.$u.post("user_exp_update_log", {
								model: JSON.stringify(logData)
							}).then(logRes => {});
							// 更新用户信息
							this.$zoomla.getMemberInfo()
							//===================
						}); // 操作积分 end
						//===================
					}); // 查找积分日志 end
					//===================
				}); // 查找签到积分设置 end
			},
			safeFaceUrl(src) {
				if (src.startsWith("http")) {
					return src;
				}
				return this.$u.http.config.baseUrl + src;
			},
			open() {
				this.show = true;
			},
			open2() {
				this.show2 = true;
			},
			confirm() { //模态框事件入指定页面
				uni.navigateTo({
					url: '/pages/channel/hui?nid=39'
				})
			}
		},
		onLoad() {
			const that = this;
			this.$zoomla.getMemberInfo()

			console.log(this.$store.state.vuex_version)
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#1496f1',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			});
			// 获得版本号
			// uni.getSystemInfo({
			// 　　　　success: function (res) {
			// 						console.log(res)       
			// 　　　　}
			// 　　});
			//const accountInfo = wx.getAccountInfoSync();
			//this.version_number = accountInfo.miniProgram.version // 小程序 版本号
			// console.log('1111111111111',accountInfo )

			// 以下逻辑在用户登录后可用
			if (!this.$zoomla.isLogin()) {
				return;
			}
			let mu = this.$store.state.vuex_user;
			/* 判断今日是否已签到 */
			// 查找签到积分设置
			that.$u.get("user_score_setting").then(settingRes => {
				if (settingRes.result <= 0) {
					return; // 未设置签到积分
				}
				// 查找积分日志
				that.$u.get("user_exp_list_log", {
					uid: mu.userId
				}).then(logListRes => {
					for (let i = 0; i < logListRes.result.length; i++) {
						const item = logListRes.result[i];
						if (new Date(item.HisTime).toLocaleDateString() == new Date()
							.toLocaleDateString()) {
							setTimeout(function () { that.signInOk = true; }, 400);
							return; // 今日已签到
						}
					}
					//===================
				}); // 查找积分日志 end
				//===================
			}); // 查找签到积分设置 end
		}
	}
</script>
<style lang="scss">
page {color: #ccc;}
.slot-content {font-size: 28rpx;color: $u-content-color;padding-left: 30rpx;margin-top: 20rpx;}
.ucenter_info{position: relative;}
.ucenter_checkIn{width: 180rpx; position: absolute; top: 8rpx; right: 0; font-size: 34rpx; border-radius: 50rpx 0 0 50rpx; box-shadow: 0 0 8rpx 0 rgba(23,23,23, .45); overflow: hidden;}
.ucenter_checkIn.ok{width: 210rpx; box-shadow: 0 0 8rpx 0 rgba(23,23,23, .25);}
.ucenter_checkInStat{display: flex; align-items: center; padding: 8rpx 0 8rpx 14rpx; position: relative; opacity: 1;}
.ucenter_checkInTxt{font-size: 26rpx;}
.ucenter_checkInStat.ok{width: 100%; position: absolute; top: 0; right: 100%; opacity: 0;}
.ucenter_checkIn.ok{background: #CCCBB7;}
.ucenter_checkIn.ok>.ucenter_checkInStat:not(.ok){left: 100%; opacity: 0;}
.ucenter_checkIn.ok>.ucenter_checkInStat.ok{right: 0; opacity: 1;}
.ucenter_checkIn,.ucenter_checkIn>*{transition: all ease .3s;}

</style>
