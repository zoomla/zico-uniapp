<template>
	<view class="container">
		<view class="list">
			<view class="list-item" v-for="(item,index) in imgList" :key="index" @click="bindTab(item.GeneralID)">
				<image class="item-img" :src="item.TopImg" mode="widthFix"></image>
				<view class="content">
					{{item.Title}}
					<view class="slot">
						<slot></slot>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			imgList:{
				type:Array,
				default:()=>{
					return []
				}
			}
		},
		data() {
			return {
				
			}
		},
		onLoad() {
			
		},
		methods: {
			bindTab(e){
				this.$emit('bindTab',e)
			}
		}
	}
</script>
<style lang="scss" scoped>
.container{height: 100vh;overflow-y: scroll;}
.list {padding-top: 4rpx;column-count: 2;column-gap: 18rpx;margin: 10px;
	.list-item {display: inline-block;margin-top: 8px;
		width: 326rpx;
		background: white;
		box-shadow: 0 0 10rpx 0 rgba(194, 194, 194, 0.1);
		break-inside: avoid;
		padding-bottom: 20rpx;
		overflow: auto;
	.item-img{width: 100%;height: 140rpx;}
	.content{width: 94%;margin-left: 3%;font-size: 26rpx;margin-bottom: 10px;word-break: break-all;}
	}
}
	
</style>
