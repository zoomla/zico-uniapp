<template>
	<view class="yuyue">
		<view class="yuyue_bg"></view>
		<view class="w100">
		<view class="yuyue_title">预约参观字研所</view>
		<view class="yuyue_abbr">我们提供高端书画艺术鉴赏和欣赏</view>

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
				title: "预约提示",
				content: `
				中国首个实体全产业链字库研究机构：江西字研所。 <br>
				私家艺术鉴赏中心和艺术收藏中心：<br>
				二楼：会客创作<br>
				一楼：高端艺术展与瘦金作品鉴赏中心<br>
				负一层：古法装裱、手工制作、手法培训<br>
				阳光房：艺术沙龙<br><br>
				【本展厅作为私人展厅，仅接受在线预约，作休时间以公示为准，保留最终解释权，敬请理解】
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
						pubid: 8,
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
