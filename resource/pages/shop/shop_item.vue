<template>
	<view class="shop_item">
		<view class="">
			<u-swiper :list="shopcon.pics" :autoplay="false" height="500"></u-swiper>
		</view>

		<!-- 备选swip图片轮播方法（以及swip dot：			 -->
		<!-- 			<view class="detail_img u-skeleton-fillet">
					<u-swiper :list="shopcon.pics" @click="showArticle" :autoplay="true" :title-style="swiperTitleStyle" title="false" interval="3600" height="420" mode="rect" indicator-pos="bottomCenter" border-radius="0" img-mode="scaleToFill"></u-swiper>
			</view> 
			
		data() {
			return {
				swiperTitleStyle:{
					// width: "100%",
					// hieght: "100%",
					// top: "0 !important",
					// display: "flex",
					// justifyContent: "center",
					// alignItems: "center",
					// fontSize: "40rpx",
					// whiteSpace: "normal",
					background: "rgba(0,0,0,0)",
					textAlign: "center",
				},		
			
			-->

		<view class="shop_item_con">
			<view>产品名称：{{shopcon.title}}</view>
			<view>上架时间：{{shopcon.AddTime}}</view>
			<view v-if="!(!specification.data || !specification.data.addon || !specification.data.addon.length)">
				<view>商品定价：{{specification.minPrice}} - {{specification.maxPrice}}</view>
			</view>
			<view v-else>
				<view>参考价格：<text class="del_line">{{shopcon.ShiPrice}}</text></view>
				<view>在线价格：{{shopcon.price}}</view>
			</view>
			
			<view class="detail_price" v-if="shopcon.nodeid!==6">
				{{shopcon.nodeid}} 购买数量：
				<u-number-box v-model="buyCount" :min="1"></u-number-box>
			</view>

			<view style="text-align:right;" @click="share.show = true;">
				<u-icon name="share"></u-icon>分享此件商品
			</view>

			<view class="detail_duction">
				<text>详细说明</text>
				<rich-text :nodes="shopcon.proInfo"></rich-text>
			</view>
			<view class="detail_ductionPic">
				<image mode="widthFix" style="width: 100vw;" :src="item" v-for="item in shopcon.pics"></image>	
			</view>
		</view>

		<view class="detail_buy">
			<view class="detail_buy_i" @click="goindex"><i class="zi zi_writing"></i>首页</view>
			<view class="detail_buy_m" @click="addToCart(true)"><i class="zi zi_cartarrowPlus"></i> 立即购买</view>
			<view class="detail_buy_j" @click="addToCart"><i class="zi zi_plus"></i> 加入购物车</view>
		</view>

		<u-popup v-model="specification.viewShow" mode="bottom" height="800">
			<view class="detail_specListTitle">选择商品规格</view>
			<scroll-view scroll-y="true" class="detail_specList">
				<view class="detail_specListItem" v-for="(vgrp, vgidx) in specification.viewData" :key="vgidx">
					<view class="detail_specName">{{vgrp.name}}</view>
					<u-radio-group v-model="vgrp.selected" size="38" icon-size="28">
						<u-radio v-for="(vprop, vpidx) in vgrp.props" :key="vpidx"
							shape="square" active-color="#909399" :name="vprop.key">
							{{vprop.name}}
						</u-radio>
					</u-radio-group>
				</view>
			</scroll-view>
			<view class="detail_specFooter">
				<view class="detail_specPrice">￥{{getSpecMoney()}}</view>
				<view class="detail_specEndBtn" @click="specification.selected=true;addToCart(jumpCart)">确认选择</view>
			</view>
		</u-popup>
		<!-- 分享弹框 -->
		<u-popup v-model="share.show" mode="bottom" :border-radius="14">
			<view style="padding:24rpx 30rpx;">
				<view style="margin-bottom:20rpx; text-align:center; font-size:34rpx;">分享</view>
				<view class="u-flex" style="padding-bottom:30rpx; color:#19BE6B;">
					<view style="margin-right:50rpx;" @click="doShare('weixin_session')">
						<u-icon name="weixin-fill" :size="70"></u-icon>
					</view>
					<view @click="doShare('weixin_timeline')">
						<u-icon name="moments" :size="70"></u-icon>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				mode: 'round',
				jumpCart: false,
				shopcon: {
					id: 0,
					title: "",
					ShiPrice: 0.00,
					price: 0,
					unit: "件",
					proInfo: "字研所小书童还没填写产品信息^_^",
					TopImg: "",
					nodeid:0,
					pics: [
						'//www.sjtzj.com/UploadFiles/Images/weixin/3.jpg',
					]
				},
				specification: {
					data: null,
					viewData: [],
					viewShow: false,
					selected: false,
					minPrice: 0,
					maxPrice: 0,
				},
				buyCount: 1,
				hisUpdate: {
					isUpdated: false,
					isUpdating: false,
					updateTimer: null
				},
				share: {
					show: false
				}
			}
		},
		methods: {
			goindex() { //返回首页
				uni.reLaunch({
					url: '/pages/home/index',
				})
			},
			addToCart(jump) {
				if (!this.$zoomla.isLogin()) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				if (typeof jump == "boolean") {
					this.jumpCart = jump;
				} else {
					this.jumpCart = false;
				}

				if (!this.specification.selected && !(!this.specification.data || !this.specification.data.addon || !this.specification.data.addon.length)) {
					this.specification.viewShow = true;
					return;
				}
				uni.showLoading({
					mask: true
				});

				let mu = this.$store.state.vuex_user;
				let postData = {
					proID: this.shopcon.id,
					proNum: this.buyCount,
					uid: mu.userId
				};
				if (this.specification.selected) {
					let selectedKeys = [];
					for (let i = 0; i < this.specification.viewData.length; i++) {
						selectedKeys.push(this.specification.viewData[i].selected);
					}
					let selectedKeysStr = selectedKeys.sort().toString();
					let selectedNamesStr = "";
					for (let i = 0; i < this.specification.data.groups.length; i++) {
						const group = this.specification.data.groups[i];
						for (let j = 0; j < group.properties.length; j++) {
							const property = group.properties[j];
							if (selectedKeysStr.indexOf(property.key) > -1) {
								selectedNamesStr += property.name + " ";
							}
						}
					}
					let selectedAddon = null;
					for (let i = 0; i < this.specification.data.addon.length; i++) {
						const addon = this.specification.data.addon[i];
						if (JSON.parse(JSON.stringify(addon.fkey)).sort().toString() == selectedKeysStr) {
							selectedAddon = addon;
						}
					}

					postData.specTxt = selectedNamesStr;
					postData.specJson = JSON.stringify(selectedAddon);
				}

				this.$u.post("cart_add", postData).then(res => {
					uni.showToast({
						title: '加入购物车成功',
						icon: 'none'
					});

					this.specification.viewShow = false;
					this.specification.selected = false;
					this.EventBus.$emit("cartHaveChange");
					this.uphis();

					if (this.jumpCart) {
						setTimeout(function() {
							uni.navigateTo({
								url: "cart"
							});
						}, 600);
					}
				}).catch(() => {
					uni.showToast({
						title: '加入购物车失败',
						icon: 'none'
					});
				});
			},
			getSpecMoney() {
				if (!this.specification.data || !this.specification.data.addon || !this.specification.data.addon.length) {
					return;
				}
				let selectedKeys = [];
				for (let i = 0; i < this.specification.viewData.length; i++) {
					selectedKeys.push(this.specification.viewData[i].selected);
				}
				let selectedKeysStr = selectedKeys.sort().toString();
				let selectedAddon = null;
				for (let i = 0; i < this.specification.data.addon.length; i++) {
					const addon = this.specification.data.addon[i];
					if (JSON.parse(JSON.stringify(addon.fkey)).sort().toString() == selectedKeysStr) {
						selectedAddon = addon;
					}
				}
				return selectedAddon.retailPrice.toString();
			},
			// 更新点击数
			async uphis() {
				if (this.hisUpdate.isUpdating || this.hisUpdate.isUpdated) {
					return;
				}
				this.hisUpdate.isUpdating = true;
				let req = this.$u.post("product_uphis", {
					id: this.shopcon.id,
				}).then(res => {
					this.hisUpdate.isUpdated = true;
					this.hisUpdate.isUpdating = false;
					try {
						clearTimeout(this.hisUpdate.updateTimer);
						this.hisUpdate.updateTimer = null;
					} catch(e) {}
				}).catch(res => {
					this.hisUpdate.isUpdating = false;
				});
				let reqRes = await req;
			},
			// 分享
			doShare(mode) {
				uni.showLoading({
					title: "请稍等"
				});
				const functions = {
					"weixin_session": function() {
						const that = this;
						uni.share({
							provider: "weixin",
							scene: "WXSceneSession",
							type: 0,
							href: this.$u.http.config.baseUrl + "/Shop/" + this.shopcon.ID,
							title: this.shopcon.Proname,
							summary: this.shopcon.proInfo.replace(/<[^<>]+>/g, "").substr(30) + "...",
							imageUrl: this.shopcon.pics[0],
							success: function() {
								uni.hideLoading();
								that.share.show = false;
							}
						});
					},
					"weixin_timeline": function() {
						const that = this;
						uni.share({
							provider: "weixin",
							scene: "WXSenceTimeline",
							type: 0,
							href: this.$u.http.config.baseUrl + "/Shop/" + this.shopcon.ID,
							title: this.shopcon.Proname,
							summary: this.shopcon.proInfo.replace(/<[^<>]+>/g, "").substr(30) + "...",
							imageUrl: this.shopcon.pics[0],
							success: function() {
								uni.hideLoading();
								that.share.show = false;
							}
						});
					}
				};

				(functions[mode] || function(){ uni.hideLoading(); }).apply(this);
			}
		},
		onLoad(optins) {
			const that = this;
			that.$u.get("product_get", {
				id: optins.id
			}).then(res => {
				if (res.retcode != 1) {
					return;
				}

				const shopcon = res.result[0];
				if (!shopcon) {
					return;
				}

				let viewProduct = that.shopcon;
				viewProduct.id = shopcon.ID;
				viewProduct.title = shopcon.Proname; //商品名称
				viewProduct.ShiPrice = shopcon.ShiPrice; //市场参考价格
				viewProduct.price = shopcon.LinPrice; //在线销售价格
				viewProduct.unit = shopcon.ProUnit; //销售单位
				viewProduct.proInfo = that.$zoomla.formatRichText(shopcon.Procontent); //商品详述
				viewProduct.AddTime = shopcon.AddTime.toString().replace(/T/g, " "); //上架时间且格式化
				viewProduct.topImg = shopcon.Thumbnails; //商品缩图
				viewProduct.nodeid = shopcon.NodeID; //节点ID
				viewProduct.pics.splice(0, viewProduct.pics.length);
				viewProduct.pics.push(shopcon.Thumbnails);
				try {
					let pics = JSON.parse(shopcon.picture);
					for (let i = 0; i < pics.length; i++) {
						viewProduct.pics.push(that.$u.http.config.baseUrl + "/UploadFiles/" + pics[i].url);
					}
				} catch (e) {
					console.log(e)
					//TODO handle the exception
				}

				// 多属性
				for (let prop in shopcon) {
					try {
						let item = JSON.parse(shopcon[prop]);
						if (item["type"] != "Commodity") {
							continue;
						}
						if (!item["groups"] || !item["addon"]) {
							continue;
						}

						that.specification.data = item;
						for (let i = 0; i < item["groups"].length; i++) {
							const group = item["groups"][i];
							let viewGroup = {
								name: group.name,
								selected: (group["properties"][0] || { key: "" }).key,
								props: []
							};
							for (let j = 0; j < group["properties"].length; j++) {
								let property = group["properties"][j];
								viewGroup.props.push({
									key: property.key,
									name: property.name,
									image: property.image
								});
							}
							that.specification.viewData.push(viewGroup);
						}

						let tempData = JSON.parse(JSON.stringify(item.addon));
						tempData.sort((a, b) => a.retailPrice < b.retailPrice ? -1 : 1);
						that.specification.minPrice = tempData[0].retailPrice;
						that.specification.maxPrice = tempData[tempData.length - 1].retailPrice;

						break;
					} catch (e) {console.log(e);}
				}

				uni.setNavigationBarTitle({
					title: viewProduct.title
				})
				this.loading = false;

				// 如果商品库存不足
				if (shopcon.Stock <= 0) {
					uni.showModal({
						title: "商品库存不足",
						showCancel: false,
						confirmText: "好的",
						success: function() {
							uni.navigateBack();
						}
					});
				}
			});

			setTimeout(function() {
				that.uphis();
			}, 1000 * 10);
		},
		onUnload() {
			if (this.hisUpdate.updateTimer) {
				try {
					clearTimeout(this.hisUpdate.updateTimer);
				} catch(e) {}
			}
		},
	}
</script>

<style lang="scss">
.detail_specListTitle{display: flex; justify-content: center; align-items: center; height: 85rpx; text-align: center; color: #82848a; font-size: 30rpx;}
	
.detail_specList{height: calc(100% - 168rpx); padding: 15rpx 25rpx; box-sizing: border-box;}
.detail_specListItem{margin-bottom: 20rpx;}
.detail_specName{margin-bottom: 10rpx; font-size: 34rpx;}

.detail_specFooter{display: flex; justify-content: space-between;}
.detail_specPrice{display: flex; justify-content: center; align-items: center; width: 100%; color: #fa3534; font-size: 32rpx;}
.detail_specEndBtn{display: flex; justify-content: center; align-items: center; width: 380rpx; height: 85rpx; font-size:28rpx; color: #fff; background: #303133;}
</style>
