<template>
	<view>
		<scroll-view scroll-y="true" @scroll="pageScroll" style="height: 100vh;">
			<view class="enjoy_item">
				<view class="enjoy_item_h1">{{article.title || "---"}} </view>
				<view class="enjoy_item_about">
					<view class="mr_10rpx" style="display:inline-block;" @click="share.show = true;">
						<u-icon name="share"></u-icon>分享
					</view>
					<view class="mr_10rpx" style="display: inline-block;">
						<view v-if="isStar" @click="unstar">
							<u-icon name="star-fill"></u-icon>已收藏
						</view>
						<view v-else @click="star">
							<u-icon name="star"></u-icon>收藏
						</view>
					</view>
					<view style="display:inline-block;">{{article.createTime || "xx年xx月xx日"}}</view>
				</view>
				<view :class="needpay ? 'truncate' : ''">
					<u-parse class="enjoy_item_con" :html="article.content"></u-parse>
					<view class="truncate-mask" v-if="needpay">
						<view class="truncate-mask-title">剩余{{(article.content || {}).length || "???"}}字，需要5积分</view>
						<view class="truncate-mask-buy" @click="buyArticle">购买观看</view>
						<view class="truncate-mask-arrow">
							<u-icon name="arrow-down"></u-icon>
						</view>
					</view>
				</view>

				<view style="padding: 26rpx;">
					<!-- 空白间距 -->
				</view>

				<view class="enjoy_item_comments">
					<view class="enjoy_item_comments_title">
						<text>精彩评论</text>
						<text @click="$u.route('/pages/home/enjoy_item_comments?id=' + article.generalId)">查看更多评论 <u-icon name="arrow-right-double"></u-icon></text>
					</view>
					<view class="enjoy_item_comments_lst">
						<view class="enjoy_item_comments_lstitem" v-for="(item, index) in comments" :key="index">
							<view class="enjoy_item_comment_content">{{item.PubContent}}</view>
							<view class="enjoy_item_comment_people">{{item.PubInputer}}</view>
						</view>
						<view v-if="!comments.length">
							<view style="display:flex; justify-content:center; align-items:center; height:200rpx; font-size:32rpx;">暂无评论</view>
						</view>
					</view>
				</view>

				<view class="enjoy_item_any">
					<text>精装细裱找字研社</text>
					<p>中国独家从字库研发到装裱全产业链机构</p>
					<view class="enjoy_item_con_btn">
						<u-button type="info" @click="$u.route('/pages/channel/biao')">字研精裱何不同</u-button>
						<u-button type="info" @click="$u.route('/pages/shop/shop')">立即下单装裱</u-button>
					</view>
				</view>
			</view>
		</scroll-view>

		<u-popup v-model="share.show" mode="bottom" :border-radius="14">
			<view style="padding:24rpx 30rpx;">
				<view style="margin-bottom:20rpx; text-align:center; font-size:34rpx;">分享</view>
				<view class="u-flex" style="padding-bottom:30rpx; color:#19BE6B;">
					<view style="margin-right:50rpx;" @click="doShare('weixin_session')">
						<u-icon name="weixin-fill" :size="70"></u-icon>
					</view>
					<view @click="doShare('weixin_timeline')">
						<u-icon name="comments" :size="70"></u-icon>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				article: {},
				starReqData: {},
				isStar: false,
				hisUpdate: {
					isUpdated: false,
					isUpdating: false,
					updateTimer: null
				},
				needpay: true, //指示是否需要购买后阅读
				price: 5, //价格
				share: {
					show: false
				},
				comments: []
			}
		},
		onLoad(options) {
			const that = this;
			let mu = this.$store.state.vuex_user;

			// 文章基本信息
			that.$u.get("content_get", {
				id: options.id,
				uid: (mu || {}).userId
			}).then(res => {
				that.needpay = res.retmsg == "needpay";
				console.log(res.retmsg)

				let data = res.result[0];
				data.createTime = data.createTime.toString().replace(/T/g, " ");
				that.article = data;
				for (let i = 1; i < res.result.length; i++) {
					that.article.content += res.resuslt[i].content;
				}
				uni.setNavigationBarTitle({
					title: that.article.title
				});
				that.starReqData.title = that.article.title;

				// 文章节点信息 - 获得付费文章所需点数
				that.$u.get("node_get", {
					id: that.article.nodeId
				}).then(res => {
					that.price = res.result.ConsumePoint;
				});
			}).catch(err => {
				uni.showModal({
					title: err.retmsg,
					showCancel: false,
					success: function() {
						uni.navigateBack();
					}
				});
			});

			this.hisUpdate.updateTimer = setTimeout(function() {
				that.uphis();
			}, 1000 * 30);

			// 文章评论
			this.$u.get("pub_list", {
				pubid: 7,
				cid: options.id,
				psize: 5
			}).then(res => {
				let data = res.result;
				for (let i = 0; i < data.length; i++) {
					that.comments.push(data[i]);
				}
			});

			// 验证登录
			if (!this.$zoomla.isLogin(false)) {
				return;
			}

			// 用户是否收藏文章
			this.starReqData = {
				uid: mu.userId,
				id: options.id,
				type: 1
			};
			this.$u.get("user_star_is", this.starReqData).then(res => {
				that.isStar = res.result != 0;
			});
		},
		onUnload() {
			if (this.hisUpdate.updateTimer) {
				try {
					clearTimeout(this.hisUpdate.updateTimer);
				} catch (e) {}
			}
		},
		methods: {
			// 收藏
			star() {
				const that = this;
				if (!this.$zoomla.isLogin()) {
					return;
				}

				this.$u.post("user_star_add", this.starReqData).then(res => {
					that.isStar = true;
				});
			},
			// 取消收藏
			unstar() {
				const that = this;
				if (!this.$zoomla.isLogin()) {
					return;
				}

				this.$u.post("user_star_del", this.starReqData).then(res => {
					that.isStar = false;
				});
			},
			// 页面滚动
			pageScroll(event) {
				if (event.detail.scrollTop < 200) {
					return;
				}
				this.uphis();
			},
			// 更新点击数
			async uphis() {
				if (this.hisUpdate.isUpdating || this.hisUpdate.isUpdated) {
					return;
				}
				this.hisUpdate.isUpdating = true;
				let req = this.$u.post("content_uphis", {
					id: this.article.generalId,
				}).then(res => {
					this.hisUpdate.isUpdated = true;
					this.hisUpdate.isUpdating = false;
					try {
						clearTimeout(this.hisUpdate.updateTimer);
						this.hisUpdate.updateTimer = null;
					} catch (e) {}
				}).catch(res => {
					this.hisUpdate.isUpdating = false;
				});
				let reqRes = await req;
			},
			// 分享
			doShare(mode) {
				uni.showLoading({
					title: "请稍等"
				});
				const functions = {
					"weixin_session": function() {
						const that = this;
						uni.share({
							provider: "weixin",
							scene: "WXSceneSession",
							type: 0,
							href: this.$u.http.config.baseUrl + "/Item/" + this.article.generalId,
							title: this.article.title,
							summary: this.article.synopsis || (this.article.content.replace(/<[^<>]+>/g,
								"").substr(30) + "..."),
							imageUrl: this.$u.http.config.baseUrl + this.article.topImg,
							success: function() {
								uni.hideLoading();
								that.share.show = false;
							}
						});
					},
					"weixin_timeline": function() {
						const that = this;
						uni.share({
							provider: "weixin",
							scene: "WXSenceTimeline",
							type: 0,
							href: this.$u.http.config.baseUrl + "/Item/" + this.article.generalId,
							title: this.article.title,
							summary: this.article.synopsis || (this.article.content.replace(/<[^<>]+>/g,
								"").substr(30) + "..."),
							imageUrl: this.$u.http.config.baseUrl + this.article.topImg,
							success: function() {
								uni.hideLoading();
								that.share.show = false;
							}
						});
					}
				};

				(functions[mode] || function() {
					uni.hideLoading();
				}).apply(this);
			},
			// 购买本文
			buyArticle() {
				const that = this;
				this.$u.post("payment_content", {
					uid: this.$store.state.vuex_user.userId,
					id: this.article.generalId
				}).then(res => {
					uni.showToast({
						title: "购买成功",
						icon: "none"
					});
					that.needpay = false;
				}).catch(err => {
					uni.showModal({
						title: err.retmsg,
						showCancel: false
					});
				});
			}
		},
		onReady() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#0F0F11',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			});
		},
	}
</script>
<style lang="scss">
	page {
		background: #0F0F11;
		color: #a3a3a3;
	}

	.truncate {
		height: 800rpx;
		position: relative;
		overflow: hidden;
	}

	.truncate-mask {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		width: 100%;
		height: 300rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .85) 50%);
	}

	.truncate-mask-title {
		margin-bottom: 30rpx;
		font-size: 36rpx;
		color: #ffc107;
	}

	.truncate-mask-buy {
		font-size: 32rpx;
	}

	.enjoy_item_comments {
		padding: 30rpx 0;
	}

	.enjoy_item_comments_title {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 20rpx;
		font-size: 36rpx;
		color: #F5F5F5;

		>text:last-child {
			color: #ccc;
			font-size: 28rpx;
		}
	}

	.enjoy_item_comments_lstitem:not(:last-child) {
		margin-bottom: 20rpx;
	}

	.enjoy_item_comment_content {
		display: flex;
		min-height: 50rpx;
		font-size: 28rpx;
		font-style: italic;
	}

	.enjoy_item_comment_people {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 30rpx;
	}

	.enjoy_item_comment_people::before {
		content: "";
		display: inline-block;
		width: 80rpx;
		height: 2rpx;
		margin-right: 10rpx;
		background: #aaa;
	}
</style>
