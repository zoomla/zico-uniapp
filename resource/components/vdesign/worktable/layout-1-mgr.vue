<template>
	<view>
		<view class="form-item form-item-row">
			<view class="form-label" style="display:flex; justify-content:space-between;">
				<text>内容</text>
				<text style="color:#fa3534;" @click="content=''">清空</text>
			</view>
			<view class="form-control">
				<u-input type="textarea" v-model="content" :border="true" :clearable="false" :maxlength="800"></u-input>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ["value"],
		data() {
			return {
			};
		},
		computed: {
			content: {
				get: function() {
					return (this.value.items[0] || {content: "<p>示例文本</p>"}).content;
				},
				set: function(val) {
					if(this.value.items[0]) {
						this.value.items[0].content = val;
					}
				}
			}
		},
		mounted() {
			const layout = this.value;

			if (!layout.items || !layout.items.length) {
				layout.items.push({
					id: this.$root.u_guid(),
					content: "<p>示例文本</p>"
				});
			}
		},
		methods: {
		}
	}
</script>

<style>

</style>
