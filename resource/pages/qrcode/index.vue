<template>
	<view class="vd_page" style="height:100%;">
		<!-- <u-tabs :list="tabs.list" :current="tabs.current"></u-tabs> -->
		<view class="qrcode_viewbox">
			<image class="qrcode_viewbox_img" :src="$u.http.config.baseUrl+qrcode.path"></image>
		</view>
		<view class="form-btn-group">
			<view class="form-btn form-btn-ok" @click="genCode()">生成</view>
			<view class="form-btn form-btn-err disable">美化</view>
			<view class="form-btn form-btn-warn disable">保存</view>
		</view>
		<view class="qrcode_cfgbox">
			<view class="qrcode_cfgbox_title">二维码参数</view>
			<swiper :current="tabs.swiperCurrent" style="flex:1;">
				<swiper-item style="height:100%;">
					<scroll-view scroll-y style="height:100%">
						<view class="form-item form-item-row">
							<view class="form-label">
								<text>内容</text>
								<text class="form-label-append form-label-append-del"
									@click="params.text.content=''">清空</text>
							</view>
							<view class="form-control">
								<u-input type="textarea" v-model="params.text.content" :border="true" :clearable="false" maxlength="500" style="height:220rpx;"></u-input>
							</view>
						</view>
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
				uid: 0,
				qrcode: {
					gid: 0,
					path: "/UploadFiles/nopic.svg",
					type: "text"
				},
				beautify: {},
				params: {
					text: {
						content: ""
					}
				},

				tabs: {
					current: 0,
					swiperCurrent: 0,
					list: [
						{name: "普通二维码"},
					]
				}
			};
		},
		methods: {
			genCode() {
				const that = this;
				this.$u.get("qrcode_gen", {
					type: this.qrcode.type,
					payload: JSON.stringify(this.params[this.qrcode.type])
				}).then(res => {
					that.qrcode.path = res.result;
				});
			},
		}
	}
</script>

<style lang="scss">
page{height:100%;}
.qrcode_viewbox{margin:0 0 30rpx 0; width:100%; height:25vh;}
.qrcode_viewbox_img{width:100%; height:100%;}
.qrcode_cfgbox{flex:1; display:flex; flex-flow:column; padding:0 26rpx;}
.qrcode_cfgbox_title{font-size:36rpx; font-weight:100;}

.form-btn-group{display:flex; margin:0 20rpx 40rpx 20rpx;}
.form-btn-group>.form-btn{margin:0 20rpx;}
</style>
