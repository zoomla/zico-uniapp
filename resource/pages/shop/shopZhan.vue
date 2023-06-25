<template>
<view class="shopZhan">
<view class="shopZhan_top">
<view><i class="zi zi_podcast"></i> 佶雅阁精品展</view>
<text>为有佳作可雅赏，所有作品源自江西字研®所团队原创，提供高品质书写、装裱和全流程服务，欢迎雅赏。</text>
</view>

<view class="shopZhan_list">
<view class="shopZhan_list_item" v-for="(item,index) in conlist" :key="index" @click="showDetail(item.ID)" >
	<view class="shopZhan_list_itemBox">
	<image :src="item.Thumbnails" mode="widthFix"></image>
	</view>
	<text>{{item.Proname}}</text>
</view>
</view>
	
	
	
</view>
</template>

<script>
	export default {
		data() {
			return {
				conlist:[],
			}
		},
		methods: {
			getConlist(){
				this.$u.get('product_list',{
					nid:6,
				}).then((res)=>{
					console.log(res)
					this.conlist=res.result;
				})
			},
			showDetail(ID){
				uni.navigateTo({
					url:'/pages/shop/shop_item?id='+ID
				})
			},			
		},
		onLoad(){
			this.getConlist()
		},
		onReady() {
			uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: '#365166',
					animation: {
							duration: 400,
							timingFunc: 'easeIn'
					}
			})
		},		
	}
</script>
<style>
page{}
.content {display: flex;flex-direction: column;	align-items: center;justify-content: center;	}
.logo {height: 200rpx;width: 200rpx;margin-top: 200rpx;margin-left: auto;	margin-right: auto;	margin-bottom: 50rpx;	}
.text-area {display: flex;justify-content: center;}
.title {font-size: 36rpx;color: #8f8f94;}
</style>
