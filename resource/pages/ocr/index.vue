<template>
	<view class="vd_page">
		<view class="ocr_viewbox">
			<image class="ocr_viewbox_img" :src="$u.http.config.baseUrl+image"></image>
		</view>
		<view class="form-btn-group">
			<view class="form-btn form-btn-ok" @click="ocrPost()">上传图片</view>
			<view class="form-btn form-btn-warn disable">识别历史</view>
		</view>
		<view class="ocr_result">
			<view class="ocr_result_title">识别结果</view>
			<view style="flex:1;">
				<scroll-view scroll-y style="height:100%;">
					<u-parse :html="result"></u-parse>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				image: "/UploadFiles/nopic.svg",
				result: "暂无结果"
			};
		},
		methods: {
			ocrPost() {
				const that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ["original"],
					success: function(res) {
						uni.uploadFile({
							url: that.$u.http.config.baseUrl + that.$u.createUrl("upload"),
							name: "file",
							filePath: res.tempFilePaths[0],
							success: function(ures) {
								let udata = JSON.parse(ures.data);
								if (udata.retcode == "-1") {
									uni.showToast({
										title: "上传失败",
										icon: "none"
									});
									return;
								}
						
								that.image = udata.result;
								that.$u.post("ocr_disc", {
									lang: "0,1,2,3,4,5",
									imgpath: udata.result
								}).then(dres => {
									that.result = dres.result;
								});
							}
						});
					}
				});
			},
		}
	}
</script>

<style lang="scss">
page{height:100%;}
.ocr_viewbox{margin:0 0 30rpx 0; width:100%; height:25vh;}
.ocr_viewbox_img{width:100%; height:100%;}
.ocr_result{flex:1; display:flex; flex-flow:column; padding:0 26rpx;}
.ocr_result_title{margin-bottom:20rpx; font-size:36rpx; font-weight:100;}

.form-btn-group{display:flex; margin:0 20rpx 40rpx 20rpx;}
.form-btn-group>.form-btn{margin:0 20rpx;}
</style>
