<template>
	<view class="content">
		<picShow :imgList="conlist" @bindTab="showDetail"></picShow>
	</view>
</template>

<script>
	import picShow from '../../components/picShow.vue'
	export default {
		components: {
			picShow
		},
		data() {
			return {
				conlist:[],
			}
		},
		methods: {
			bindTab(e){
				// console.log(e)
			},
			getConlist(){
				this.$u.get('content_list',{
					nid:13,
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
		},
		onLoad(){
			this.getConlist()
		},
		onReady() {
			uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: '#0F0F11',
					animation: {
							duration: 400,
							timingFunc: 'easeIn'
					}
			})
		},		
	}
</script>
<style>
page{background:#0F0F11;color: #a3a3a3;	}
.content {display: flex;flex-direction: column;	align-items: center;justify-content: center;	}
.logo {height: 200rpx;width: 200rpx;margin-top: 200rpx;margin-left: auto;	margin-right: auto;	margin-bottom: 50rpx;	}
.text-area {display: flex;justify-content: center;}
.title {font-size: 36rpx;color: #8f8f94;}
</style>
