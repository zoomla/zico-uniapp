<template>
	<view>
		<view v-for="(item,index) in layout" style="display:flex; margin-bottom:40rpx;" :style="itemStyle(item)">
			<view class="vd_page_image" style="height:300rpx; flex-shrink:0;"
				@click="$root.u_uploadImg(function(path) { item.image=path; })" :style="itemImageStyle(item)">
				<view class="vd_page_image_content" :style="{
						'background-image':'url('+$u.http.config.baseUrl+(!item.image ? '/UploadFiles/nopic.svg' : item.image)+')',
					}"></view>
			</view>
			<view :style="itemContentStyle(item)">
				<view><u-parse :html="item.title" :tag-style="style.uparseTag"></u-parse></view>
				<view style="margin-bottom:12rpx;"><u-parse :html="item.title2" :tag-style="style.uparseTag"></u-parse></view>
				<view><u-parse :html="item.content" :tag-style="style.uparseTag"></u-parse></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ["layout"],
		data() {
			return {
				style: {
					uparseTag: {
						"h2": "font-weight:100;"
					}
				},
			};
		},
		methods: {
			itemStyle(item) {
				let vm = this.$root.params.viewMode;
				let inSmDevice = vm == "xs" || vm == "sm" || vm == "md";

				let direction = item.direction;
				switch(direction) {
					case "left":
					case "right":
						return inSmDevice ? {
							"flex-flow": "column"
						} : {
							"flex-flow": "row"
						};
					case "up":
					case "down":
					default:
						return {
							"flex-flow": "column"
						};
				}
			},
			itemImageStyle(item) {
				let vm = this.$root.params.viewMode;
				let inSmDevice = vm == "xs" || vm == "sm" || vm == "md";

				let direction = item.direction;
				switch(direction) {
					case "down":
						return {
							"order": 1
						};
					case "left":
						return inSmDevice ? {
							"order": 1
						} : {
							"align-self": "center",
							"width": "40%",
							"margin-right": "24rpx"
						};
					case "right":
						return inSmDevice ? {
							"order": 1
						} : {
							"order": 1,
							"align-self": "center",
							"width": "40%"
						};
					case "up":
					default:
						return {
							"margin-bottom": "12rpx"
						};
				}
			},
			itemContentStyle(item) {
				let vm = this.$root.params.viewMode;
				let inSmDevice = vm == "xs" || vm == "sm" || vm == "md";

				let direction = item.direction;
				switch(direction) {
					case "down":
						return {
							"order": 0,
							"margin-bottom": "12rpx"
						};
					case "left":
						return inSmDevice ? {
							"order": 0,
							"margin-bottom": "12rpx"
						} : {};
					case "right":
						return inSmDevice ? {
							"order": 0,
							"margin-bottom": "12rpx"
						} : {
							"order": 0,
							"margin-right": "24rpx"
						};
					case "up":
					default:
						return {};
				}
			},
		}
	}
</script>

<style>

</style>
