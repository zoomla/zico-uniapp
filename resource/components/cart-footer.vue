<template>
	<view class="shopping show">
		<view class="shopping1" @click="toggleAddons">
			<!-- <u-image :src="src1" height="100%"></u-image> -->
			<i class="zi zi_shoppingcart"></i>
			<u-badge :is-dot="false" type="error" :count="count"></u-badge>
		</view>
		<view class="shopping_addons">
			<view class="shopping_addonsItem no_1" :class="addonsStyleClass" @click="$u.route('/pages/shop/shop')">购</view>
			<view class="shopping_addonsItem no_2" :class="addonsStyleClass" @click="go_live">物</view>
			<view class="shopping_addonsItem no_3" :class="addonsStyleClass" @click="$u.route('/pages/shop/cart')">车</view>
			<view class="shopping_addonsItem no_4" :class="addonsStyleClass" @click="go_ucenter">+</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				count: 0,
				// src1: '/static/images/shoppingcart.png',
				addonsStyleClass: "hide",  //隐藏样式注入
			}
		},
		mounted() {
			const that = this;
			that.EventBus.$on("cartHaveChange", () => {
				that.cartProCount();
			});

			that.cartProCount();
		},
		methods: {
			toggleAddons() {
				if (this.addonsStyleClass == "hide") {
					this.addonsStyleClass = "show";
					return;
				}

				this.addonsStyleClass = "hide";
			},
			cartProCount() {
				if (this.$u.test.isEmpty(this.$store.state.vuex_token)) {
					this.count = 0;
					return;
				}
				const that = this;
				let mu = this.$store.state.vuex_user;
				that.$u.get("cart_list", {
					uid: mu.userId
				}).then(res => {
					if (res.retcode != 1) {
						return;
					}
					that.count = res.result.CartDT.length;
				});
			},
			go_live() {
				uni.switchTab({
					url: '/pages/home/live'
				})
			},	
			go_ucenter() {
				uni.switchTab({
					url: '/pages/home/ucenter'
				})
			},			
		}
	}
</script>
<style lang="scss">
.shopping{position: fixed; z-index: 9; bottom: 100rpx; right: 30rpx; width:115rpx; height:115rpx; border-radius:50%; background: rgba(30,255,255,.6); transition: all .3s ease-in-out; color: #fff;
i{display: inline-block;margin-left:16rpx;margin-top:12rpx; font-size:90rpx;color: #303133; }
}
.shopping1{position: relative; width:100%; height:100%;}
.shopping.show{opacity: 1;pointer-events: all;}
.shopping.hide{opacity: 0;pointer-events: none;}
.zi{color: #fff;}

.shopping_addons{position: relative; width: 0; height: 0; overflow: visible;}
.shopping_addonsItem{position: absolute; top: -100rpx; left: 15rpx; display: flex; justify-content: center; align-items: center; width: 85rpx; height: 85rpx; background: rgba(30,255,255,.7); border-radius: 50%; transition: all .3s ease-in-out}
.shopping_addonsItem.hide{opacity: 0; transform: scale(0) translate(0, 0) rotate(360deg); pointer-events: none;}
.shopping_addonsItem:not(.hide){opacity: 1; pointer-events: all;}
.shopping_addonsItem.no_1:not(.hide){transform: scale(1) translate(25rpx, -130rpx);}
.shopping_addonsItem.no_2:not(.hide){transform: scale(1) translate(-80rpx, -105rpx);}
.shopping_addonsItem.no_3:not(.hide){transform: scale(1) translate(-130rpx, -15rpx);}
.shopping_addonsItem.no_4:not(.hide){transform: scale(1) translate(-100rpx, 85rpx);}
</style>
