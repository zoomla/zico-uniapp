<template>
	<view>
		<view>
			<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" >
			<swiper-item class="swiper-item">
				<scroll-view  scroll-y="true" @scrolltolower="onreachBottom" >
					<view class="order" v-for="(order, oidx) in orderList.all.orders" :key="order.id.toString().concat('_all')">
						<view class="order_ProItem" v-for="(product, pidx) in order.cartList" :key="product.CartId.toString().concat('_all')">
							<view class="order_ProImg" @click="jumpToDetail('all', oidx, pidx)">
								<view class="order_ProImg1">
									<u-image :src="product.Thumbnails" width="100%" height="100%" border-radius="8"></u-image>
								</view>
							</view>
							<view class="order_ProName" @click="jumpToDetail('all', oidx, pidx)">
								{{product.ProName}}
							</view>
							<view class="order_ProQuantity">
								<view class="order_ProQuantity_r">¥ {{product.AllMoney}}</view>
								<view class="order_ProQuantity_s">x{{product.Pronum}}</view>
							</view>
						</view>
						<view class="order_xj">小计: {{parseFloat(order.Ordersamount).toFixed(2)}}</view>
					</view>
					<u-loadmore :status="orderList.all.loadStatus" @loadmore="getOrderList()" bg-color="transparent" />
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view  scroll-y="true" @scrolltolower="onreachBottom" >
					<view class="order" v-for="(order, oidx) in orderList.payed.orders" :key="order.id.toString().concat('_payed')">
						<view class="order_ProItem" v-for="(product, pidx) in order.cartList" :key="product.CartId.toString().concat('_payed')">
							<view class="order_ProImg" @click="jumpToDetail('payed', oidx, pidx)">
								<view class="order_ProImg1">
									<u-image :src="product.Thumbnails" width="100%" height="100%" border-radius="8"></u-image>
								</view>
							</view>
							<view class="order_ProName" @click="jumpToDetail('payed', oidx, pidx)">
								{{product.ProName}}
							</view>
							<view class="order_ProQuantity">
								<view class="order_ProQuantity_r">¥ {{product.AllMoney}}</view>
								<view class="order_ProQuantity_s">x{{product.Pronum}}</view>
							</view>
						</view>
						<view class="order_xj">小计: {{parseFloat(order.Ordersamount).toFixed(2)}}</view>
					</view>
					<u-loadmore :status="orderList.payed.loadStatus" @loadmore="getOrderList()" bg-color="transparent" />
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view  scroll-y="true" @scrolltolower="onreachBottom" >
					<view class="order" v-for="(order, oidx) in orderList.needpay.orders" :key="order.id.toString().concat('_needpay')">
						<view class="order_ProItem" v-for="(product, pidx) in order.cartList" :key="product.CartId.toString().concat('_needpay')">
							<view class="order_ProImg" @click="jumpToDetail('needpay', oidx, pidx)">
								<view class="order_ProImg1">
									<u-image :src="product.Thumbnails" width="100%" height="100%" border-radius="8"></u-image>
								</view>
							</view>
							<view class="order_ProName" @click="jumpToDetail('needpay', oidx, pidx)">
								{{product.ProName}}
							</view>
							<view class="order_ProQuantity">
								<view class="order_ProQuantity_r">¥ {{product.AllMoney}}</view>
								<view class="order_ProQuantity_s">x{{product.Pronum}}</view>
							</view>
						</view>
						<view class="order_xj">小计: {{parseFloat(order.Ordersamount).toFixed(2)}}</view>
					</view>
					<u-loadmore :status="orderList.needpay.loadStatus" @loadmore="getOrderList()" bg-color="transparent" />
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					name: '全部'
				}, {
					name: '已付款'
				}, {
					name: '待付款'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的,
				uid: "",
				orderList: {
					current: "",
					all: {
						loadStatus: "loadmore",
						cpage: 1,
						psize: 5,
						orders: []
					},
					needpay: {
						loadStatus: "loadmore",
						cpage: 1,
						psize: 5,
						orders: []
					},
					payed: {
						loadStatus: "loadmore",
						cpage: 1,
						psize: 5,
						orders: []
					}
				}
			};
		},
		onLoad() {
			this.uid = this.$store.state.vuex_user.userId;
			this.orderList.current = "all";
			this.getOrderList();
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
				this.current = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				//this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				//this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;

				switch (this.current) {
					case 0:
					this.orderList.current = "all";
						break;
					case 1:
					this.orderList.current = "payed";
						break;
					case 2:
					this.orderList.current = "needpay";
						break;
					default:
						break;
				}
				if (this.orderList[this.orderList.current].orders.length == 0) {
					this.getOrderList();
				}
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				this.getOrderList();
			},
			getOrderList() {
				const that = this;
				let currListName = that.orderList.current;
				let currList = that.orderList[currListName];
				let reqData = {
					uid: that.uid,
					fast: currListName,
					cpage: currList.cpage,
					psize: currList.psize
				};
				if (currList.loadStatus == "loading") {
					return;
				}
				currList.loadStatus = "loading";
				that.$u.get("order_list", reqData).then(res => {
					let cartArr = res.addon;
					let orderArr = res.result;
					if (orderArr.length == 0) {
						currList.loadStatus = "nomore";
						return;
					}

					for (let i = 0; i < orderArr.length; i++) {
						const order = orderArr[i];
						order.cartList = [];

						let orderCart = cartArr.filter(currItem => currItem.ID == order.id);
						for (let j = 0; j < orderCart.length; j++) {
							const product = JSON.parse(JSON.stringify(orderCart[j]));
							product.Thumbnails = that.$u.http.config.baseUrl + product.Thumbnails;
							order.cartList.push(product);
						}
						if (orderCart.length == 0 && order.OrderNo.startsWith("RC")) {
							order.cartList.push({
								CartId: -1,
								ProID: -1,
								AllMoney: order.Ordersamount,
								Thumbnails: that.$u.http.config.baseUrl + "/UploadFiles/nopic.svg",
								ProName: "余额充值" + parseFloat(order.Ordersamount).toFixed(2),
								Pronum: 1,
								ID: order.id
							});
						}

						currList.orders.push(order);
					}
					currList.cpage++;
					currList.loadStatus = "loadmore";
				});
			},
			jumpToDetail(type, oidx, pidx) {
				let product = this.orderList[type].orders[oidx].cartList[pidx];
				if (product.ProID < 0) {
					return;
				}
				uni.navigateTo({
					url: "/pages/shop/shop_item?id=" + product.ProID
				});
			}
		}
	};
</script>

<style lang="scss">
page{background: #f3f3f3;}
swiper{min-height:calc(100vh - 88rpx);}
scroll-view{height:100%;}
.u-load-more-wrap{height:60rpx !important;}
.protag{color: rgb(19,158,169);}

.order{margin: 15rpx; padding: 15rpx 25rpx; background: #fff; border-radius: 8rpx;}
.order_ProItem{display: flex; justify-content: space-between; align-items: center; padding: 10rpx 0; margin-bottom: 20rpx;}
.order_ProImg{display: flex; align-items: center; width: 220rpx;}
.order_ProImg1{width: 120rpx; height: 120rpx;}
.order_ProName{width: 100%;}
.order_ProQuantity{width: 150rpx; position: relative; text-align: right;}
.order_ProQuantity_r{color: #fa3534;}
.order_ProQuantity_s{position: absolute; bottom: -100%; right: 0; color: #a0a0a0;}
.order_xj{font-weight: 700; text-align: right; color: #fa3534;}
</style>
