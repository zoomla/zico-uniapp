<template>
	<view>
		<scroll-view style="height: 100vh;" scroll-y="true" @scrolltolower="getProduct">
			<view class="shop_class">
				<view class="shop_class_list" v-for="(item, index) in products" :key="index">
					<navigator :url="'../shop/shop_item?id='+item.ID" hover-class="navigator-hover">
						<view class="shop_class_list_img">
							<u-image :src="item.Thumbnails" height="100%"></u-image>
						</view>
						<view class="shop_class_list_title">{{item.Proname}}</view>
					</navigator>
					<view class="shop_class_list_price">
						<view class="shop_class_list_price1">¥ <view class="shop_class_list_price1_j">{{item.LinPrice}}</view></view>
						<cart-add :proId="item.ID"></cart-add>
					</view>
				</view>
			</view>
			<u-loadmore :status="loadStatus" @loadmore="getProduct" bg-color="transparent" />
		</scroll-view>
		<cart-footer></cart-footer>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				nodeId: 0,
				cpage: 1,
				psize: 8,
				loadStatus: "loadmore",
				products: []
			};
		},
		onLoad(options) {
			this.nodeId = options.nid;

			this.$u.get("node_get", {
				id: this.nodeId
			}).then(res => {
				if (res.retcode != 1) {
					return;
				}
				uni.setNavigationBarTitle({
					title: res.result.NodeName
				});
			});
			this.getProduct();
		},
		methods: {
			jumpToCart() {
				uni.navigateTo({
					url: "../share/cart"
				});
			},
			getProduct() {
				const that = this;
				that.loadStatus = "loading";
				that.$u.get("product_list", {
					nid: that.nodeId,
					cpage: that.cpage,
					psize: that.psize
				}).then(res => {
					if (res.retcode != 1) {
						return;
					}
					let data = res.result;
					if (data.length == 0) {
						that.loadStatus = "nomore";
						return;
					}

					for (let i = 0; i < data.length; i++) {
						const item = data[i];
						item.Proname = (item.Proname.length > 22 ? item.Proname.substr(0, 22) + "..." : item.Proname);
						that.products.push(item);
					}
					that.cpage++;
					that.loadStatus = "loadmore";
				});
			},
			addToCart(id) {
				if (!this.$zoomla.isLogin()) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}
				// 加入购物车
				this.$u.post("cart_add", {
					proID: id,
					proNum: 1,
					uid: this.$store.state.vuex_user.userId
				}).then(res => {
					if (res.retcode == 1) {
						uni.showToast({
							title: '加入购物车成功',
							icon: 'none'
						});
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

<style>
page{background: #f5f5f5;}
</style>
