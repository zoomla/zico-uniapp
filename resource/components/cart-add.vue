<template>
	<view @click="addToCart()">
    <i class="zi zi_cartarrowPlus" zico="购物车加号"></i>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		props: [ "proId" ],
		methods: {
			addToCart() {
				if (!this.$zoomla.isLogin()) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}
				// 加入购物车
				let mu = this.$store.state.vuex_user;
				this.$u.post("cart_add", {
					proID:  this.proId,
					proNum: 1,
					uid: mu.userId
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
.zi{font-size: 46rpx;opacity: .4;}
</style>
