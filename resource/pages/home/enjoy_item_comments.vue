<template>
	<view>
		<view class="comment-post">
			<view class="comment-post-title">说说你的看法</view>
			<view>
				<u-input v-model="comment.content" type="textarea" placeholder="写下你此刻的想法" :height="160"
					:auto-height="true" :maxlength="500" :custom-style="{color:'#fff'}"></u-input>
			</view>
			<view class="comment-post-footer">
				<view>{{comment.content.length}}/500</view>
				<view class="u-flex">
					<view>
						<u-checkbox v-model="comment.anonymous" active-color="red">
							<text style="color:#aaa;">匿名</text>
						</u-checkbox>
					</view>
					<view class="comment-post-btn" @click="postPub">发表评论</view>
				</view>
			</view>
		</view>
		<view class="comment-list">
			<view class="comment-list-item" v-for="(item, index) in commentList" :key="index">
				<view class="comment-inputer">{{item.PubInputer}}</view>
				<view class="comment-content">{{item.PubContent}}</view>
				<view class="comment-addtime">{{$zoomla.timeFormat(item.PubAddTime)}}</view>
			</view>
			<u-loadmore :status="loadStatus" color="#aaa" @loadmore="getCommentList" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				articleId: 0,
				article: {},
				commentList: [],
				cpage: 1,
				psize: 11,
				loadStatus: "loadmore",
				comment: {
					content: "",
					anonymous: false
				}
			}
		},
		onLoad(options) {
			const that = this;
			this.articleId = options.id;

			this.$u.get("content_get", {
				id: options.id
			}).then(res => {
				that.article = res.result;
			});

			this.getCommentList();
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
		methods: {
			getCommentList() {
				const that = this;
				if (this.loadStatus == "loading") {
					return;
				}
				this.loadStatus = "loading";

				this.$u.get("pub_list", {
					pubid: 7,
					cid: this.articleId,
					psize: this.psize,
					cpage: this.cpage
				}).then(res => {
					let data = res.result;
					for (let i = 0; i < data.length; i++) {
						const item = data[i];
						let idx = that.commentList.findIndex(curr => curr.ID == item.ID);
						if (idx > -1) {
							continue;
						}
						that.commentList.push(item);
					}

					if (data.length < that.psize) {
						that.loadStatus = "nomore";
						setTimeout(function() {
							that.loadStatus = "loadmore";
						}, 3000);
						return;
					}
					that.cpage++;
					that.loadStatus = "loadmore";
				}).catch(err => {
					that.loadStatus = "loadmore";
				});
			},
			postPub() {
				const that = this;
				if (!this.$zoomla.isLogin()) {
					return;
				}
				if (!this.comment.content) {
					uni.showToast({
						title: "请输入内容",
						icon: "none"
					});
					return;
				}

				uni.showLoading({
					title: "请稍等",
					mask: true
				});

				let mu = this.$store.state.vuex_user;
				let inputer = this.comment.anonymous ? "[匿名用户]" : mu.honeyName;
				this.$u.post("pub_add", {
					pubid: 7,
					uid: mu.userId,
					model: JSON.stringify({
						PubInputer: inputer,
						PubTitle: inputer + " 对 " + this.article.title + " 的评价",
						PubContent: this.comment.content,
						PubContentid: this.articleId,
						Pubstart: 1 //审核状态。1 通过，0 待审
					})
				}).then(res => {
					uni.showToast({
						title: "提交成功"
					});
					let postData = {
						PubInputer: inputer,
						PubContent: that.comment.content,
						PubAddTime: that.$u.timeFormat(Date.now())
					};

					if (that.commentList.length) {
						let addData = [
							JSON.parse(JSON.stringify(that.commentList[0])),
							postData
						]
						that.commentList.splice(0, 1, addData[1], addData[0]);
					} else {
						that.commentList.push(postData);
					}
					that.comment.content = "";
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #0F0F11;
		color: #a3a3a3;
		padding: 0 26rpx;
	}

	.comment-post {
		margin-bottom: 80rpx;
		padding: 26rpx;
		border-radius: 12rpx;
		background: #222;
		overflow: hidden;
	}

	.comment-post-title {
		margin-bottom: 16rpx;
		font-size: 40rpx;
	}

	.comment-post-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.comment-post-btn {
		font-size: 28rpx;
		padding: 10rpx 26rpx;
		color: #ccc;
	}

	.comment-list {
		padding-bottom: 50rpx;
	}

	.comment-list-item:not(:last-child) {
		margin-bottom: 36rpx;
		border-bottom: 2rpx dashed #aaa;
	}

	.comment-inputer {
		margin-bottom: 14rpx;
		font-size: 36rpx;
		font-weight: 700;
		color: #ccc;
	}

	.comment-inputer::after {
		content: " 说：";
	}

	.comment-content {
		min-height: 120rpx;
		margin-bottom: 10rpx;
		padding: 0 26rpx;
		font-size: 30rpx;
		line-height: 50rpx;
	}

	.comment-addtime {
		margin-bottom: 2rpx;
		font-size: 28rpx;
		text-align: right;
		font-style: italic;
		color: #888;
	}
</style>
