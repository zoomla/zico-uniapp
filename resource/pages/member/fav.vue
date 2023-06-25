<template>
	<view>
		<u-cell-group v-if="list.length > 0">
			<u-cell-item @click="showDetail(item.InfoID)" v-for="item in list"
			  :label="$u.timeFormat(Date.parse(item.FavoriteDate),'yyyy-mm-dd hh:MM:ss')" 
			 :key="item.FavoriteID"  
			 :title="item.Title">
			</u-cell-item>
		</u-cell-group>
		<view class="tips" v-else>
			暂无收藏记录
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			};
		},
		onLoad() {
			if(this.$zoomla.isLogin()){
				this.starList()
			}
		},
		methods:{
			//收藏列表
			starList(){
				let mu = this.$store.state.vuex_user;
				this.$u.get('user_star_list',{uid:mu.userId}).then((res)=>{					
					this.list = res.result
				}).catch((err)=>{
					console.log(err)
				})
			},
			showDetail(id){
				const that = this;
				uni.$once('collect_reloadlist',function(){
					that.starList()
				})
				uni.navigateTo({
					url: '/pages/home/enjoy_item?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss">
.tips{
	color: #777;
	margin: 50rpx 0 ;
	text-align: center;
	}
</style>
