<template>
	<view style="flex:1; display:flex; flex-flow:column;">
		<view v-for="item in layout" :class="item.type == 'image' ? 'vd_page_image' : ''"
			:style="item.type == 'image' ? {'height':'300px'} : {}" :id="'layoutItem_'+item.id"
			 @click="$root.u_uploadImg(function(path) { item.content=path; })">
			<view class="vd_page_image_content" v-if="item.type == 'image'"
				:style="{
					'background-image':'url('+$u.http.config.baseUrl+(!item.content ? '/UploadFiles/nopic.svg' : item.content)+')',
				}"></view>
			<u-parse :html="item.content" :tag-style="style.uparseTag" v-else></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		props: ["layout"],
		data() {
			return {
				style: {
					uparseTag: {
						"p": "font-size:16px;"
					}
				},
			}
		},
		methods: {
		}
	}
</script>

<style>

</style>
