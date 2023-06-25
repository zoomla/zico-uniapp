<template>
<view class="mybiao">
<view class="mybiao_top">
<text>为每一件艺术品建立永久档案</text>	
</view>
<view class="mybiao_fu">
<u-row gutter="16" justify="center">
	<u-col span="6" @click="$u.route('/pages/shop/shop')"><u-icon name="red-packet-fill" color="#EED7AB" size="118"></u-icon>
	选购字画
	</u-col>
	<u-col span="6" @click="$u.route('/pages/channel/biao')"><u-icon name="star-fill" color="#19BE6B" size="118"></u-icon>
	我要精裱
	</u-col>
</u-row>	
</view>
<view class="mybiao_list">

<view @tap="showDetail(items.GeneralID)" v-for="(items,list) in conlist" :key="list" class="mybiao_listItem">
<u-image width="200rpx" height="140rpx" :src="items.TopImg"></u-image>	
	<view class="mybiao_listItem_r">{{items.Title}}
	<text><u-icon name="clock"></u-icon> {{items.CreateTime}} / {{items.zblx}}  <i class="zi zi_qrcode"></i>鉴真码</text>
	</view>
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
				this.$u.get('content_list',{
					nid:37,
					elite:0,
					myfield:'glky='+this.$store.state.vuex_user.userId
				}).then((res)=>{
					// console.log(res);
					for	(let i=0;i<res.result.length;i++){
						res.result[i].CreateTime=res.result[i].CreateTime.toString().replace(/T/g," ");
					}
					this.conlist=res.result;
				})
			},
			showDetail(itemid){
				uni.navigateTo({
					url:'/pages/member/mybiao_item?id='+itemid
				})
			}
		},
		onLoad(){
			this.getConlist();
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#0f0f11',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			});
		},
	}
</script>
<style>
</style>
