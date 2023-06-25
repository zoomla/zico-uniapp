<template>
	<view class="navigation">
		<ul>
			<view class="list" :class="currPage == item.path && item.path ? 'active' : ''"
				v-for="item in list" v-on:click="switchTo(item)">
				<view class="mybarA">
					<view class="icon"><i class="zi" :class="item.ico"></i></view>
					<view class="text">{{item.name}}</view>
				</view>
			</view>
			<div class="indicator"></div>
		</ul>
	</view>
</template>

<script>
	export default {
		name: "mybar",
		data() {
			return {
				currPage: "",
				list: [
					{name: "发现", ico: "zi_baodingcity", path: "/pages/home/index"},
					{name: "书法", ico: "zi_writing", path: "/pages/home/create"},
					{name: "画作", ico: "zi_lotus", path: "/pages/home/enjoy"},
					{name: "著述", ico: "zi_braille", path: "/pages/home/live"},
					{name: "会员", ico: "zi_tmBaowugroup", path: "/pages/home/ucenter"},
				]
			};
		},
		created() {
			const that = this;
			setInterval(function () {
				let pages = getCurrentPages();
				let route = "/" + pages[pages.length - 1].route;
				let exists = that.list.findIndex(curr => curr.path == route) > -1;
				if (exists) {
					that.currPage = route;
				}
			}, 50);
		},
		methods: {
			switchTo(item) {
				uni.switchTab({
					url: item.path
				});
			}
		}
	}
</script>
<style>
</style>
