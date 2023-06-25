<template>
	<view class="vd_swiper_container">
		<view class="vd_swiper_opera" style="padding-right:20rpx;" @click="prev()"><u-icon name="arrow-left"></u-icon></view>
		<view class="vd_swiper">
			<view class="vd_swiper_content" :style="viewStyle">
				<view class="vd_swiper_item" style="height:450rpx;" v-for="(item,index) in layout">
					<view class="vd_swiper_item_content" :style="{
							'background-image':'url('+$u.http.config.baseUrl+(!item.image ? '/UploadFiles/nopic.svg' : item.image)+')',
						}"></view>
					<view class="vd_swiper_item_title"><u-parse :html="item.title"></u-parse></view>
				</view>
			</view>
		</view>
		<view class="vd_swiper_opera" style="padding-left:20rpx;" @click="next()"><u-icon name="arrow-right"></u-icon></view>
	</view>
</template>

<script>
	export default {
		props: ["layout"],
		data() {
			return {
				current: 0,
				timer: null
			};
		},
		mounted() {
			this.timeTo();
		},
		computed: {
			viewStyle: function() {
				let index = this.current;
				if (index >= this.layout.length) {
					index = 0;
				}
				if (index < 0) {
					index = this.layout.length - 1;
				}

				this.current = index;
				return {
					left: index * 100 * -1 + "%"
				};
			}
		},
		methods: {
			prev() {
				this.timeTo();
				this.current--;
			},
			next() {
				this.timeTo();
				this.current++;
			},
			timeTo() {
				const that = this;
				clearTimeout(this.timer);
				this.timer = setTimeout(function() {
					that.next();
				}, 5000);
			},
		}
	}
</script>

<style lang="scss" scoped>
.vd_swiper_container{display:flex; width:100%;}
.vd_swiper_opera{flex-direction:0; align-self:center;}
.vd_swiper{width:100%; overflow:hidden;}
.vd_swiper_content{display:flex; width:100%;position:relative;transition:all ease .3s;}
.vd_swiper_item{flex-shrink:0;display:block;width:100%;position:relative;background:rgba(0,0,0, .15);border-radius:8rpx;cursor:pointer}
.vd_swiper_item_title{padding:8rpx; position:absolute; bottom:0; left:0;}
.vd_swiper_item_content{width:100%; height:100%; background-repeat:no-repeat; background-size:100% auto; background-position:50% 50%;}
</style>
