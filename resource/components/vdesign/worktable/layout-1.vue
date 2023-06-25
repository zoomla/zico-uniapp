<template>
	<view class="layout">
		<u-parse :html="item.content" v-for="(item,index) in layout"></u-parse>
<!-- 		<editor placeholder="请输入内容" :read-only="$root.params.isLive"
			v-for="item in layout" :id="'el_'+item.id" @ready="editorReady($event)"></editor> -->
	</view>
</template>

<script>
	export default {
		props: ["layout"],
		data() {
			return {
			}
		},
		methods: {
			// editorReady(event) {
			// 	const that = this;
			// 	let cid = event.target.id.substring(3);
			// 	uni.createSelectorQuery()
			// 		.select("#" + event.target.id)
			// 		.context(function(res){
			// 			let item = that.layout.find(curr => curr.id == cid);
			// 			if (item) {
			// 				res.context.setContents({
			// 					html: item.content
			// 				});
			// 			}
			// 		})
			// 		.exec();
			// },
		}
	}
</script>

<style lang="scss">
.layout{display:flex; align-items:center;}
</style>
