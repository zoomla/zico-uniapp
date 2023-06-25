<template>
	<view>
		<view class="point_logList">
			<view class="point_logListHeader">
				<view>当前余额：<text style="color: #ffbb3d;">¥{{vuex_user.purse || "0"}}</text></view>
				<view class="rechargeBtn" @click="showRechargePanel = true">立即充值</view>
			</view>
			<scroll-view scroll-y="true" style="height: calc(100vh - 140rpx);" @scrolltolower="onreachBottom">
				<view class="opint_log" v-for="(item, index) in logs" :key="index">
					<view class="opint_logDetail">
						<view>{{item.Detail}}</view>
						<view class="opint_logScore" :class="(item.Score > 0 ? 'increase' : 'decrease')">{{item.Score > 0 ? "+" : ""}}{{item.Score}}</view>
					</view>
					<view class="opint_logTime">{{$zoomla.timeFormat(item.HisTime)}}</view>
				</view>
				<u-loadmore :status="loadStatus" @loadmore="onreachBottom" bg-color="transparent" />
				<view style="padding: 10rpx;"></view>
			</scroll-view>
		</view>
		<u-popup v-model="showRechargePanel" mode="bottom" height="600">
			<view class="rechargePanel">
				<view class="rechargePanel_Title">选择充值金额</view>
				<view class="rechargePanel_List">
					<view class="rechargePanel_ListItem" @click="chooseMoney(1)">
						<view class="rechargePanel_ListItemCnt">1</view>
					</view>
					<view class="rechargePanel_ListItem" @click="chooseMoney(10)">
						<view class="rechargePanel_ListItemCnt">10</view>
					</view>
					<view class="rechargePanel_ListItem" @click="chooseMoney(30)">
						<view class="rechargePanel_ListItemCnt">30</view>
					</view>
					<view class="rechargePanel_ListItem" @click="chooseMoney(50)">
						<view class="rechargePanel_ListItemCnt">50</view>
					</view>
					<view class="rechargePanel_ListItem" @click="chooseMoney(100)">
						<view class="rechargePanel_ListItemCnt">100</view>
					</view>
					<view class="rechargePanel_ListItem" @click="chooseMoney(200)">
						<view class="rechargePanel_ListItemCnt">200</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: "",
				logs: [],
				cpage: 1,
				psize: 10,
				loadStatus: "loadmore",
				showRechargePanel: false,
				money: 1
			}
		},
		onLoad() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#181619',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			});
			if (!this.$zoomla.isLogin()) {
				return;
			}

			let mu = this.$store.state.vuex_user;
			this.uid = mu.userId;
			this.getRechargeLog();
		},
		methods: {
			onreachBottom() {
				this.getRechargeLog();
			},
			getRechargeLog() {
				const that = this;
				if (that.loadStatus == "loading") {
					return;
				}
				that.loadStatus = "loading";

				that.$u.post("user_point_list", {
					uid: that.uid,
					stype: 1,
					cpage: that.cpage,
					psize: that.psize
				}).then(res => {
					let data = res.result;
					if (data.length == 0) {
						that.loadStatus = "nomore";
						return;
					}

					for (let i = 0; i < data.length; i++) {
						that.logs.push(data[i]);
					}

					that.cpage++;
					that.loadStatus = "loadmore";
				});
			},
			chooseMoney(money) {
				this.money = money;
				this.recharge();
			},
			recharge() {
				const that = this;
				that.$u.post("user_money_recharge", {
					appId: 3,
					uid: that.uid,
					money: that.money
				}).then(res => {
					let payData = res.result;
					// 唤起微信支付
					uni.requestPayment({
						provider: "wxpay",
						orderInfo: {
							"appid": payData.appid,
							"partnerid": payData.partnerid,
							"prepayid": payData.prepayid,
							"package": "Sign=WXPay",
							"noncestr": payData.nonceStr,
							"timestamp": payData.timeStamp,
							"sign": payData.paySign
						},
						complete: function() {
							uni.hideLoading();
						},
						success: function(payRes) {
							uni.showToast({
								title: "支付成功",
								icon: "none"
							});
							that.showRechargePanel = false;
							that.$zoomla.getMemberInfo();
						},
						fail: function(payRes) {
							uni.showToast({
								title: "已取消支付",
								icon: "none"
							});
						}
					});
				});
			}
		}
	}
</script>

<style>
page{background: #0F0F11; color: #ccc;}

.rechargeBtn{padding: 12rpx 18rpx; border: 2rpx solid #ffbb3d; border-radius: 8rpx; font-size: 24rpx; color: #ffbb3d;}

.point_logList{padding: 18rpx 30rpx 0 30rpx;}
.point_logListHeader{display: flex; justify-content: space-between; align-items: center; margin-bottom: 26rpx; font-size: 44rpx;}
.opint_log{padding-bottom: 15rpx; margin-bottom: 17rpx; border-bottom: 2rpx dashed #6c6c6c;}
.opint_logDetail{display: flex; justify-content: space-between; align-items: center; font-size: 32rpx;}
.opint_logScore{width: 130rpx; text-align: right;}
.opint_logScore.increase{color: #fa3534;}
.opint_logScore.decrease{color: #19be6b;}
.opint_logTime{font-size: 24rpx; color: #9c9c9c;}

.rechargePanel{padding-top: 40rpx; color: #232323;}
.rechargePanel_Title{padding: 20rpx 0; margin-bottom: 20rpx; font-size: 38rpx; text-align: center;}
.rechargePanel_List{display: flex; justify-content: space-between; flex-wrap: wrap; width: 80%; margin: 0 auto;}
.rechargePanel_ListItem{width: 30%; margin: 10rpx;}
.rechargePanel_ListItemCnt{display: flex; justify-content: center; align-items: center; width: 100%; height: 100rpx; font-size: 36rpx; color: #ff9900; border: 2rpx solid #ff9900; border-radius: 8rpx;}
</style>
