<template>
	<view>
		
		<view v-for="(node,index) in sectionList" :key="index">
			<u-section line-color="#007aff" class="node-section" @click="nodeList(node.NodeID)" :title="node.NodeName" sub-title="更多"></u-section>
			<u-cell-group >
				<u-cell-item icon="tags-fill" @tap="showDetail(item.GeneralID)" :title="item.Title" v-for="item in list[node.NodeID]" :key="item.GeneralID"></u-cell-item>
			</u-cell-group>
		</view>
		
		
		<view class="shop_list">
			<view class="shop_list_title"><i class="zi zi_tmGrandtrade"></i> 栏目名称</view>
		<u-grid :col="2">
				<u-grid-item @tap="showDetail(1)">
					<image src="//www.sjtzj.com/UploadFiles/Images/weixin/a1.jpg" mode="aspectFit"></image>
					<view class="grid-view">佶雅阁单次参观券</view>
					<text>80.00元</text>
				</u-grid-item>
				<u-grid-item @tap="showDetail(2)">
					<image src="//www.sjtzj.com/UploadFiles/Images/weixin/a2.jpg" mode="aspectFit"></image>					
					<view class="grid-view">西江会盟友卡</view>
					<text>360.00元</text>
				</u-grid-item>
				<u-grid-item  @tap="showDetail(4)">
					<image src="//www.sjtzj.com/UploadFiles/Images/weixin/a3.jpg" mode="aspectFit"></image>					
				<view class="grid-view">西江会学士卡</view>
				<text>720.00元</text>
				</u-grid-item>
				<u-grid-item  @tap="showDetail(5)">
					<image src="//www.sjtzj.com/UploadFiles/Images/weixin/a4.jpg" mode="aspectFit"></image>					
					<view class="grid-view">西江会导师卡</view>
					<text>108.00元</text>
				</u-grid-item>
			</u-grid>
		</view>
		
		<view class="shop_list">
			<view class="shop_list_title"><i class="zi zi_tmGrandtrade"></i> 栏目名称</view>
		<u-grid :col="2">
				<u-grid-item>
					<image src="//www.sjtzj.com/UploadFiles/Images/weixin/a5.jpg" mode="aspectFit"></image>					
					<view class="grid-view">字研所精裱充值卡300</view>
				</u-grid-item>
				<u-grid-item>
					<image src="//www.sjtzj.com/UploadFiles/Images/weixin/a6.jpg" mode="aspectFit"></image>					
					<view class="grid-view">字研所精裱充值卡500送50</view>
				</u-grid-item>
				<u-grid-item>
					<image src="//www.sjtzj.com/UploadFiles/Images/weixin/a4.jpg" mode="aspectFit"></image>					
					<view class="grid-view">字研所精裱充值卡1000送120</view>
				</u-grid-item>
				<u-grid-item>
					<image src="//www.sjtzj.com/UploadFiles/Images/weixin/a3.jpg" mode="aspectFit"></image>					
					<view class="grid-view">字研所精裱充值卡5000送800</view>
				</u-grid-item>
			</u-grid>				
		</view>
		
		<view class="shop_list">
		<u-grid :col="2">
				<u-grid-item>
					<u-icon name="photo" :size="46"></u-icon>
					<view class="grid-view">书画</view>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="photo" :size="46"></u-icon>
					<view class="grid-view">砚台</view>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="photo" :size="46"></u-icon>
					<view class="grid-view">订制书法</view>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="photo" :size="46"></u-icon>
					<view class="grid-view">册页</view>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="photo" :size="46"></u-icon>
					<view class="grid-view">手卷</view>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="photo" :size="46"></u-icon>
					<view class="grid-view">装框</view>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="photo" :size="46"></u-icon>
					<view class="grid-view">装框</view>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="photo" :size="46"></u-icon>
					<view class="grid-view">装框</view>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="photo" :size="46"></u-icon>
					<view class="grid-view">装框</view>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="photo" :size="46"></u-icon>
					<view class="grid-view">装框</view>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="photo" :size="46"></u-icon>
					<view class="grid-view">装框</view>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="photo" :size="46"></u-icon>
					<view class="grid-view">装框</view>
				</u-grid-item>
			</u-grid>			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nodeId: 43,
				list: {},
				searchList:[],
				sectionList:[],
				currentPage: 1,
				hasMore: false,
						keyword:''
			}
		},
		onShow() {
			if(this.$u.test.isEmpty(this.nodeId)){
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
			this.getNodeInfo()
		},		
		methods: {
			showDetail(itemid){  //进入指定ID商品
				uni.navigateTo({
					url:'/pages/shop/shop_item?id='+itemid
				})
			},
			getNodeInfo(){
				this.$u.get('node_list',{pid:43}).then((res)=>{
					this.sectionList = res.result;
					res.result.forEach((v)=>{
						this.getArtList(v.NodeID)
					})
				
				}).catch((err)=>{
					console.log(err)
				})
			},
			getArtList(NodeID){
				let param = {
					pnid: 0,
					modelId: 2,
					nid: NodeID,
					psize: 6,
					cpage: 1
				}
				this.$u.get('content_list',param).then((res)=>{
					this.$set(this.list,NodeID,res.result)
				}).catch((err)=>{})
			},			
			
		}
	}
</script>

<style>
page{background: #F0F0F0;}
</style>
