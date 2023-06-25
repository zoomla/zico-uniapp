<template>
	<view style="padding:26rpx;">
		<u-form :model="formData" ref="uForm" :label-width="160" :error-type="['border-bottom', 'toast']">
			<u-form-item label="联系人" prop="userName">
				<u-input v-model="formData.userName"></u-input>
			</u-form-item>
			<u-form-item label="手机号码" prop="telNumber">
				<u-input v-model="formData.telNumber"></u-input>
			</u-form-item>
			<u-form-item label="地区信息" prop="provinceName">
				<u-input v-model="formData_area" type="select" @click="styles.region.show = true"></u-input>
			</u-form-item>
			<u-form-item label="门牌信息" prop="detailInfo">
				<u-input v-model="formData.detailInfo"></u-input>
			</u-form-item>
			<u-form-item label="邮政编码" prop="postalCode">
				<u-input v-model="formData.postalCode"></u-input>
			</u-form-item>
		</u-form>
		<view style="padding-top: 50rpx;">
			<u-button type="info" @click="saveInfo">保存</u-button>
		</view>

		<u-picker mode="region" v-model="styles.region.show" @confirm="regionPickerConfirm"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				styles: {
					region: {
						show: false
					}
				},
				formData: {
					userName: "",
					telNumber: "",
					postalCode: "",
					provinceName: "",
					cityName: "",
					countyName: "",
					detailInfo: ""
				},
				formRules: {
					userName: [{
						required: true,
						message: "请填写联系人",
						trigger: ['change', 'blur']
					}],
					telNumber: [{
						required: true,
						message: "请填写手机号码",
						trigger: ['change', 'blur']
					}, {
						validator: function(rule, value, callback) {
							return uni.$u.test.mobile(value);
						},
						message: "手机号码不正确",
						trigger: ['change', 'blur']
					}],
					postalCode: [{
						required: true,
						message: "请填写邮政编码",
						trigger: ['change', 'blur']
					}, {
						validator: function(rule, value, callback) {
							return uni.$u.test.digits(value) && parseInt(value) > 0;
						},
						message: "邮政编码不正确",
						trigger: ['change', 'blur']
					}],
					provinceName: [{
						required: true,
						message: "请选择地区信息",
						trigger: ['change', 'blur']
					}],
					detailInfo: [{
						required: true,
						message: "请填写门牌信息",
						trigger: ['change', 'blur']
					}]
				}
			}
		},
		computed: {
			"formData_area": {
				get: function() {
					let src = this.formData;
					return src.provinceName + " " + src.cityName + " " + src.countyName;
				},
				set: function(value) {
					let valArr = (value || "").split(" ");
					if (valArr.length != 3)
						return;
					this.formData.provinceName = valArr[0];
					this.formData.cityName = valArr[1];
					this.formData.countyName = valArr[2];
				}
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.formRules);
		},
		onLoad() {
			if (!this.$zoomla.isLogin(false)) {
				uni.redirectTo({
					url: "/pages/member/wxauth"
				});
				return;
			}

			const that = this;
			let mu = this.$store.state.vuex_user;
			this.$u.get("user_get", {
				uid: mu.userId
			}).then(res => {
				let userInfo = res.result;
				that.formData.telNumber = userInfo.mobile;
				that.formData.userName = userInfo.trueName;
				try {
					that.formData_area = userInfo.address.substr(0, userInfo.address.lastIndexOf(" "));
					that.formData.detailInfo = userInfo.address.substr(userInfo.address.lastIndexOf(" "));
				} catch(e) {}
				that.formData.postalCode = userInfo.CompanyDescribe; //邮编暂存在公司介绍中
			});
		},
		methods: {
			saveInfo() {
				const that = this;
				this.$refs.uForm.validate(valid => {
					if (!valid)
						return;

					let mu = JSON.parse(JSON.stringify(that.$store.state.vuex_user));
					mu.mobile = that.formData.telNumber;
					mu.trueName = that.formData.userName;
					mu.address = that.formData_area + " " + that.formData.detailInfo;
					mu.CompanyDescribe = that.formData.postalCode; //邮编暂存在公司介绍中
					that.$u.post("user_update", {
						uid: mu.userId,
						mu: JSON.stringify(mu)
					}).then(res => {})

					const eventChannel = that.getOpenerEventChannel();
					eventChannel.emit("confirm", {
						"errMsg": "chooseAddress:ok",
						"userName": that.formData.userName,
						"nationalCode": that.formData.postalCode,
						"telNumber": that.formData.telNumber,
						"postalCode": that.formData.postalCode,
						"provinceName": that.formData.provinceName,
						"cityName": that.formData.cityName,
						"countyName": that.formData.countyName,
						"detailInfo": that.formData.detailInfo
					});
					uni.navigateBack();
				});
			},
			regionPickerConfirm(event) {
				this.formData.provinceName = event.province.label;
				this.formData.cityName = event.city.label;
				this.formData.countyName = event.area.label;
			}
		}
	}
</script>

<style lang="scss">

</style>
