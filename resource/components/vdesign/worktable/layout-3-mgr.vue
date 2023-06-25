<template>
	<view>
		<view class="form-item form-item-row">
			<view class="form-label">文章列表</view>
			<view class="form-control form-item-list">
				<view class="form-item-list-item" v-for="(item,index) in value.items">
					<view class="form-item-list-item-del" @click="removeItem(index)">
						<u-icon name="trash"></u-icon>
						<text>删除</text>
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
							<text>副标题</text>
							<text class="form-label-append form-label-append-del" @click="item.title2=''">清空</text>
						</view>
						<view class="form-control">
							<u-input v-model="item.title2" :border="true" :clearable="false" :maxlength="800"></u-input>
						</view>
					</view>
					<view class="form-item form-item-row">
						<view class="form-label">图片位置</view>
						<view class="form-control">
							<u-radio-group v-model="item.direction">
								<u-radio v-for="p in positions" :name="p.value">{{p.label}}</u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="form-item form-item-row">
						<view class="form-label">图片</view>
						<view class="vd_page_image" style="height:220rpx; font-size:28rpx;"
							@click="$root.u_uploadImg(function(path) { item.image=path; })">
							<image :src="$u.http.config.baseUrl+item.image" style="width:100%; height:100%;"></image>
						</view>
					</view>
					<view class="form-item form-item-row">
						<view class="form-label">
							<text>内容</text>
							<text class="form-label-append form-label-append-del" @click="item.content=''">清空</text>
						</view>
						<view class="form-control">
							<u-input type="textarea" v-model="item.content" :border="true" :clearable="false" :maxlength="800"></u-input>
						</view>
					</view>
				</view>
				<view class="vd_list_adder" @click="addItem()">
					<u-icon name="plus"></u-icon>
					<text>新增文章</text>
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
				positions: [
					{label: "上", value: "up"},
					{label: "下", value: "down"},
					{label: "左", value: "left"},
					{label: "右", value: "right"},
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
					title: "<span style='font-size:28px;'>这里是标题</span>",
					title2: "<span style='font-size:18px;'>这里是副标题</span>",
					content: "<span style='font-size:16px; color:rgb(77,77,77)'>这里是内容</span>",
					image: "/UploadFiles/nopic.svg",
					direction: "right" //图片位置. up, down, left, right
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
