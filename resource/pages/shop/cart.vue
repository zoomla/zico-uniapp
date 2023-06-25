<template>
	<view>
		<view class="cart_list">
			<view class="cart_listItem" v-for="(item, index) in cartList" :key="index">
				<view class="cart_itemBody">
					<view class="cart_itemChk">
						<u-checkbox v-model="item.selected" value="true" size="40" shape="circle"></u-checkbox>
					</view>
					<view class="cart_itemImage" @click="$u.route('/pages/shop/shop_item?id=' + item.proid)">
						<u-image :src="item.proimg" border-radius="4" width="100%" height="100%"></u-image>
					</view>
					<view class="cart_itemMainBlk">
						<view class="cart_itemName" @click="$u.route('/pages/shop/shop_item?id=' + item.proid)">{{item.proname}}</view>
						<view class="cart_itemAddon" v-if="!!item.specName">{{item.specName}}</view>
						<view class="cart_itemPriceBlk">
							<view class="cart_itemPrice"><text>{{item.FarePrice1}}</text></view>
							<view class="cart_itemCount">
								<u-number-box v-model="item.pronum" :min="1" @change="adjustNum(index)"></u-number-box>
							</view>
						</view>
					</view>
				</view>
				<view class="cart_itemSubtotalBlk">
					<view class="cart_itemSubtotal">小计：<text>{{item.AllMoney}}</text></view>
					<view class="cart_itemDel" @click="delProduct(index)">不要了</view>
				</view>
			</view>
		</view>

		<view class="fixedBottom">
			<view class="content">
				<view class="left" @click="delProductRange">
					<text>移除所选</text>
				</view>
				<view class="center">
					<view>数量：<view class="red">{{selectedProCount()}}</view></view>
					<view>总价：<view class="red money big">{{selectedProTotalFee()}}</view></view>
				</view>
				<view class="right" @click="toPay">
					<text>去结算</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: "",
				cartList: []
			}
		},
		onLoad() {
			const that = this;

			if (!that.$zoomla.isLogin()) {
				uni.showToast({
					title: '请先登录',
					icon: 'none',
					mask: true
				});
				return;
			}

			let mu = this.$store.state.vuex_user;
			that.uid = mu.userId;

			that.loadCart();
		},
		methods: {
			// 加载购物车
			loadCart() {
				const that = this;

				that.cartList.splice(0, that.cartList.length);
				that.$u.get("cart_list", {
					uid: that.uid
				}).then(res => {
					for (let i = 0; i < res.result.CartDT.length; i++) {
						let item = res.result.CartDT[i];
						item.specName = "";
						item.selected = true;
						that.cartList.push(item);

						let attrs = item.proAttr.split("|");
						for (let a = 0; a < attrs.length; a++) {
							const attr = attrs[a];
							if (attr.startsWith("Specification")) {
								item.specName = attr.split("=")[1];
								break;
							}
						}
					}

					that.EventBus.$emit("cartHaveChange");
				});
			},
			// 调整商品数量
			adjustNum(index) {
				let target = this.cartList[index];
				this.$u.post("cart_num", {
					id: target.id,
					num: target.pronum
				}).then(res => {
					/* 看似冗余的操作其实是在规避浮点数的精度问题，在没有更好的方案前请不要优化它 */
					target.AllMoney = (parseInt(target.FarePrice1 * 100) * target.pronum / 100);
				});
			},
			// 移除商品
			delProduct(index) {
				const that = this;

				uni.showModal({
					title: "提示",
					content: "确定要删除吗？",
					success: function(oprRes) {
						if (!oprRes.confirm) {
							return;
						}

						uni.showLoading({
							mask: true
						});

						let target = that.cartList[index];
						that.$u.post("cart_del", {
							id: target.id,
							uid: that.uid
						}).then(res => {
							if (res.retcode != 1) {
								uni.showToast({
									title: '删除失败',
									icon: 'none'
								});
								return;
							}

							uni.showToast({
								title: '删除成功',
								icon: 'none'
							});
							that.cartList.splice(index, 1);
							that.EventBus.$emit("cartHaveChange");
						});
					}
				});
			},
			// 批量移除商品
			delProductRange() {
				const that = this;

				uni.showModal({
					title: "提示",
					content: "确定要删除吗？",
					success: function(oprRes) {
						if (!oprRes.confirm) {
							return;
						}

						let ids = "";
						let prods = that.selectedProList();
						for (let i = 0; i < prods.length; i++) {
							const item = prods[i];
							ids += "," + item.id;
						}
						if (!ids) {
							return;
						}
						ids = ids.substr(1);

						that.$u.post("cart_del", {
							ids: ids,
							uid: that.uid
						}).then(res => {
							if (res.retcode != 1) {
								uni.showToast({
									title: '删除失败',
									icon: 'none'
								});
								return;
							}

							uni.showToast({
								title: '删除成功',
								icon: 'none'
							});
							that.loadCart();
						});
						//------------ success 结束
					}
				});
				//------------ delProductRange 结束
			},
			// 获取已选择的商品个数
			selectedProCount() {
				return this.selectedProList().length;
			},
			// 获取已选择商品的总价
			selectedProTotalFee() {
				let pros = this.selectedProList();
				let total = 0;
				for (let i = 0; i < pros.length; i++) {
					total += pros[i].AllMoney * 100;
				}
				return total / 100;
			},
			// 获取已选择的商品列表
			selectedProList() {
				let arr = [];
				for (let i = 0; i < this.cartList.length; i++) {
					const item = this.cartList[i];
					if (!item.selected) {
						continue;
					}
					arr.push(item);
				}
				return arr;
			},
			// 选择收货地址
			chooseAddress() {
				const that = this;
				wx.chooseAddress({
					success: function(address) {
						wx.setStorageSync("rece", address);
					},
					fail: function() {},
					complete: function() {}
				});
			},
			// 付款
			toPay() {
				const that = this;
				// 取得已选择的商品
				let proArr = that.selectedProList();
				if (proArr.length == 0) {
					uni.showToast({
						title: '请先选择商品',
						icon: 'none'
					});
					return;
				}
				let ids = "";
				for (let i = 0; i < proArr.length; i++) {
					ids += "," + proArr[i].id;
				}
				ids = ids.substr(1);

				// 跳转到结算页
				uni.navigateTo({
					url: "/pages/shop/getOrder?ids=" + ids
				});
			}
		}
	}
</script>

<style lang="scss">
page{background: #e6e6e6;}

.cart_list { padding: 18rpx 22rpx; }
.cart_listItem { margin-bottom: 20rpx; padding: 22rpx 28rpx 20rpx 28rpx; background: #fff; border-radius: 8rpx; }
.cart_itemBody { display: flex; align-items: center; margin-bottom: 22rpx; }
.cart_itemChk { width: 80rpx; }
.cart_itemImage { width: 170rpx; height: 120rpx; }
.cart_itemMainBlk { margin-left: 22rpx; width: 100%;
	>view { margin-bottom: 12rpx; }
}
.cart_itemName { font-size: 32rpx; }
.cart_itemAddon { padding: 4rpx 12rpx; font-size: 24rpx; color: #888; background: #f2f2f2; border-radius: 4rpx; }
.cart_itemPriceBlk { display: flex; align-items: center; }
.cart_itemPrice { width: 200rpx; color: #dd6161; text-align: center;
	text::before { content: "\0A5"; font-family: Arial, Helvetica, sans-serif; }
}
.cart_itemSubtotalBlk { display: flex; justify-content: space-between; }
.cart_itemSubtotal { 
	text { color: #f00; }
	text::before { content: "\0A5"; font-family: Arial, Helvetica, sans-serif; }
}
.cart_itemDel { text-decoration: underline; color: #888; }


.fixedBottom {
	height: 110rpx;
	.content { display: flex; justify-content: space-between; align-items: center; position: fixed; z-index: 999; bottom: 0; left: 0; width: 100%; height: 110rpx; background: #fff;
		view{ display: inline-flex; align-items: center; height: 100% }

		.left { background: #666; }
		.center { width: 100%; padding: 0 20rpx;
			>view:not(:first-child) { margin-left: 14rpx; }
		}
		.right { background: #000; }
		.left,.right{ width: 300rpx; justify-content: center; color: #fff; }

		.red { font-size: 30rpx; color: red; }
		.money::before { content: "\0A5"; font-family: Arial, Helvetica, sans-serif; }
		.money.big { font-weight: 700; font-size: 36rpx; }
	}
}
</style>
