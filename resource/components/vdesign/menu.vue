<template>
	<view class="menu">
		<view class="menu-content">
			<view class="menu-list">
				<view :id="'tabmenu_'+item.path.replace(/[\/\#]/g, '_')" class="menu-list-item" v-for="item in menus"
					:class="item.path && current == item.path ? 'active' : ''" @click="goto(item)">
					<view class="menu-ico">
						<u-icon :name="item.icoActived" v-if="item.path && current == item.path"></u-icon>
						<u-icon :name="item.ico" v-else></u-icon>
					</view>
					<view class="menu-name">{{item.name}}</view>
					<!-- 子菜单，采用fixed定位 -->
					<view class="menu-submenu-list" :style="subMenuPosition(item)" v-if="item.submenu && item.submenu.length">
						<view class="menu-submenu-list-item" v-for="subitem in item.submenu"
							@click="subMenuGoto(subitem)">{{subitem.name}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 子菜单蒙布 -->
		<view class="menu-submenu-mask" v-if="current.startsWith('#')" @click="subMenuHide()"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: "",
				currentBackup: "",
				menus: [
					{ name: "模板市场", path: "/pages/vdesign/board", ico: "shopping-cart", icoActived: "shopping-cart-fill" },
					{ name: "设计台", path: "/pages/vdesign/worktable", ico: "integral", icoActived: "integral-fill" },
					{ name: "资产管理", path: "/pages/vdesign/manage", ico: "coupon", icoActived: "coupon-fill" },
					{ name: "更多", path: "#more", ico: "grid", icoActived: "grid-fill", submenuShow: false, submenu: [
						{ name: "回到首页", path: "#exit" },
						{ name: "领福利", path: "/pages/vdesign/prize" },
					] },
				]
			};
		},
		mounted() {
			let pages = getCurrentPages();
			let route = "/" + pages[pages.length - 1].route;
			let exists = this.menus.findIndex(curr => curr.path == route) > -1;
			if (exists) {
				this.currentBackup = this.current = route;
			}
		},
		methods: {
			goto(item) {
				if (!item.path) {
					return;
				}

				if (item.path.startsWith("/")) {
					if (this.current.startsWith("#")) {
						this.subMenuHide();
					}

					if (item.path == this.currentBackup) {
						this.current = item.path;
						return;
					}

					uni.redirectTo({
						url: item.path
					});
				}

				if (item.path.startsWith("#")) {
					this.current = item.path;
					this.submenuShow = true;
				}
			},
			subMenuPosition(item) {
				return {};
			},
			subMenuHide() {
				const that = this;
				this.menus.find(curr => curr.path == that.current).submenuShow = false;
				this.current = this.currentBackup;
			},
			subMenuGoto(item) {
				if (!item.path) {
					return;
				}
				this.subMenuHide();

				if (item.path.startsWith("/")) {
					uni.navigateTo({
						url: item.path
					});
				}

				if (item.path.startsWith("#")) {
					(this[item.path.substring(1)] || function() {}).apply(this);
				}
			},

			//-------------
			exit() {
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
.menu{height:120rpx;}
.menu-content{width:100%; padding:8rpx 12rpx 16rpx 12rpx; position:fixed; z-index:32; bottom:0; background:#fff; border-top:2rpx solid #e9ecef;}
.menu-list{display:flex; justify-content:space-around;}
.menu-list-item{display:flex; flex-flow:column; justify-content:center; align-items:center;}
.menu-list-item.active>.menu-ico,.menu-list-item.active>.menu-name{color:#3c9cff;}
.menu-ico{display:block; font-size:50rpx; color:#909399;}
.menu-name{font-size:24rpx; color:#909399;}
.menu-submenu-mask{display:block; width:100vw; height:100vh; position:fixed; z-index:31; top:0; left:0;}
.menu-submenu-list{display:none; padding:8rpx 20rpx; position:fixed; z-index:32; right:10rpx; bottom:130rpx; background:#fff; border:2rpx solid #dee2e6; border-radius:8rpx;}
.menu-list-item.active .menu-submenu-list{display:block;}
.menu-submenu-list-item{padding:20rpx 16rpx; border-bottom:2rpx solid #dee2e6; text-align:center;}
.menu-submenu-list>.menu-submenu-list-item:last-child{border-bottom:0;}
</style>
