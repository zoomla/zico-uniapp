<template>
	<view class="yuyue">
		<view class="yuyue_bg"></view>
		<view class="w100">
		<view class="yuyue_title">账户永久注销申请</view>
		<view class="yuyue_abbr">你只要在姓名、电话中包括帐户相关信息，如用户名、绑定手机，提交后我们将与你联络确认，核对成功后15工作日内完成操作。</view>

		<!-- 表单 -->
		<view>
			<u-form :model="reservation.form" ref="uForm" :label-align="reservation.formLabelAlign"
				:label-width="reservation.formLabelWidth" :label-style="reservation.formLabelStyle">
				<u-form-item label="您的姓名" prop="name">
					<u-input v-model="reservation.form.name" />
				</u-form-item>
				<u-form-item label="联系电话" prop="mobile">
					<u-input v-model="reservation.form.mobile" />
				</u-form-item>
			</u-form>
				<button @click="submit">提交申请</button>
		</view>

		<u-modal v-model="show" :title-style="{color: 'red'}" :title="title">
			<view class="slot-content">
				<rich-text :nodes="content"></rich-text>
			</view>
		</u-modal>
<!-- 		<u-button @click="open">
			打开模态框
		</u-button>		 -->
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				title: "操作警示",
				content: `
				本程序遵从所在国法律，同时按国家法律规定，提供更正、删除个人信息及注销用户账号功能，并及时响应用户相应操作。 <br>
				一旦提交申请后：我们全部抹除数据，并不提供恢复服务。<br>
				如果你要再次使用本程序，需要重新申请。<br>
				如果你不方便在线提交申请，还可以需要致电：0791-86161900，或发邮：web@hx008.com<br>
				【我们承诺在收到申请后15个工作日内进行注销，以及根据用户请求完成相应处理】
				`,
				reservation: {
					form: {
						name: "",
						mobile: ""
					},
					formRules: {
						name: [{
							required: true,
							message: '姓名不能为空',
							trigger: ['blur', 'change']
						}],
						mobile: [{
							required: true,
							message: '联系电话不能为空',
							trigger: ['blur', 'change']
						}, {
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change', 'blur'],
						}]
					},
					formLabelWidth: 145,
					formLabelStyle: {},
					formLabelAlign: "right"
				}
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.reservation.formRules);
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#CFCABF',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
		},		
		methods: {
			open() {
				this.show = true;
			},
			submit() {
				const that = this;
				that.$refs.uForm.validate(valid => {
					if (!valid) {
						return; // 表单验证未通过
					}

					let form = that.reservation.form;
					let model = {
						PubTitle: "申请人：" + form.name,
						PubContent: "联系电话：" + form.mobile,
						PubIsTrue: 1, // 是否需要审核，需要1，不需要0
					};
					this.$u.post("pub_add", {
						pubid: 9,  //互动模块接收
						uid: (that.$zoomla.isLogin(false) ? that.$store.state.vuex_user.userId : ""),
						model: JSON.stringify(model)
					}).then(res => {
						uni.showModal({
							title: "提交成功，请等待管理员审核通过",
							showCancel: false,
							success: function() {
								uni.navigateBack();
							}
						})
					});
				});
			}
		}
	}
</script>

<style>
.slot-content {
font-size: 28rpx;
color: $u-content-color;
padding-left: 30rpx;
}
</style>
