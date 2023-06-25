<template>
	<view>
		<view class="form-item form-item-row">
			<view class="form-label">图片列表</view>
			<view class="form-control form-item-list">
				<view class="form-item-list-item" v-for="(item,index) in value.items">
					<view class="form-item-list-item-del" @click="removeItem(index)">
						<u-icon name="trash"></u-icon>
						<text>删除</text>
					</view>
					<view class="form-item form-item-row">
						<view class="form-label">
							<text>图片标题</text>
							<text class="form-label-append form-label-append-del">清空</text>
						</view>
						<view class="form-control">
							<u-input v-model="item.title" :border="true" :clearable="false" :maxlength="800"></u-input>
						</view>
					</view>
					<view class="form-item form-item-row">
						<view class="form-label">图片</view>
						<view class="form-control">
							<view class="vd_page_image" style="height:220rpx; font-size:28rpx;"
								@click="$root.u_uploadImg(function(path) { item.image=path; })">
								<image :src="$u.http.config.baseUrl+item.image" style="width:100%; height:100%;"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="vd_list_adder" @click="addItem()">
					<u-icon name="plus"></u-icon>
					<text>新增图片</text>
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
				this.addItem();
			}
		},
		methods: {
			addItem() {
				this.value.items.push({
					id: this.$root.u_guid(),
					image: "/UploadFiles/nopic.svg",
					title: "<span style='font-size:16px'>这里是图片介绍</span>",
					direction: "bottom" // 提示文字位置，暂时未使用
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

<style>

</style>
