<template>
	<view class="enjoy_list">
<!-- 		当前节点名：
		{{article.NodeName}}
		文章列表：
		<hr> -->

<!-- 		<view>
			<view class="enjoy_list_title">的“江南无所有，聊赠一支春。”春风桃李花开日，谁人遥送一中华人民共和国支春？这首诗是来自快递的古代业务写作出来</view>
			<view class="enjoy_list_sys">这应该是中国自有快递业以来，最浪费的一次快递了吧，纵使穿千年到了现在的中中华人民共和国华人民共和国也是满满的诚意和感动</view>			
			<view class="enjoy_list_pic">
			<image src="//www.sjtzj.com/UploadFiles/Images/weixin/a2.jpg" mode="widthFix" ></image>
			</view>
		</view> -->
		
		<view @tap="showDetail(items.GeneralID)" v-for="(items,list) in conlist" :key="list">
			<view class="enjoy_list_title">{{items.Title}}</view>
			<view class="enjoy_list_sys">{{items.synopsis}}</view>			
			<view class="enjoy_list_pic" v-if="items.TopImg != 'https://www.sjtzj.com/UploadFiles/nopic.svg'">
			<image :src="items.TopImg" mode="widthFix" ></image>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				article:[],
				conlist:[]
			}
		},
		onLoad(options){
			const that=this;
			that.$u.get("node_list",{
				ids:options.nid
			}).then(res=>{
				if(res.retcode !=1){
					return;
				}
				let data=res.result[0];
				that.article=data;
				// for (let i=1;i<res.result.length;i++){
				// 	that.article.content += res.resuslt[i].content;
				// }
				uni.setNavigationBarTitle({
					title:that.article.NodeName
				})
			});
			this.$u.get('content_list',{
				nid:options.nid,
				elite:0
			}).then((res)=>{
				// console.log(res) //输出结果
				this.conlist=res.result;
			});
			// this.getConlist()
		},
		methods: {
			// getConlist(){ //获取文章列表
			// 	this.$u.get('content_list',{
			// 		pnid:2,
			// 		elite:0
			// 	}).then((res)=>{
			// 		// console.log(res) //输出结果
			// 		this.conlist=res.result;
			// 	})
			// },
			showDetail(itemid){
				uni.navigateTo({
					url:'/pages/home/enjoy_item?id='+itemid
				})
			}
		},
	}
</script>
<style>

</style>
