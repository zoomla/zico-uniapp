<template>
	<view>
		<view class="message">
			<view class="message_poster">{{message.poster}}</view>
			<view class="message_concatInfo">联系方式：{{message.concat}}</view>
			<view class="message_content">
				<text>说：</text>
				<text>{{message.content}}</text>
			</view>
			<view class="message_createTime">{{message.createTime}}</view>
		</view>
		<view class="message_opera">
			<view style="color:#fa3534;" @click="del()"><u-icon name="trash"></u-icon>删除留言</view>
			<view v-if="message.status == 0" style="color:#2979ff;" @click="audit()"><u-icon name="checkmark-circle"></u-icon>审核留言</view>
			<view v-else style="color:#fa3534;" @click="unAudit()"><u-icon name="minus-circle"></u-icon>取消审核</view>
		</view>
		<view class="message_reply">
			<view class="message_reply_title">站长回复：</view>
			<view class="message_reply_cnt">
				<u-input type="textarea" v-model="reply.content" :maxlength="800" :custom-style="{'min-height':'220rpx'}"></u-input>
			</view>
			<view>
				<view class="form-btn form-btn-ok" @click="saveReply()">保存回复</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: this.$store.state.vuex_user.userId, // 当前登录用户id
				message: {
					id: 0,
					poster: "",
					concat: "",
					content: "",
					createTime: "",
					status: 0,
					siteId: 0,
				},
				reply: {
					id: 0,
					content: ""
				},
			};
		},
		onLoad(options) {
			const that = this;
			this.$u.get("vd_site_message_get", {
				id: options.id
			}).then(res => {
				let data = res.result;
				let form = that.message;

				form.id = data.ID;
				form.poster = data.Poster;
				form.concat = data.ConcatInfo || "未填写";
				form.content = data.Content || "未填写";
				form.createTime = that.$u.timeFormat(data.CreateTime, "yyyy-mm-dd hh:MM:ss");
				form.status = data.Status;
				form.siteId = data.SiteID;

				that.$u.get("vd_site_message_list", {
					id: data.SiteID,
					msgid: data.ID
				}).then(res => {
					let data = res.result;
					if (!data || !data.length) {
						return;
					}

					that.reply.id = data[0].ID;
					that.reply.content = data[0].Content;
				});
			});
		},
		methods: {
			saveReply() {
				if (!this.reply.content) {
					uni.showToast({
						title: "请填写回复内容",
						icon: "none"
					});
					return;
				}

				this.$u.post("vd_site_message_reply", {
					uid: this.uid,
					msgid: this.message.id,
					content: this.reply.content
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
				});;
			},

			audit() {
				const that = this;
				this.$u.post("vd_site_message_audit", {
					uid: this.uid,
					ids: this.message.id,
					status: 99
				}).then(res => {
					that.message.status = 99;
				});
			},
			unAudit() {
				const that = this;
				this.$u.post("vd_site_message_audit", {
					uid: this.uid,
					ids: this.message.id,
					status: 99
				}).then(res => {
					that.message.status = 0;
				});
			},

			del() {
				const that = this;
				uni.showModal({
					title: "真的要删除吗",
					success: function(res) {
						if (!res.confirm) {
							return;
						}

						that.$u.post("vd_site_message_del", {
							uid: that.uid,
							ids: that.message.id
						}).then(res => {
							uni.showToast({
								title: "操作成功",
								icon: "none"
							});

							setTimeout(function() {
								uni.navigateBack();
							}, 800);
						}).catch(err => {
							let msg = err.retmsg;
							if (!msg) {
								msg = "";
							}

							uni.showToast({
								title: "操作失败 " + msg,
								icon: "none"
							});
						})
					}
				});
			},
		}
	}
</script>

<style lang="scss">
page{padding:0 26rpx;}

.message{margin-bottom:40rpx;}
.message_poster{font-size:38rpx; font-weight:bold;}
.message_concatInfo{margin-bottom:12rpx; font-size:26rpx; color:#6c757d;}
.message_content{min-height:220rpx; margin-bottom:12rpx;}
.message_content>text:first-child{color:#6c757d;}
.message_createTime{font-size:26rpx; color:#c4c6c9; text-align:right;}

.message_opera{display:flex; justify-content:space-around; margin-bottom:20rpx;}
.message_opera>view{color:#303133;}

.message_reply{padding-top:28rpx; border-top:2rpx solid #e9ecef;}
.message_reply_title{margin-bottom:14rpx; color:#6c757d;}
.message_reply_cnt{padding:6rpx 22rpx; margin-bottom:28rpx; border:2rpx solid #dee2e6; border-radius:8rpx;}
</style>
