<template>
	<view class="vd_page">
		<view class="vd_page_head">
			<view class="vd_page_title">资产中心</view>
			<view class="vd_page_title2">管理应用与模板</view>
		</view>
		<view class="vd_page_main">
			<u-tabs-swiper ref="tabs" :list="tabs.list" :bold="false" :current="tabs.current" @change="tabsChange" :active-color="'#3c9cff'"></u-tabs-swiper>
			<swiper :current="tabs.swiperCurrent"  @transition="tabsSwiperTransition" @animationfinish="tabsSwiperAnimationfinish" style="height:100%;">
				<!-- 应用 -->
				<swiper-item style="height:100%;">
					<scroll-view scroll-y class="app_list">
						<view class="app_list_item" v-for="item in sites.list">
							<view class="app_name">{{item.appName}}</view>
							<view class="app_times">
								<view>
									<text>创建于：</text>
									<text style="color:#303133;">{{$u.timeFormat(item.createTime, "yyyy-mm-dd hh:MM:ss")}}</text>
								</view>
								<view>
									<text>最后更新于：</text>
									<text style="color:#303133;">{{$u.timeFormat(item.updateTime, "yyyy-mm-dd hh:MM:ss")}}</text>
								</view>
								<view>
									<text>发布状态：</text>
									<text v-if="item.publishStatus == -1" style="color:#fa3534;">发布失败</text>
									<text v-if="item.publishStatus == 99" style="color:#18b566;">已发布</text>
									<text v-else style="color:#2979ff;">未发布</text>
								</view>
							</view>
							<view class="app_opera">
								<view class="app_opera_item" style="color:#e45656"><u-icon class="app_opera_item_ico" name="trash"></u-icon>删除</view>
								<view class="app_opera_item" @click="siteDesign(item)"><u-icon class="app_opera_item_ico" name="play-circle"></u-icon>设计</view>
								<view class="app_opera_item" @click="siteEdit(item)"><u-icon class="app_opera_item_ico" name="list-dot"></u-icon>管理</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<!-- 模板 -->
				<swiper-item style="height:100%;">
					<scroll-view scroll-y class="app_list">
						<view class="app_list_item" v-for="item in boards.list">
							<view class="app_badge" v-if="item.Status == 0">待审核</view>
							<view class="app_badge" style="background:#f9ae3d;" v-else-if="item.Status == 100">已推荐</view>
							<view class="app_name">{{item.Name}}</view>
							<view class="app_times">
								<view>
									<text>创建于：</text>
									<text style="color:#303133;">{{$u.timeFormat(item.CreateTime, "yyyy-mm-dd hh:MM:ss")}}</text>
								</view>
								<view>
									<text>最后更新于：</text>
									<text style="color:#303133;">{{$u.timeFormat(item.UpdateTime, "yyyy-mm-dd hh:MM:ss")}}</text>
								</view>
								<view>
									<text>售价：</text>
									<text v-if="item.Price > 0" style="color:#fa3534;">{{item.Price}}</text>
									<text v-else style="color:#fa3534;">免费</text>
								</view>
								<view>
									<text>星级评价：</text>
									<u-rate :count="5" :allow-half="true" :size="36"
										:active-color="'#f9ae3d'" :inactive-color="'#c8c9cc'"
										:value="item.Score" :disabled="true"></u-rate>
								</view>
							</view>
							<view class="app_opera">
								<view class="app_opera_item" style="color:#e45656"><u-icon class="app_opera_item_ico" name="trash"></u-icon>删除</view>
								<view class="app_opera_item" @click="boardDesign(item)"><u-icon class="app_opera_item_ico" name="play-circle"></u-icon>设计</view>
								<view class="app_opera_item" @click="boardEdit(item)"><u-icon class="app_opera_item_ico" name="list-dot"></u-icon>编辑</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<vd-tabbar></vd-tabbar>
	</view>
</template>

<script>
	import tabbar from "@/components/vdesign/menu.vue";
	export default {
		components: {
			"vd-tabbar": tabbar
		},
		data() {
			return {
				uid: this.$store.state.vuex_user.userId, // 当前登录用户id
				tabs: {
					current: 0,
					swiperCurrent: 0,
					list: [
						{name: "我的应用"},
						{name: "我的模板"},
					]
				},
				boards: {
					types: [],
					cpage: 1,
					psize: 10,
					list: [],
					loadstat: "loadmore"
				},
				sites: {
					cpage: 1,
					psize: 10,
					list: [],
					loadstat: "loadmore"
				}
			};
		},
		onLoad() {
			this.getBoardList();
			this.getSiteList();
		},
		onPullDownRefresh() {
			if (this.sites.loadstat != "loading") {
				this.sites.loadstat = "loadmore";
				this.sites.list.splice(0, this.sites.list.length);
				this.getSiteList();
			}
			if (this.boards.loadstat != "loading") {
				this.boards.loadstat = "loadmore";
				this.boards.list.splice(0, this.boards.list.length);
				this.getBoardList();
			}

			const that = this;
			var timer = setInterval(function () {
				if (!that.sites.loadstat == "loading") {
					return;
				}
				if (!that.boards.loadstat == "loading") {
					return;
				}
				uni.stopPullDownRefresh();
				clearInterval(timer);
			}, 30);
		},
		methods: {
			getBoardList() {
				const ins = this.boards;
				if (ins.loadstat == "loading" || ins.loadstat == "nomore") {
					return;
				}
				ins.loadstat = "loading";

				const that = this;
				this.$u.post("vd_board_list", {
					uid: this.uid,
					cpage: ins.cpage,
					psize: ins.psize,
					status: "0,99,100"
				}).then(res => {
					let data = res.result;

					for (let i = 0; i < data.length; i++) {
						const item = data[i];
						if (ins.list.findIndex(curr => curr.ID == item.ID) > -1) {
							continue;
						}
						ins.list.push(item);
					}

					if (data.length >= ins.psize) {
						ins.cpage++;
					}
					ins.loadstat = "loadmore";
					if (data.length == 0) {
						ins.loadstat = "nomore";
						setTimeout(function() {
							ins.loadstat = "loadmore";
						}, 2000);
					}
				}).catch(err => {
					ins.loadstat = "loadmore";
				});
			},
			getSiteList() {
				const ins = this.sites;
				if (ins.loadstat == "loading" || ins.loadstat == "nomore") {
					return;
				}
				ins.loadstat = "loading";

				const that = this;
				this.$u.get("vd_site_list", {
					uid: this.uid
				}).then(res => {
					let data = res.result;

					for (let i = 0; i < data.length; i++) {
						const item = data[i];
						if (ins.list.findIndex(curr => curr.id == item.id) > -1) {
							continue;
						}
						ins.list.push(item);
					}

					if (data.length >= ins.psize) {
						ins.cpage++;
					}
					ins.loadstat = "loadmore";
					if (data.length == 0) {
						ins.loadstat = "nomore";
						setTimeout(function() {
							ins.loadstat = "loadmore";
						}, 2000);
					}
				}).catch(err => {
					ins.loadstat = "loadmore";
				});
			},

			//----------------- 页面跳转
			// 跳转到应用设计
			siteDesign(item) {
				uni.redirectTo({
					url: "worktable?id=" + item.id
				});
			},
			// 跳转到应用信息管理
			siteEdit(item) {
				uni.navigateTo({
					url: "my_site?id=" + item.id
				})
			},
			// 跳转到模板设计
			boardDesign(item) {
				uni.redirectTo({
					url: "worktable?istlp=1&id=" + item.ID
				});
			},
			// 跳转到模板信息管理
			boardEdit(item) {
				uni.navigateTo({
					url: "my_board?id=" + item.ID
				})
			},

			//----------------- UI
			tabsChange(index) {
				this.tabs.swiperCurrent = index;
			},
			tabsSwiperTransition({ detail: { dx } }) {
				this.$refs.tabs.setDx(dx);
			},
			tabsSwiperAnimationfinish({ detail: { current } }) {
				this.$refs.tabs.setFinishCurrent(current);
				this.tabs.swiperCurrent = current;
				this.tabs.current = current;
			},
		}
	}
</script>

<style lang="scss">
page,.vd_page{height:100%;}
.vd_page_head{flex-shrink:0; margin-bottom:0;}
.vd_page_main{display:flex; flex-flow:column; flex:1;}
.menu{flex-shrink:0;}

.app_list{height:100%; width:100%;}
.app_list_item{margin:34rpx 8rpx; padding:24rpx 22rpx; position:relative; box-shadow:0 2rpx 16rpx 0 rgba(0,0,0, .15); border-radius:8rpx; overflow:hidden;}
.app_name{margin-bottom:28rpx; font-size:36rpx; font-weight:bold;}
.app_times{margin-bottom:36rpx; color:#6c757d; font-size:26rpx;}
.app_times>view{display:flex; justify-content:space-between; margin-bottom:6rpx;}
.app_opera{display:flex; justify-content:space-between; padding:18rpx 0 4rpx 0; border-top:2rpx solid #dee2e6;}
.app_opera_item{display:flex; align-items:center; font-size:28rpx; color:#495057;}
.app_opera_item_ico{margin-right:6rpx; font-size:34rpx;}
.app_badge{width:200rpx; height:40rpx; padding-right:40rpx; position:absolute; top:4rpx; right:-30rpx; text-align:right; background:#3c9cff; color:#fff; transform:rotate(25deg);}
</style>
