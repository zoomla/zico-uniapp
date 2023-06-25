<template>
	<view>
		<u-form :model="userForm.data" ref="uForm" :label-width="140" :label-align="'right'">
			<view class="u-flex u-row-center">
				<u-avatar @click="changeFace" :src="safeFaceUrl(userForm.data.userFace)" :size="200"></u-avatar>
				<u-upload
				@on-uploaded="onFaceUploaded"
				@on-error="onFaceUploadErrored"
				:action="action" ref="uUpload"
				:show-upload-list="false" 
				:custom-btn="true" :auto-upload="true" 
				:max-count="1" :deletable="false"></u-upload>
			</view>
			<view>
				<u-form-item label="昵称" prop="honeyName">
					<u-input v-model="userForm.data.honeyName" placeholder="请输入昵称"></u-input>
				</u-form-item>
			</view>
			<view>
				<u-form-item label="真实姓名">
					<u-input v-model="userForm.data.trueName" placeholder="(可选)"></u-input>
				</u-form-item>
			</view>
			<view>
				<u-form-item label="性别">
					<u-input v-model="userForm.data.sex" placeholder="(可选)" type="select" :disabled="true" @click="visable.sex = true"></u-input>
				</u-form-item>
				<u-select v-model="visable.sex" :list="sex" @confirm="onSexPickerChanged"></u-select>
			</view>
			<view>
				<u-form-item label="生日">
					<u-input v-model="userForm.data.birthday" placeholder="(可选)" type="select" :disabled="true" @click="visable.birthday = true"></u-input>
				</u-form-item>
				<u-picker v-model="visable.birthday" :default-time="userForm.data.birthday" mode="time" @confirm="onBirthdayPickerChanged"></u-picker>
			</view>
			<view>
				<u-form-item label="手机号码" prop="mobile">
					<u-input v-model="userForm.data.mobile" placeholder="(可选)"></u-input>
				</u-form-item>
			</view>
			<view>
				<u-form-item label="电子邮箱" prop="Email">
					<u-input v-model="userForm.data.Email" placeholder="(可选)"></u-input>
				</u-form-item>
			</view>
			<view>
				<u-form-item label="个人主页" prop="seturl">
					<u-input v-model="userForm.data.seturl" placeholder="(可选)"></u-input>
				</u-form-item>
			</view>
		</u-form>
		<view>
			<button @click="save()">保存</button>
			<button @click="$u.route('/pages/member/uzhuxiao')" style="margin-top: 10rpx;background:#18B566;">注销账号</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				action: "",
				visable: {
					birthday: false,
					sex: false
				},
				userForm: {
					data: {
						honeyName: "", // 昵称
						userFace: "", // 头像
						seturl: "", // 个人主页
						Email: "", // 电子邮箱
						trueName: "", // 真实姓名
						mobile: "", // 手机号码
						sex: "", // 性别
						birthday: "", // 生日
					},
					rules: {
						honeyName: [{
							required: true,
							message: "请输入昵称",
							trigger: ["change", "blur"]
						}],
						seturl: [{
							validator: (rule, value, callback) => {
								if (!value) {
									return true;
								}
								return this.$u.test.url(value);
							},
							message: '网址不正确',
							trigger: ['change', 'blur'],
						}],
						Email: [{
							validator: (rule, value, callback) => {
								if (!value) {
									return true;
								}
								return this.$u.test.email(value);
							},
							message: '邮箱地址不正确',
							trigger: ['change', 'blur'],
						}],
						mobile: [{
							validator: (rule, value, callback) => {
								if (!value) {
									return true;
								}
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change', 'blur'],
						}],
					}
				},
				sex: [{label:"男",value:"男"}, {label:"女",value:"女"}]
			}
		},
		onLoad() {
			if(!this.$zoomla.isLogin()){
				return;
			}

			let mu = this.$store.state.vuex_user;
			// 转移数据到本页面
			for (let i in this.userForm.data) {
				this.userForm.data[i] = mu[i];
			}

			this.action = this.$u.http.config.baseUrl + this.$u.createUrl('upload', true);
		},
		onReady() {
			this.$refs.uForm.setRules(this.userForm.rules);
		},
		methods: {
			save() {
				this.$refs.uForm.validate(vaild => {
					if (!vaild) {
						return;
					}

					uni.showLoading({
						mask: true
					});
					
					this.$u.post("user_update", {
						uid: this.$store.state.vuex_user.userId,
						mu: JSON.stringify(this.userForm.data)
					}).then(res => {
						uni.hideLoading();
						uni.showToast({
							title: "保存成功"
						});
						this.$zoomla.getMemberInfo();
					});
				});
			},
			//----------------------日期选择
			onBirthdayPickerChanged(res) {
				let date = res.year + "-" + res.month + "-" + res.day;
				this.userForm.data.birthday = date;
			},
			//----------------------性别选择
			onSexPickerChanged(res) {
				this.userForm.data.sex = res[0].value;
			},
			//----------------------头像上传
			changeFace() {
				this.$refs.uUpload.clear();
				this.$refs.uUpload.selectFile();
			},
			onFaceUploaded(data) {
				if(data[0].error){
					uni.showToast({
						title: '头像上传失败',
						icon: "none"
					});
					return;
				}

				this.userForm.data.userFace = data[0].response.result;
			},
			onFaceUploadErrored(res) {},
			safeFaceUrl(src) {
				if (src.startsWith("http")) {
					return src;
				}
				return this.$u.http.config.baseUrl + src;
			}
		}
	}
</script>

<style lang="scss">

</style>
