<template>
	<view>
		<view class="tradition-login" v-if="loginType != 'mp-weixin'">
			<view class="header">欢迎登录**</view>
			<view class="login-form">
				<block v-if="!msgCodeHasSend">
					<view class="tips">请输入您的手机号</view>
					<view class="input-block">
						<u-input v-model="mobile" maxlength="11" placeholder="请输入手机号码" :custom-style="inputStyle" :focus="true" type="number"/>
					</view>				
					<view class="btn-control">
						<u-button class="request-code-btn" type="primary" @click="requestMsgCode" :disabled="disallowRequestMsgCode">发送验证码</u-button>
					</view>
				</block>
				<block v-else>
					<view class="tips">请输入手机验证码</view>
					<view class="input-block u-flex">
						<u-input v-model="msgcode" maxlength="6" placeholder=" " :custom-style="inputStyle2" :focus="true" type="number"/>
						<u-button class="do-login-btn" type="success" @click="getMsgCode()" size="mini" :disabled="requestCodeAgain">{{codeTips}}</u-button>						
					</view>
					
					<view class="btn-control">
						<u-button class="do-login-btn" type="primary" @click="doLogin" :disabled="disallowDoLogin">立即登录</u-button>
					</view>
				</block>
			</view>
		</view>
		
		<view class="mp-login" v-else>
			<view class="mp-logo">
				<image src="/static/logo.svg" mode="widthFix"></image>
			</view>
			<view class="mp-tips u-text-center">请完成微信授权以继续使用</view>
			<view class="mp-login-btn">
				<u-button @getphonenumber="getPhoneNumber" open-type="getPhoneNumber" type="primary">授权微信绑定手机号</u-button>
			</view>
			<!-- <view class="do-tradition u-text-center" @click="loginType = 'h5'">绑定其他手机号</view> -->
		</view>
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		<view class="agreement u-flex">
			<view class="checkbox">
				<u-checkbox v-model="agreementChecked" size="42" :disabled="false"></u-checkbox>
			</view>
			<view class="agreement-text">
				我已认真阅读、理解并同意
				<text class="agreement-link" @click="agreement1">《服务条款》</text>
				<text class="agreement-link">《隐私条款》</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mobile:'',
				msgcode:'',
				inputStyle:{
					'fontSize':'40rpx'
				},
				inputStyle2:{
					'fontSize':'40rpx',
					'letterSpacing': '20rpx'
				},
				requestCodeAgain: false,//重新获取验证码
				msgCodeHasSend: false,
				disallowRequestMsgCode: true,
				disallowDoLogin: true,
				agreementChecked: false,
				codeTips:'',
				loginType: 'mp-weixin',
				//微信授权code
				code:''
			};
		},
		watch:{
			mobile(newVal){
				console.log(newVal)
				this.disallowRequestMsgCode = !this.$u.test.mobile(newVal)
			},
			msgcode(newVal){
				this.disallowDoLogin = !this.$u.test.code(newVal,6)
			}
		},
		methods:{
			//登录
			doLogin(){
				if(!this.agreementChecked){
					this.$u.toast('请先阅读并勾选服务协议');
					return;
				}
				this.$u.toast('登录')
			},
			getMsgCode(){
				if(!this.$u.test.mobile(this.mobile)){
					this.$u.toast('手机号码不正确');
					return false;
				}
				if(this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码',
						mask: true
					})
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						this.$u.toast('验证码已发送');
						
						this.msgCodeHasSend = true;
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 2000);
				} else {
					this.$u.toast('请稍候~');
				}
			},
			getPhoneNumber(e){
				let userinfo = this.$store.state.wxuserprofile;
				userinfo.iv = e.detail.iv;
				userinfo.encryptedData = e.detail.encryptedData;
				userinfo.code = this.code; 
				userinfo.appId = this.appId;
				this.$u.api.mpLogin(userinfo).then((res)=>{
					this.$zoomla.setLogin(res.result);
				}).catch((err)=>{
					this.$u.toast(err.retmsg)
				})
			},
			//获取验证码
			requestMsgCode(){
				if(!this.agreementChecked){
					this.$u.toast('请先阅读并勾选服务协议');
					return;
				}
				this.getMsgCode();
			},
			agreement1(){
				this.$u.toast('协议')
			},
			codeChange(text) {
				this.codeTips = text;
			},
		},
		onLoad() {
			uni.login({
				provider:'weixin',
				success: (res) => {
					this.code = res.code;
				}
			})
		}
	}
</script>

<style lang="scss">
.tradition-login{
	& ~ .agreement{
		margin: 80rpx 80rpx 0;
	}
	
	.do-login-btn{
		
	}
	.request-code-btn{
		
	}
}
.mp-login{
	margin: 50rpx 60rpx;
	
	.mp-logo{
		margin-bottom: 20rpx;
		image{
			width: 100%;
			height: 300rpx !important;
		}
	}
	
}
.mp-login-btn{
	margin: 40rpx 0;
}
.header{
	font-size: 40rpx;
	color: #303133;
}
.tips{
	font-size: 26rpx;
	color: #82848A;
	margin-top: 30rpx;
}
.input-block{
	margin-top: 40rpx;
	margin-bottom: 80rpx;
	padding-bottom: 16rpx;
	border-bottom: 2rpx solid #82848A;
}

.agreement{margin: 80rpx 60rpx 0;align-items: flex-start;}
.checkbox{font-size: 0;margin-top: 9rpx;}
.agreement-text{margin-left: -8rpx;color: $u-tips-color;}
.agreement-link{color: $u-type-warning-dark;}
</style>
