<template>
<view>
<view class="create_about"  @click="open">
<i class="zi zi_compactdisc zi_load" ></i>汉字之美 逐浪而来
</view>	
	
<view class="create_hero"></view>
<view class="create_0"></view>
<view class="create_list">
<view @tap="showDetail(items.GeneralID)" v-for="(items,list) in conlist" :key="list">
<text :style="{fontFamily:items.Subtitle}">{{items.Title}}</text>
<small>{{items.synopsis}}</small>
</view>
</view>
<view class="create_more">
<u-button @click="goto('/pages/webview/zfont-list')">卓越字库-逐浪而来 探索更多[大量字体加载要15秒]</u-button>
</view>

<u-modal v-model="show" :mask-close-able="true"  @confirm="confirm" title="造字用字-首选逐浪"  confirm-text="☛点此开始欣赏逐浪精品字库">
	<view class="slot-content">
		<rich-text :nodes="content"></rich-text>
	</view>
</u-modal>
	<cart-footer></cart-footer>
</view>
</template>

<script>
	export default {
		data() {
			return {
				conlist:[],
				show:false,
				content:`<br/>逐浪是国内首屈一指的字库研发团队、国家高新科技企业。20年来专注于字体呈现与现代文字表达体系的研究，先后为海昏侯、明四家诸多抢救性文化工程提供字库研发支持。<br/>
				逐浪是国内首家提供unicode13规范、并唯一开放自研字体软件（非代理国外品牌）的公司 ，我们提供了丰富和开放的字体资讯、研究、工具和开源项目。
				`
			}
		},
		onReady() {
			uni.setNavigationBarColor({
					frontColor: '#000000',
					backgroundColor: '#CCCCCC',
					animation: {
							duration: 400,
							timingFunc: 'easeIn'
					}
			})
		},
		methods: {
			getConlist(){
				this.$u.get('content_list',{
					nid:14
				}).then((res)=>{
					console.log(res)
					this.conlist=res.result;
				})
			},
			showDetail(itemid){
				uni.navigateTo({
					url:'/pages/home/enjoy_item?id='+itemid
				})
			},
			goto(url) { //通用clik链接方法
				uni.navigateTo({
						url:url
				})
			},
			confirm() {
				setTimeout(() => {
					// 3秒后自动关闭
					this.show = false;
					// 如果不想关闭，而单是清除loading状态，需要通过ref手动调用方法
					// this.$refs.uModal.clearLoading();
				}, 3000)
			},
			open(){
				this.show=true;
			},
		},
		onLoad(){
			this.getConlist()
		},
		onShow(){

			// this.show=true
		}
	}
</script>
<style>
page{background: #303133;}
.slot-content {	font-size: 28rpx;color: $u-content-color;padding-left: 30rpx;}
</style>
