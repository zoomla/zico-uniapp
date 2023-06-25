<template>
	<view class="vd_page">
		<view style="padding:22rpx 26rpx 32rpx 26rpx; font-size:38rpx;">{{form.name}}</view>
		<view class="vd_page_main">
			<u-tabs-swiper ref="tabs" :list="tabs.list" :bold="false" :current="tabs.current" @change="tabsChange" :active-color="'#3c9cff'"></u-tabs-swiper>
			<swiper :current="tabs.swiperCurrent"  @transition="tabsSwiperTransition" @animationfinish="tabsSwiperAnimationfinish" style="height:100%;">
				<!-- 基本信息 -->
				<swiper-item style="height:100%;">
					<scroll-view scroll-y class="content_list">
						<view class="form-item form-require">
							<view class="form-label">名称</view>
							<view class="form-control">
								<u-input v-model="form.name"></u-input>
							</view>
						</view>
						<view class="form-item">
							<view class="form-label">创建时间</view>
							<view class="form-control">
								<u-input v-model="form.createTime" :disabled="true"></u-input>
							</view>
						</view>
						<view class="form-item">
							<view class="form-label">更新时间</view>
							<view class="form-control">
								<u-input v-model="form.updateTime" :disabled="true"></u-input>
							</view>
						</view>
						<view class="form-item">
							<view class="form-label">发布状态</view>
							<view class="form-control">
								<u-input v-model="formViewPublishStatus" :disabled="true"></u-input>
							</view>
						</view>
						<view class="form-item">
							<view class="form-label">发布时间</view>
							<view class="form-control">
								<u-input v-model="form.publishTime" :disabled="true"></u-input>
							</view>
						</view>
						<view style="padding-top: 20rpx;">
							<view class="form-btn form-btn-ok" @click="save()">保存</view>
							<view class="form-btn form-btn-warn" @click="publish()">发布</view>
						</view>
					</scroll-view>
				</swiper-item>
				<!-- 绑定文章 -->
				<swiper-item style="height:100%;">
					<scroll-view scroll-y class="content_list" @scrolltolower="articleListGet()">
						<view class="content_list_item" v-for="item in articles.list">
							<view class="content_body">
								<view class="content_info">
									<view class="content_title">{{item.Title}}</view>
									<view class="content_times">
										<view>创建于：{{item.CreateTime}}</view>
										<view>点击数：{{item.Hits}}</view>
									</view>
								</view>
							</view>
							<view class="content_opera">
								<view style="color:#398ade;" @click="articleBind(item)" v-if="item.BindId == 0"><u-icon name="lock-open"></u-icon>绑定内容</view>
								<view style="color:#fa3534;" @click="articleBindDel(item)" v-else><u-icon name="lock"></u-icon>解除绑定</view>
							</view>
						</view>
						<u-loadmore :status="articles.loadstat" @loadmore="articleListGet()" style="margin-bottom:20rpx;"></u-loadmore>
					</scroll-view>
				</swiper-item>
				<!-- 绑定商品 -->
				<swiper-item style="height:100%;">
					<scroll-view scroll-y class="content_list">
						<view class="content_list_item" v-for="item in shops.list">
							<view class="content_body">
								<view class="content_img">
									<image :src="item.Thumbnails" style="width:100%; height:100%;"></image>
								</view>
								<view class="content_info">
									<view class="content_title">{{item.Proname}}</view>
									<view class="content_times">
										<view>发布于：{{item.AddTime}}</view>
										<view>点击数：{{item.AllClickNum}}</view>
									</view>
								</view>
							</view>
							<view class="content_opera">
								<view style="color:#398ade;" @click="shopBind(item)" v-if="item.BindId == 0"><u-icon name="lock-open"></u-icon>绑定商品</view>
								<view style="color:#fa3534;" @click="shopBindDel(item)" v-else><u-icon name="lock"></u-icon>解除绑定</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<!-- 访客留言 -->
				<swiper-item style="height:100%;">
					<scroll-view scroll-y class="content_list" @scrolltolower="messageListGet()">
						<view class="content_list_item" v-for="item in messages.list">
							<view class="content_badge" v-if="item.Status == 0">未审核</view>
							<view class="content_body">
								<view class="content_info">
									<view class="content_title">{{item.Poster}}</view>
									<view class="content_times">留言时间：{{item.CreateTime}}</view>
									<view class="content_times">联系方式：{{item.ConcatInfo}}</view>
									<view style="display:flex;">
										<view class="content_times" style="flex-shrink:0;">留言内容：</view>
										<view class="content_times">{{item.Content}}</view>
									</view>
								</view>
							</view>
							<view class="content_opera">
								<view style="color:#398ade;" @click="messageDetail(item)"><u-icon name="info-circle" style="margin-right:4rpx;"></u-icon>查看详情</view>
							</view>
						</view>
						<u-loadmore :status="messages.loadstat" @loadmore="messageListGet()" style="margin-bottom:20rpx;"></u-loadmore>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: this.$store.state.vuex_user.userId, // 当前登录用户id
				tabs: {
					current: 0,
					swiperCurrent: 0,
					list: [
						{name: "基本信息"},
						{name: "绑定文章"},
						{name: "绑定商品"},
						{name: "访客留言"},
					]
				},
				form: {
					id: 0,
					name: "",
					createTime: "",
					updateTime: "",
					publishStatus: "",
					publishTime: "",
				},
				articles: {
					cpage: 1,
					psize: 13,
					list: [],
					loadstat: "loadmore"
				},
				shops: {
					cpage: 1,
					psize: 13,
					list: [],
					loadstat: "loadmore"
				},
				messages: {
					cpage: 1,
					psize: 13,
					list: [],
					loadstat: "loadmore"
				},
			};
		},
		computed: {
			"formViewPublishStatus": {
				get: function() {
					switch(this.form.publishStatus) {
						case -1:
							return "发布失败";
						case 99:
							return "已发布";
						case 0:
						default:
							return "未发布";
					}
				},
				set: function(val) {}
			}
		},
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 2000);
		},
		onLoad(options) {
			this.form.id = options.id;
			this.load();
			this.articleListGet();
			this.shopListGet();
			this.messageListGet();
		},
		methods: {
			load() {
				const that = this;
				this.$u.get("vd_site_get", {
					id: this.form.id
				}).then(res => {
					let data = res.result;
					let form = that.form;
				
					form.id = data.ID;
					form.name = data.AppName;
					form.createTime = that.$u.timeFormat(data.CreateTime, "yyyy-mm-dd hh:MM:ss");
					form.updateTime = that.$u.timeFormat(data.UpdateTime, "yyyy-mm-dd hh:MM:ss");
					form.publishStatus = data.PublishStatus;
					form.publishTime = data.PublishStatus ? that.$u.timeFormat(data.PublishTime, "yyyy-mm-dd hh:MM:ss") : "未发布";
				});
			},
			save() {
				const that = this;
				if (!this.form.name) {
					uni.showToast({
						title: "名称不能为空",
						icon: "none"
					});
					return;
				}

				this.$u.post("vd_site_upd", {
					uid: this.uid,
					id: this.form.id,
					name: this.form.name,
				}).then(res => {
					uni.showToast({
						title: "保存成功",
						icon: "none"
					});
				}).catch(err => {
					let msg = err.retmsg;
					if (!msg) {
						msg = "";
					}

					uni.showToast({
						title: "保存失败 " + msg,
						icon: "none"
					});
				});
			},
			publish() {},

			//----------------- 文章管理
			articleListGet() {
				const ins = this.articles;
				if (ins.loadstat == "loading" || ins.loadstat == "nomore") {
					return;
				}
				ins.loadstat = "loading";

				const that = this;
				this.$u.get("vd_site_article_list", {
					id: this.form.id,
					uid: this.uid,
					mode: "manage",
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
						item.BindId = parseInt(item.BindId) || 0;
						item.CreateTime = that.$u.timeFormat(item.CreateTime, "yyyy-mm-dd");
						ins.list.push(item);
						hasUpd = true;
					}

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
			},
			articleBind(item) {
				this.$u.get("vd_site_article_bind", {
					uid: this.uid,
					id: this.form.id,
					cid: item.GeneralID
				}).then(res => {
					item.BindId = parseInt(res.result) || 0;
				}).catch(err => {
					let msg = err.retmsg;
					if (!msg) {
						msg = "";
					}

					uni.showToast({
						title: "操作失败 " + msg,
						icon: "none"
					});
				});
			},
			articleBindDel(item) {
				this.$u.get("vd_site_article_unbind", {
					uid: this.uid,
					id: this.form.id,
					ids: item.BindId
				}).then(res => {
					item.BindId = 0;
				}).catch(err => {
					let msg = err.retmsg;
					if (!msg) {
						msg = "";
					}

					uni.showToast({
						title: "操作失败 " + msg,
						icon: "none"
					});
				});
			},

			//----------------- 商品管理
			shopListGet() {
				const ins = this.shops;
				if (ins.loadstat == "loading" || ins.loadstat == "nomore") {
					return;
				}
				ins.loadstat = "loading";

				const that = this;
				this.$u.get("vd_site_shop_list", {
					id: this.form.id,
					uid: this.uid,
					mode: "manage",
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
						item.BindId = parseInt(item.BindId) || 0;
						item.AddTime = that.$u.timeFormat(item.AddTime, "yyyy-mm-dd");
						ins.list.push(item);
						hasUpd = true;
					}

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
			},
			shopBind(item) {
				this.$u.get("vd_site_shop_bind", {
					uid: this.uid,
					id: this.form.id,
					cid: item.ID
				}).then(res => {
					item.BindId = parseInt(res.result) || 0;
				}).catch(err => {
					let msg = err.retmsg;
					if (!msg) {
						msg = "";
					}

					uni.showToast({
						title: "操作失败 " + msg,
						icon: "none"
					});
				});
			},
			shopBindDel(item) {
				this.$u.get("vd_site_shop_unbind", {
					uid: this.uid,
					id: this.form.id,
					ids: item.BindId
				}).then(res => {
					item.BindId = 0;
				}).catch(err => {
					let msg = err.retmsg;
					if (!msg) {
						msg = "";
					}

					uni.showToast({
						title: "操作失败 " + msg,
						icon: "none"
					});
				});
			},

			//----------------- 留言管理
			messageListGet() {
				const ins = this.messages;
				if (ins.loadstat == "loading" || ins.loadstat == "nomore") {
					return;
				}
				ins.loadstat = "loading";

				const that = this;
				this.$u.get("vd_site_message_list", {
					id: this.form.id,
					cpage: ins.cpage,
					psize: ins.psize,
					status: -100
				}).then(res => {
					let data = res.result;

					let hasUpd = false;
					for (let i = 0; i < data.length; i++) {
						const item = data[i];
						if (ins.list.findIndex(curr => curr.ID == item.ID) > -1) {
							continue;
						}
						item.Content = item.Content || "未填写";
						item.Content = item.Content.length > 50 ? item.Content.substring(0, 48) + "..." : item.Content;
						item.ConcatInfo = item.ConcatInfo || "未填写";
						item.CreateTime = that.$u.timeFormat(item.CreateTime, "yyyy-mm-dd");
						ins.list.push(item);
						hasUpd = true;
					}

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
			},
			messageDetail(item) {
				uni.navigateTo({
					url: "message_detail?id=" + item.ID
				});
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

<style>
page,.vd_page{height:100%;}
.vd_page_main{display:flex; flex-flow:column; flex:1;}

.content_list{height:100%; width:100%;}
.content_list_item{margin:28rpx 8rpx; padding:20rpx 22rpx; position:relative; box-shadow:0 2rpx 12rpx 0 rgba(0,0,0, .15); border-radius:8rpx; overflow:hidden;}
.content_body{display:flex; margin-bottom:12rpx;}
.content_img{flex-shrink:0; width:120rpx; margin-right:20rpx; border-radius:8rpx; background:#f8f9fa;}
.content_info{}
.content_title{margin-bottom:12rpx; font-size:32rpx;}
.content_times{display:flex; font-size:26rpx; color:#909399;}
.content_times>view{display:inline-flex; align-items:center;}
.content_times>view::after{content:""; display:inline-block; width:6rpx; height:6rpx; margin:0 16rpx; background:#c0c4cc; border-radius:50%;}
.content_times>view:last-child::after{display:none;}
.content_opera{display:flex; justify-content:flex-end; align-items:center;}
.content_badge{width:200rpx; height:40rpx; padding-right:40rpx; position:absolute; top:4rpx; right:-30rpx; text-align:right; background:#3c9cff; color:#fff; transform:rotate(25deg);}
</style>
