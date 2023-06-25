<template>
	<view class="vd_page_main">
		<view class="form-item form-require">
			<view class="form-label">名称</view>
			<view class="form-control">
				<u-input v-model="form.name" placeholder="请输入名称"></u-input>
			</view>
		</view>
		<view class="form-item">
			<view class="form-label">类型</view>
			<view class="form-control">
				<u-input v-model="formViewType" type="select" placeholder="请选择类型" @click="style.typeSelect.show=true"></u-input>
			</view>
		</view>
		<view class="form-item form-item-lg">
			<view class="form-label">预览图</view>
			<view class="form-control">
				<image :src="$u.http.config.baseUrl+form.preview" @click="changeImage()"
					style="width:220rpx; height:220rpx; background:#f4f4f5; border-radius:8rpx; overflow:hidden;"></image>
				<view style="font-size:22rpx; color:#82848a;">* 点击图片以更换预览图</view>
			</view>
		</view>
		<view class="form-item">
			<view class="form-label">价格</view>
			<view class="form-control">
				<u-input v-model="form.price" placeholder="请输入价格"></u-input>
			</view>
		</view>
		<view class="form-item form-item-lg">
			<view class="form-label">简介</view>
			<view class="form-control">
				<u-input type="textarea" :auto-height="true" v-model="form.remarks"></u-input>
			</view>
		</view>
		<view style="padding-top: 20rpx;">
			<view class="form-btn form-btn-ok" @click="save()">保存</view>
			<view class="form-btn form-btn-cancel" @click="cancel()">取消</view>
		</view>

		<u-select v-model="style.typeSelect.show" :list="style.typeSelect.list" mode="mutil-column-auto"
			@confirm="typeSelectConfirm"></u-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: this.$store.state.vuex_user.userId, // 当前登录用户id
				style: {
					typeSelect: {
						list: [],
						show: false
					},
				},
				types: [],
				form: {
					id: 0,
					name: "",
					type: "",
					preview: "/UploadFiles/nopic.svg",
					price: "",
					remarks: "",
				},
			};
		},
		computed: {
			"formViewType": {
				get: function() {
					let reuslt = this.form.type;
					let type = this.types.find(curr => curr.ID == reuslt);
					if (type) {
						reuslt = type.Name;
					}
					return reuslt;
				},
				set: function(val) {}
			}
		},
		watch: {
			"form.price": function() {
				const that = this;
				if (isNaN(Number(this.form.price))) {
					if (isNaN(parseFloat(this.form.price))) {
						this.$nextTick(function() {
							that.form.price = 0;
						});
						return;
					}
					this.$nextTick(function() {
						that.form.price = parseFloat(this.form.price);
					});
				}
			}
		},
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 2000);
		},
		onLoad(options) {
			const that = this;

			this.$u.get("vd_board_types", {
			}).then(res => {
				let data = res.result;
				that.types.push.apply(that.types, res.result);
				const _fetch = function(dest) {
					let arr = data.filter(curr => curr.ParentID == dest.value);

					if (arr && arr.length) {
						dest.children = [];
						let hasChild = false;
						for (let i = 0; i < arr.length; i++) {
							let item = {
								label: arr[i].Name,
								value: arr[i].ID
							};
							_fetch(item);
							dest.children.push(item);
							if (item.children && item.children.length) {
								hasChild = true;
							}
						}
						dest.children.push({
							label: "不选择子项",
							value: ""
						});

						if (hasChild) {
							for (let j = 0; j < dest.children.length; j++) {
								if (!dest.children[j].children || !dest.children[j].children.length) {
									dest.children[j].children = [{
										label: "不选择子项",
										value: ""
									}];
								}
							}
						}
					}
				};
				let sel = { label: "root", value: "0", children: [] };
				_fetch(sel, 0);
				that.style.typeSelect.list.push.apply(that.style.typeSelect.list, sel.children);
			}).catch(err => {
			});

			this.$u.get("vd_board_get", {
				id: options.id
			}).then(res => {
				let data = res.result;
				let form = that.form;

				form.id = data.ID;
				form.name = data.Name;
				form.type = data.TypeID;
				form.preview = data.PreviewImg;
				form.price = data.Price;
				form.remarks = data.Remarks;
			});
		},
		methods: {
			save() {
				const that = this;
				if (!this.form.name) {
					uni.showToast({
						title: "名称不能为空",
						icon: "none"
					});
					return;
				}

				this.$u.post("vd_board_upd", {
					uid: this.uid,
					id: this.form.id,
					name: this.form.name,
					typeids: this.form.type,
					price: this.form.price,
					preview: this.form.preview,
					remarks: this.form.remarks
				}).then(res => {
					uni.showToast({
						title: "保存成功",
						icon: "none"
					});

					setTimeout(function() {
						that.cancel();
					}, 800);
				}).catch(err => {
					let msg = err.retmsg;
					if (!msg) {
						msg = "";
					}

					uni.showToast({
						title: "保存失败 " + msg,
						icon: "none"
					});
				});
			},
			cancel() {
				uni.navigateBack();
			},

			changeImage() {
				const that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ["original"],
					sourceType: ["album"],
					success: function (res) {
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
								that.form.preview = udata.result;
							}
						});
					}
				});
			},
			typeSelectConfirm(ev) {
				let res = "";
				for (let i = 0; i < ev.length; i++) {
					if (ev[i].value) {
						res = ev[i].value;
					}
				}
				this.form.type = res;
			},
		}
	}
</script>

<style lang="scss">
</style>
