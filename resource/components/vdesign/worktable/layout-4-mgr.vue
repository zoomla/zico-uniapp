<template>
	<view>
		<view class="form-item form-item-row">
			<view class="form-label">媒体列表</view>
			<view class="form-control form-item-list">
				<view class="form-item-list-item" v-for="(item,index) in value.items">
					<view class="form-item-list-item-del" @click="removeItem(index)">
						<u-icon name="trash"></u-icon>
						<text>删除</text>
					</view>
					<view class="form-item form-item-row">
						<view class="form-label">媒体类型</view>
						<view class="form-control">
							<u-radio-group v-model="item.mediaType">
								<u-radio v-for="p in types" :name="p.value">{{p.label}}</u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="form-item form-item-row">
						<view class="form-label"></view>
						<view class="form-control">
							<view class="vd_page_image video" style="height:220rpx; font-size:28rpx;"
								@click="$root.u_uploadVid(function(path) { item.media=path; })" v-if="item.mediaType=='video'">
								<view class="video-holder">
									<view>设计模式下无法查看视频</view>
									<view>点击更换视频</view>
								</view>
							</view>
							<view class="vd_page_image" style="height:220rpx; font-size:28rpx;"
								@click="$root.u_uploadImg(function(path) { item.media=path; })" v-else>
								<image :src="$u.http.config.baseUrl+item.media" style="width:100%; height:100%;"></image>
							</view>
						</view>
					</view>
					<view class="form-item form-item-row">
						<view class="form-label">
							<text>标题</text>
							<text class="form-label-append form-label-append-del" @click="item.title=''">清空</text>
						</view>
						<view class="form-control">
							<u-input v-model="item.title" :border="true" :clearable="false" :maxlength="800"></u-input>
						</view>
					</view>
					<view class="form-item form-item-row">
						<view class="form-label">
							<text>详细介绍</text>
							<text class="form-label-append form-label-append-del" @click="item.detail=''">清空</text>
						</view>
						<view class="form-control">
							<u-input type="textarea" v-model="item.detail" :border="true" :clearable="false" :maxlength="800"></u-input>
						</view>
					</view>
				</view>
				<view class="vd_list_adder" @click="addItem()">
					<u-icon name="plus"></u-icon>
					<text>新增媒体</text>
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
				types: [
					{label: "图片", value: "image"},
					{label: "视频", value: "video"},
				]
			};
		},
		mounted() {
			const layout = this.value;

			if (!layout.items || !layout.items.length) {
				this.addItem();
			}
		},
		methods: {
			addItem() {
				this.value.items.push({
					id: this.$root.u_guid(),
					title: "<span style='font-size:20px;'>这里是媒体标题</span>",
					title2: "<span style='font-size:18px;'>这里是副标题</span>",
					detail: "<span style='font-size:16px; color:rgb(77,77,77)'>这里是媒体内容介绍</span>",
					media: "/UploadFiles/nopic.svg", // path
					mediaType: "image" // image, video
				});
			},
			removeItem(index) {
				const list = this.value.items;
				uni.showModal({
					title: "确定删除吗",
					success: function(res) {
						if (!res.confirm) {
							return;
						}

						list.splice(index, 1);
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.vd_page_image.video::after{content:"";}
.video-holder{display:flex; flex-flow:column; align-items:center; justify-content:center; width:100%; height:100%; background:#f8f9fa;}
.video-holder>view:first-child{margin-bottom:8rpx; font-size:30rpx;}
.video-holder>view:last-child{color:#6c757d; font-size:26rpx;}
</style>
