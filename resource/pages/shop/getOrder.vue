<template>
	<view>
		<view class="sett_top">
			<view class="sett_top_t">订单配送至</view>
			<view class="sett_top_add">{{address.safeName}}<view @click="chooseAddress()">修改地址</view></view>
		</view>
		<view class="sett_con">
			<u-checkbox v-model="usePurse">使用余额支付</u-checkbox>
			<text class="sett_purse">当前余额：¥{{vuex_user.purse.toFixed(2)}}</text>
		</view>
		<view class="sett_con">
			<view class="sett_con_top">详情</view>
			<view class="sett_con_list" v-for="(item, index) in productList" :key="index">
				<view class="sett_con_list_title">{{item.proname}}</view>
				<view class="sett_con_list_quantity">x<view class="sett_con_list_quantity1">{{item.pronum}}</view></view>
				<view class="sett_con_list_price">￥<view class="sett_con_list_price1">{{item.AllMoney}}</view></view>
			</view>
			<u-select v-model="show" :list="discountList"></u-select>
			<view class="sett_con_envelope" @click="show = true;">选择优惠券 〉</view>
		</view>
		<view class="sett_payment">
			<view class="sett_payment_left">总价:
				<view class="sett_payment_price">
					￥<view class="sett_payment_price1">{{totalFee}}</view>
				</view>
			</view>
			<view class="sett_payment_right" @click="confirm()">去支付</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: "",
				show: false,
				address: {
					safeName: "（暂未选择收货地址）",
					json: ""
				},
				discountList: [
					{
						value: '1',
						label: '满50减10'
					},
					{
						value: '2',
						label: '满100减30'
					},
					{
						value: '3',
						label: '满10减3'
					},
				],
				ids: "",
				productList: [],
				totalFee: 0,
				usePurse: false
			};
		},
		onLoad(options) {
			const that = this;
			if (!that.$zoomla.isLogin()) {
				return;
			}
			let mu = this.$store.state.vuex_user;
			that.uid = mu.userId;

			that.ids = options.ids;
			that.$u.get("cart_list", {
				uid: that.uid
			}).then(res => {
				for (let i = 0; i < res.result.CartDT.length; i++) {
					let item = res.result.CartDT[i];
					if (that.ids.indexOf(item.id.toString()) < 0) {
						continue;
					}
					that.totalFee += parseInt(item.AllMoney * 100);
					that.productList.push(item);
				}
				that.totalFee /= 100;
			});

			this.$u.get("user_get", {
				uid: mu.userId
			}).then(res => {
				let userInfo = res.result;
				that.address.safeName = userInfo.address.replace(/ /g, "") || "（暂未选择收货地址）";
				let addrArr = userInfo.address.split(" ") || [];
				let addrJson = {
					userName: userInfo.trueName,
					telNumber: userInfo.mobile,
					provinceName: addrArr[0] || "",
					cityName: addrArr[1] || "",
					countyName: addrArr[2] || "",
					detailInfo: addrArr[3] || "",
					postalCode: userInfo.CompanyDescribe,
				};
				for (let prop in addrJson) {
					if (!addrJson[prop]) {
						return;
					}
				}
				that.address.json = JSON.stringify(addrJson);
			});
		},
		methods: {
			chooseAddress() {
				const that = this;
				uni.navigateTo({
					url: "/pages/shop/choose_address",
					events: {
						"confirm": function(data) {
							for (let prop in data) {
								if (!data[prop]) {
									return;
								}
							}
							that.address.json = JSON.stringify(data);
							that.address.safeName =
								data.provinceName +
								data.cityName +
								data.countyName +
								data.detailInfo;
						}
					}
				});
				return;
			},
			confirm() {
				const that = this;
				if (!that.address.json) {
					that.chooseAddress();
					return;
				}
				if (that.usePurse && that.totalFee > that.$store.state.vuex_user.purse) {
					uni.showModal({
						title: "对不起，您的余额不足，请充值或使用现金支付",
						showCancel: false
					});
					return;
				}
				uni.showLoading({
					mask: true
				});
				// 递交订单
				that.$u.post("payment_cart", {
					appId: 3, //对应 [手机APP]动妖创作云，默认为 1 [小程序]字研小程序
					uid: that.uid,
					cartIds: that.ids,
					fareDT: `[{"storeId":"1","total":"0.00"}]`, // 运费设置
					rece: that.address.json,
					use_sicon: 0,
					use_purse: (that.usePurse ? that.totalFee : 0)
				}).then(paymentCartRes => {
					let orderData = JSON.parse(paymentCartRes.addon);
					let payData = paymentCartRes.result;
					if (that.usePurse) {
						this.$zoomla.getMemberInfo();
						uni.showToast({
							title: "支付成功",
							icon: "none"
						});
						// 支付成功，扣减购物车，完成订单
						that.$u.post("payment_success", {
							uid: that.uid,
							orderIds: orderData.orderIds,
							cartIds: orderData.cartIds
						}).then(paymentSuccessRes => {
							that.EventBus.$emit("cartHaveChange");
						});
						// 跳转到首页
						setTimeout(function() {
							uni.switchTab({
								url: "/pages/home/index"
							});
						}, 650);
						return;
					}
					// 唤起微信支付
					let orderInfo = {
						"appid": payData.appid,
						"partnerid": payData.partnerid,
						"prepayid": payData.prepayid,
						"package": "Sign=WXPay",
						"noncestr": payData.nonceStr,
						"timestamp": payData.timeStamp,
						"sign": payData.paySign
					};
					uni.requestPayment({
						provider: "wxpay",
						orderInfo: orderInfo,
						success: function(res) {
							uni.showToast({
								title: "支付成功",
								icon: "none"
							});
							// 支付成功，扣减购物车，完成订单
							that.$u.post("payment_success", {
								uid: that.uid,
								orderIds: orderData.orderIds,
								cartIds: orderData.cartIds
							}).then(paymentSuccessRes => {});
							// 跳转到首页
							setTimeout(function() {
								uni.switchTab({
									url: "/pages/home/index"
								});
							}, 650);
						},
						fail: function(err) {
							uni.showToast({
								title: "已取消支付",
								icon: "none"
							});
							// 支付取消，删除订单、支付单
							that.$u.post("payment_fail", {
								uid: that.uid,
								orderIds: orderData.orderIds,
								paymentId: orderData.paymentId
							}).then(paymentFailRes => {});
						}
					});
				});
				
			}
		}
	}
</script>

<style lang="scss">
page{background: #f3f3f3;}

.sett_purse{color: #fa3534; font-size: 30rpx; position: relative; top: 2rpx;}
</style>
