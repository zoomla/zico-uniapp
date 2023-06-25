<template>
	<view>
		<view class="top-swiper">
			 <view class="bg">
				 <view class="placeholder"></view>
				 <view class="image">
					 <!-- <image :src="conlist[0].TopImg" mode="aspectFill"  @click="$u.route('/pages/shop/shop')"></image> -->
				 </view>
			 </view>

			 <view class="box">
			 	<swiper class="swiper" :previous-margin="swiper.margin" :next-margin='swiper.margin' :circular="true" @change="swiperChange">
			 		<swiper-item v-for="(item,index) in conlist" :key="index">
						<image class='le-img' :src='item.TopImg' :class="{'le-active':swiper.index == index}" @click="$u.route('/pages/shop/shop')"></image>
			 		</swiper-item>
			 	</swiper> 
			 </view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				swiper: {
					margin: "150rpx",
					index: 0,
					list: [
						// "//www.sjtzj.com/uploadfiles/images/weixin/0.jpg",
						// "//www.sjtzj.com/uploadfiles/images/weixin/2.jpg",
						// "//www.sjtzj.com/uploadfiles/images/weixin/4.jpg",
						// "//www.sjtzj.com/uploadfiles/images/weixin/3.jpg",
						// "//www.sjtzj.com/uploadfiles/images/weixin/5.jpg",
					]
				},
				conlist:[],
			}
		},
		components: {

		},
		mounted() {
			this.getConlist();
		},
		methods: {
			//swiper滑动事件
			swiperChange: function(e) {
				this.swiper.index = e.detail.current;
			},
			getConlist(){ //获取文章列表
				this.$u.get('content_list',{
					nid:10,
					elite:0
				}).then((res)=>{
					// console.log(res) //输出结果
					// this.conlist.topImg=this.$u.http.config.baseUrl + data.topImg; //图片地址拼接
					this.conlist=res.result.sort((a, b) => a.GeneralID > b.GeneralID ? 1 : -1);
				})
			},
		},
		onLoad() {
			/**
			 * 组件不存在 onLoad 事件，onLoad 事件专用于页面，在组件里要达到类似于 onLoad 的效果需使用 mounted 事件
			 */
		},
	}
</script>
<style lang="scss">
	.top-swiper{ /*margin-bottom: 30rpx;*/
		.bg{padding-top: var(--status-bar-height);box-sizing: content-box;width: 100%;position: relative;			
			.placeholder{	box-sizing: content-box;padding-top: 600rpx;height:10px;	} //指定下方隔离高度
			.image{	box-sizing: content-box;position: absolute;	z-index: 1;	top: 0;	left: 0;width: 100%;height: 100%;	overflow: hidden;
				&::after{content: '';position: absolute;width: 100%;height: 100%;z-index: 1;bottom: 0;left: 0;	height: 65%;
				// background-image: linear-gradient(to bottom ,transparent, #FFF);
				}
				> image{position: absolute;box-sizing: content-box;padding: 60px;top: 0;left: 0;width: 100%;height: 80%;top: -60px;left: -60px;filter: blur(100rpx);background-color: #000;
				}
			}
		}
		.box{padding-top: var(--status-bar-height);box-sizing: content-box;position: absolute;z-index: 5;top: 0;left: 0;width: 100%;height: auto;}
		.swiper {height: 600rpx;margin: 0 20rpx;
			.le-img {display: block;width: 100%;height: 100%;transform: scale(0.9);transition: transform 0.3s ease-in-out 0s;border-radius: 4px;		
				&.le-active {transform: scale(1);}
			}
		}
	}
</style>