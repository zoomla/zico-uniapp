<template>
	<view>
		<view class="form-item form-item-row" v-for="item in value.items">
			<view class="form-label">
				<text v-if="item.type=='image'">图片</text>
				<view style="display:flex; justify-content:space-between;" v-else>
					<text>内容</text>
					<text style="color:#e45656;" @click="item.content=''">清空</text>
				</view>
			</view>
			<view class="form-control">
				<view class="vd_page_image" style="height:220rpx; font-size:28rpx;"
					@click="$root.u_uploadImg(function(path) { item.content=path; })" v-if="item.type=='image'">
					<image :src="$u.http.config.baseUrl+item.content" style="width:100%; height:100%;"></image>
				</view>
				<view v-else>
					<u-input type="textarea" v-model="item.content" :border="true" :clearable="false" :maxlength="800"></u-input>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ["value"],
		data() {
			return {
			}
		},
		mounted() {
			const layout = this.value;

			if (!layout.items || !layout.items.length) {
				layout.items.push({
					id: this.$root.u_guid(),
					type: "image",
					content: "/UploadFiles/nopic.svg"
				});

				layout.items.push({
					id: this.$root.u_guid(),
					type: "text",
					content: "示例文本"
				});
			}
		},
		methods: {
		}
	}
</script>

<style>

</style>
