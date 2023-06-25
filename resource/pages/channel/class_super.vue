<template>
	<view class="enjoy_list">
<!-- 		当前节点名：
		{{article.NodeName}}
		文章列表：
		<hr> -->

		
		<view v-for="(node,index) in sectionList" :key="index">
			<u-section line-color="#007aff" class="node-section" @click="nodeList(node.NodeID)" :title="node.NodeName" sub-title="更多"></u-section>
			<u-cell-group >
				<u-cell-item icon="tags-fill" @tap="showDetail(item.GeneralID)" :title="item.Title" v-for="item in list[node.NodeID]" :key="item.GeneralID"></u-cell-item>
			</u-cell-group>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// nodeId: 51,
				list: {},
				searchList:[],
				sectionList:[],
				currentPage: 1,
				hasMore: false,
						keyword:'',
						nid:0,
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
					url:'/pages/home/enjoy_item?id='+itemid
				})
			},
			getNodeInfo(){
				this.$u.get('node_list',{pid:this.nid}).then((res)=>{
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
			nodeList(nodeId){
				uni.navigateTo({
					url: '/pages/channel/class?nid='+nodeId
				})
			}			
		},
		onLoad(options){
			this.nid=options.nid;
			this.$u.get('node_get',{id:options.nid}).then((res)=>{
					uni.setNavigationBarTitle({
						title:res.result.NodeName
					})
				}).catch((err)=>{})			
		},
	}
</script>
<style>
/* page{background:#0F0F11;color: #a3a3a3;	} */
</style>
