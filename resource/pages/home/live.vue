<template>
<view>
	<view class="home_search">
		<u-search placeholder="检索动妖技术文献" :show-action="false" @search="toSearch" v-model="keyword"></u-search>
	</view>
<view class="live_list_box">
<view class="live_list" @click="$u.route('/pages/channel/hui?nid=49')">
	<img src="https://www.sjtzj.com/UploadFiles/Images/weixin/a2.jpg"></image>
	<view>西江会-汇聚贤者的空间</view>
</view>	
<view class="live_list" @click="$zoomla.goto_shopNid('52')">
	<img src="https://www.sjtzj.com/UploadFiles/Images/weixin/a7.png?i3=f31"></image>
	<view>逐浪字库专营店</view>
</view>	
<view class="live_list" @click="$u.route('pages/channel/class_super?nid=51')">
	<img src="https://www.sjtzj.com/UploadFiles/Images/weixin/a8.jpg"></image>
	<view>装裱课堂</view>
</view>
<view class="live_list" @click="$u.route('pages/channel/class_super?nid=29')">
	<img src="https://www.sjtzj.com/UploadFiles/Images/weixin/a13.jpg"></image>
	<view>学术中心</view>
</view>
<view class="live_list" @click="$u.route('pages/channel/class?nid=36')">
	<img src="https://www.sjtzj.com/UploadFiles/Images/weixin/a9.jpg"></image>
	<view>当代名家</view>
</view>
<view class="live_list" @click="$u.route('pages/channel/class?nid=34')">
	<img src="https://www.sjtzj.com/UploadFiles/Images/weixin/a12.jpg"></image>
	<view>宋史窥真</view>
</view>
<view class="live_list" @click="$u.route('pages/channel/class?nid=5')">
	<img src="https://www.sjtzj.com/UploadFiles/Images/weixin/a10.jpg"></image>
	<view>道君真宗</view>
</view>
<view class="live_list" @click="$u.route('pages/channel/class?nid=22')">
	<img src="https://www.sjtzj.com/UploadFiles/Images/weixin/a11.jpg"></image>
	<view>汉服研究</view>
</view>
<!-- <view class="live_list">
	<img src="//www.sjtzj.com/UploadFiles/Images/weixin/a2.jpg"></image>
	<view>宣纸</view>
</view>
<view class="live_list">
	<img src="//www.sjtzj.com/UploadFiles/Images/weixin/a3.jpg"></image>
	<view>文房雅韵</view>
</view>
<view class="live_list">
	<img src="//www.sjtzj.com/UploadFiles/Images/weixin/a4.jpg"></image>
	<view>徽州名砚</view>
</view>
<view class="live_list">
	<img src="//www.sjtzj.com/UploadFiles/Images/weixin/a5.jpg"></image>
	<view>书道讲解</view>
</view> -->
</view>
<view class="live_more_title">探索更多</view>
<view class="live_more">
	<view class="live_more_list" @click="$u.route('/pages/channel/class?nid=38')"><i class="zi zi_duilian"></i> 古法精裱</view>
	<view class="live_more_list" @click="$u.route('/pages/home/enjoy_item?id=872')"><i class="zi zi_wallet"></i> 典藉修复</view>
	<view class="live_more_list" @click="$u.route('/pages/home/enjoy_item?id=871')"><i class="zi zi_dragon"></i> 宣和款精裱</view>
	<view class="live_more_list" @click="$u.route('/pages/channel/class?nid=53')"><i class="zi zi_SquareTable"></i> 书法培训</view>
	<view class="live_more_list" @click="$u.route('/pages/channel/hui?nid=49')"><i class="zi zi_language"></i> 艺术鉴赏</view>
	<view class="live_more_list" @click="$u.route('/pages/shop/shop_class?nid=48')"><i class="zi zi_copyfile"></i> 书法订制</view>
</view>

<view class="live_more_title">节点清单：</view>
<view style="padding:0 36rpx;color: #666;">
<view v-for="(node,i) in nodesss" :key="i">
	<view>{{node.NodeName}} </view>
</view>
</view>
<mybar></mybar>	
</view>
</template>
<script>
	export default {
		data() {
			return {
				nodesss: [],
				keyword: ""
			}
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
		methods: {
			getNlist(){
				//接口的action
				this.$u.get('node_list').then((res)=>{
					console.log(res) //请求结果
					this.nodesss=res.result;
				})
			},
			toSearch(){  // 去搜索
				// 关键字为空不允许搜索
				if (!this.keyword) {
					uni.showToast({
						title: "请输入关键字",
						icon: "none"
					})
					return;
				}
				uni.navigateTo({
					url:`/pages/channel/search?keyword=${this.keyword}`  
				})
			},			
		},
		onLoad(){
			this.getNlist()
		},
	}
</script>
<style>
page{background-color:#0F0F11;color: #ccc;}
</style>
