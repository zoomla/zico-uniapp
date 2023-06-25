<template>
	<view>
		<view class="point_logList">
			<view class="point_logListHeader">
				<view>当前积分：<text style="color: #ffbb3d;">¥{{vuex_user.point || "0"}}</text></view>
			</view>
			<scroll-view scroll-y="true" style="height: calc(100vh - 140rpx);" @scrolltolower="onreachBottom">
				<view class="opint_log" v-for="(item, index) in logs" :key="index">
					<view class="opint_logDetail">
						<view>{{item.Detail}}</view>
						<view class="opint_logScore" :class="(item.score > 0 ? 'increase' : 'decrease')">{{item.score > 0 ? "+" : ""}}{{item.score}}</view>
					</view>
					<view class="opint_logTime">{{$zoomla.timeFormat(item.HisTime)}}</view>
				</view>
				<u-loadmore :status="loadStatus" @loadmore="onreachBottom" bg-color="transparent" />
				<view style="padding: 10rpx;"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: "",
				logs: [],
				cpage: 1,
				psize: 10,
				loadStatus: "loadmore",
			}
		},
		onLoad() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#181619',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			});
			if (!this.$zoomla.isLogin()) {
				return;
			}

			let mu = this.$store.state.vuex_user;
			this.uid = mu.userId;
			this.getExpLog();
		},
		methods: {
			onreachBottom() {
				this.getExpLog();
			},
			getExpLog() {
				const that = this;
				if (that.loadStatus == "loading") {
					return;
				}
				that.loadStatus = "loading";

				that.$u.post("user_point_list", {
					uid: that.uid,
					stype: 3,
					cpage: that.cpage,
					psize: that.psize
				}).then(res => {
					let data = res.result;
					if (data.length == 0) {
						that.loadStatus = "nomore";
						return;
					}

					for (let i = 0; i < data.length; i++) {
						that.logs.push(data[i]);
					}

					that.cpage++;
					that.loadStatus = "loadmore";
				});
			}
		}
	}
</script>

<style lang="scss">
page{background: #0F0F11; color: #ccc;}

.point_logList{padding: 18rpx 30rpx 0 30rpx;}
.point_logListHeader{display: flex; justify-content: space-between; align-items: center; margin-bottom: 26rpx; font-size: 44rpx;}
.opint_log{padding-bottom: 15rpx; margin-bottom: 17rpx; border-bottom: 2rpx dashed #6c6c6c;}
.opint_logDetail{display: flex; justify-content: space-between; align-items: center; font-size: 32rpx;}
.opint_logScore{width: 130rpx; text-align: right;}
.opint_logScore.increase{color: #fa3534;}
.opint_logScore.decrease{color: #19be6b;}
.opint_logTime{font-size: 24rpx; color: #9c9c9c;}
</style>
