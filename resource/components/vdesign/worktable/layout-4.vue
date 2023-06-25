<template>
	<view style="width:100%;">
		<view style="margin-bottom:40rpx;" v-for="(item,index) in layout">
			<view style="margin-bottom:14rpx;">
				<view class="vd_page_image" style="height:600rpx;" v-if="item.mediaType == 'image'"
					@click="$root.uploadImg(function(path) { item.media=path; })">
					<view class="vd_page_image_content" :style="{
							'background-image':'url('+$u.http.config.baseUrl+(!item.media ? '/UploadFiles/nopic.svg' : item.media)+')',
						}"></view>
				</view>
				<view class="vd_page_image video" style="display:flex; align-items:center; height:600rpx;"
					@click="$root.u_uploadVid(function(path) { item.media=path; })" v-else>
					<view class="video-holder" v-if="!$root.params.isLive">
						<view>设计模式下无法查看视频</view>
						<view>点击更换视频</view>
					</view>
					<video style="width:100%; height:100%;" :src="$u.http.config.baseUrl+item.media" controls v-else></video>
				</view>
			</view>
			<view style="margin-bottom:6rpx;"><u-parse :html="item.title"></u-parse></view>
			<view><u-parse :html="item.detail"></u-parse></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ["layout"],
		data() {
			return {
			}
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
.vd_page_image.video::after{content:"";}
.video-holder{display:flex; flex-flow:column; align-items:center; justify-content:center; width:100%; height:300rpx; background:#f8f9fa;}
.video-holder>view:first-child{margin-bottom:8rpx; font-size:34rpx;}
.video-holder>view:last-child{color:#6c757d;}
</style>
