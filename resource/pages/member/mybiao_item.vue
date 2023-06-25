<template>
<view>
<view>
	<u-swiper :list="article.pics" :autoplay="false" height="500"></u-swiper>
</view>
<view class="mybiao_item">
<text class="mybiao_itemTit">基本信息</text>
<u-table border-color="#fff" bg-color="#FAFAFA">
	<u-tr>
		<u-th>作品名称</u-th>
		<u-td>{{article.title}}</u-td>
	</u-tr>
	<u-tr>
		<u-th>归属客户</u-th>
		<u-td>{{article.iname}}</u-td>
	</u-tr>
	<u-tr>
		<u-th>所在地区</u-th>
		<u-td>{{article.szdq}}</u-td>
	</u-tr>
	<u-tr>
		<u-th>装裱类型</u-th>
		<u-td>{{article.zblx}}</u-td>
	</u-tr>
	<u-tr>
		<u-th>装裱形式</u-th>
		<u-td>{{article.zbxs}}</u-td>
	</u-tr>
	<u-tr>
		<u-th>交裱时间</u-th>
		<u-td>{{article.ztime||'未公开'}}</u-td>
	</u-tr>
	<u-tr>
		<u-th>完裱时间</u-th>
		<u-td>{{article.jtime||'未公开'}}</u-td>
	</u-tr>
</u-table>	
<text class="mybiao_itemTit">装裱日志</text>	
<u-parse class="mybiao_item_con" :html="article.content"></u-parse>	
</view>
<view class="mibao_itemPic">
	
<image mode="widthFix" width="100vw" style="width: 100vw;" :src="item" v-for="item in article.pics"></image>	
</view>

<view class="mybiao_itemDi">
	<u-button type="success" @click="$u.route('/pages/shop/renren')"><i class="zi zi_shekelsign"></i> 人人画艺术品置计划</u-button>
	<u-button type="warning"  @click="open"><i class="zi zi_qrcode"></i> 获取鉴真二维码</u-button>
</view>

<u-modal v-model="show" :title-style="{color: 'red'}" title="江西字研社精裱鉴真码">
	<view class="slot-content">
		<view class="share-image">
			<u-image :src="image" width="400rpx" height="400rpx"></u-image>
		</view>
		<rich-text :nodes="content"></rich-text>
	</view>
</u-modal>
</view>
</template>
<script>
	export default {
		data() {
			return {
				current: 0,
				mode: 'round',
				article:{},
				image:'',
				show: false,
				content: `
					宋式瘦金∞精装细裱-源自中国领先的字库全产业研究企业-逐浪字库团队，长按或截屏保存本二维码可分享给好友并用于溯源鉴真。<br><br>
				`
			}
		},
		onLoad(options){
			const that = this;
			let mu = this.$store.state.vuex_user;

			that.$u.get("content_get", {
				id: options.id || options.scene
			}).then(res => {
				if (res.retcode != 1) {
					return;
				}
				let data = res.result[0];
				data.createTime = data.createTime.toString().replace(/T/g, " ");
				for (let i = 1; i < res.result.length; i++) {
					that.article.content += res.resuslt[i].content;
				}				
			try {
				data.pics=[];
				let pics = JSON.parse(data.cpda);
				for (let i = 0; i < pics.length; i++) {
					data.pics.push(that.$u.http.config.baseUrl + "/UploadFiles/" + pics[i].url);
				}
				console.log(pics)
			} catch (e) {
				console.log(e)
				//TODO handle the exception
			}	
			that.article = data;			
				uni.setNavigationBarTitle({
					title: that.article.title
				});
				that.starReqData.title = that.article.title;
			});
			
			//生成分享码
			this.$u.get("user_share_miniprogram", {
				path: "pages/member/mybiao_item",
				scene: options.id
			}).then(res => {
				that.image = that.$u.http.config.baseUrl + res.result;
			});

			// that.starReqData = {
			// 	openid: mu.openid,
			// 	id: options.id,
			// 	type: 1
			// };
			
		},
		methods: {
			open() {
				this.show = true;
			}
		}
	}
</script>
<style lang="scss" scoped>
.slot-content {font-size: 28rpx;color: $u-content-color;padding-left: 30rpx;text-align: center;}
.share-image{display: inline-block;margin-top: 40rpx;}
.ismall{opacity: .05;}
</style>
