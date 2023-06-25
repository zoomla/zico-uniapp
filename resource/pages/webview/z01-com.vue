<template>
    <view>
        <web-view :webview-styles="webviewStyles" src="https://www.z01.com"></web-view>
    </view>
</template>

<script>
export default {
		data() {
				return {
						webviewStyles: {
								progress: {
										color: '#EEEEEE'
								}
						}
				}
		}
}
</script>

<style>

</style>