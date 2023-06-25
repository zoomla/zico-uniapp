<template>
	<view>
		<view class="vd_page_head">
			<view class="vd_page_title">模板市场</view>
			<view class="vd_page_title2">选择一个模板开始创建你的应用</view>
		</view>
		<view class="board_list vd_page_main">
			<view class="board_list_item" v-for="item in boards.list">
				<view class="board_info">
					<view class="board_badge" v-if="item.Status == 100"></view>
					<view class="board_preview" @click="chooseBoard(item)">
						<image class="board_preview_img" :src="item.PreviewImg"></image>
					</view>
					<view class="board_score">
						<u-rate :count="5" :allow-half="true" :size="36"
							:active-color="'#f9ae3d'" :inactive-color="'#c8c9cc'"
							:value="item.Score" :disabled="true"></u-rate>
					</view>
					<view class="board_name">
						[<text>{{item.TypeName}}</text>]
						<text>{{item.Name}}</text>
					</view>
					<view class="board_author">
						<text>创作者：</text>
						<text>{{item.UserName}}</text>
					</view>
					<view class="board_addon">
						<view class="board_price" v-if="item.Price == 0">免费</view>
						<view class="board_price" v-else>{{parseFloat(item.Price).toFixed(2)}} <u-icon name="rmb"></u-icon></view>
						<view class="board_opera">
							<u-icon name="ie"></u-icon>
							<text>预览</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="boards.loadstat" @loadmore="getList()" style="margin-bottom:20rpx;"></u-loadmore>
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
				types: [],
				boards: {
					cpage: 1,
					psize: 10,
					list: [],
					loadstat: "loadmore"
				}
			}
		},
		onLoad() {
			const that = this;
			this.$u.get("vd_board_types", {
			}).then(res => {
				that.types.push.apply(that.types, res.result);
				that.getList();
			}).catch(err => {
				that.getList();
			});
		},
		onReachBottom() {
			this.getList();
		},
		onPullDownRefresh() {
			const that = this;
			if (this.boards.loadstat != "loadmore") {
				uni.stopPullDownRefresh();
				return;
			}

			this.$u.get("vd_board_types", {
			}).then(res => {
				let data = res.result;
				// 差量更新
				for (let i = 0; i < data.length; i++) {
					const item = data[i];
					let eIdx = that.types.findIndex(curr => curr.ID == item.ID);
					if (eIdx == -1) {
						that.types.push(item);
						continue;
					}
					that.types[eIdx].Name = item.Name;
				}
			});

			this.boards.cpage = 1;
			this.boards.list.splice(0, this.boards.list.length);
			this.getList();
		},
		methods: {
			getList() {
				const ins = this.boards;
				if (ins.loadstat == "loading" || ins.loadstat == "nomore") {
					return;
				}
				ins.loadstat = "loading";

				const that = this;
				this.$u.get("vd_board_list", {
					cpage: ins.cpage,
					psize: ins.psize
				}).then(res => {
					let data = res.result;

					let hasUpd = false;
					for (let i = 0; i < data.length; i++) {
						const item = data[i];
						if (ins.list.findIndex(curr => curr.ID == item.ID) > -1) {
							continue;
						}
						_extendItem(item);
						ins.list.push(item);
						hasUpd = true;
					}

					uni.stopPullDownRefresh();
					if (data.length >= ins.psize) {
						ins.cpage++;
					}
					ins.loadstat = "loadmore";
					if (data.length == 0 || !hasUpd) {
						ins.loadstat = "nomore";
						setTimeout(function() {
							ins.loadstat = "loadmore";
						}, 2000);
					}
				}).catch(err => {
					ins.loadstat = "loadmore";
				});

				const _extendItem = function(item) {
					item.PreviewImg = that.$u.http.config.baseUrl + (item.PreviewImg || "/UploadFiles/nopic.svg");

					item.TypeName = "";
					var typeIds = item.TypeID.split(",");
					for (let i = 0; i < typeIds.length; i++) {
						var type = that.types.find(curr => curr.ID == typeIds[i]);
						if (type) {
							item.TypeName += "," + type.Name;
						}
					}
					if (item.TypeName) {
						item.TypeName = item.TypeName.substring(1);
					} else {
						item.TypeName = "未分类";
					}
				};
			},
			chooseBoard(item) {
				this.$u.get("vd_board_canuse", {
					id: item.ID,
					uid: this.uid
				}).then(res => {
					uni.redirectTo({
						url: "worktable?tlp=" + item.ID,
					});
				}).catch(err => {
					uni.showToast({
						title: "使用失败 " + err.retmsg,
						icon: "none"
					});
				});
			},
		}
	}
</script>

<style lang="scss">
.board_list{display:flex; flex-wrap:wrap;}
.board_list_item{flex-shrink:0; width:50%; padding-bottom:32rpx;}
.board_list .board_list_item:nth-child(odd){padding-right:16rpx;}
.board_list .board_list_item:nth-child(even){padding-left:16rpx;}
.board_info{width:100%; position:relative; box-shadow:0 2rpx 16rpx 0 rgba(0,0,0, .15); border-radius:8rpx; overflow:hidden;}
.board_preview{margin-bottom:12rpx; border-bottom:2rpx solid #f4f4f5;}
.board_preview_img{width:100%; height:270rpx;}
.board_score{margin-bottom:10rpx; padding:0 14rpx;}
.board_name{height:64rpx; margin-bottom:14rpx; padding:0 18rpx; font-size:26rpx;}
.board_name>text:first-child{color:#18b566;}
.board_name>text:first-child.disable{color:#6c757d;}
.board_name>text:last-child{margin-left:8rpx;}
.board_author{margin-bottom:8rpx; padding:0 18rpx; font-size:26rpx;}
.board_author>text{color:#767a82;}
.board_author>text:last-child{color:#2b85e4;}
.board_addon{display:flex; justify-content:space-between; padding:0 18rpx 14rpx 18rpx;}
.board_price{color:#fa3534; font-size:30rpx;}
.board_opera{display:flex; align-items:center; color:#3c9cff;}
.board_opera>text:last-child{margin-left:6rpx; font-size:26rpx;}
.board_badge{position:absolute;}
</style>
