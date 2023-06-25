<template>
	<view class="index_list_price2" @click="addToCart()">
			<u-image :src="src1" height="60rpx" width="60rpx"></u-image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src1: '/static/images/shoppingcartadd.png',
			}
		},
		props: [ "proId" ],
		methods: {
			addToCart() {
				if (!this.$u.B_User.isLogin()) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}
				// 加入购物车
				this.$u.post("cart_add", {
					proID:  this.proId,
					proNum: 1,
					openid: this.$u.B_User.get().openid
				}).then(res => {
					if (res.retcode == 1) {
						uni.showToast({
							title: '加入购物车成功',
							icon: 'none'
						});
						this.EventBus.$emit("cartHaveChange");
					} else {
						uni.showToast({
							title: '加入购物车失败',
							icon: 'none'
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
.index_list_price2 {margin-right: 30rpx; margin-top: -10rpx;}
</style>
