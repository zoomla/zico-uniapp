<template>
	<view>
		<view class="well_sarchBox"  style="height: 400rpx; background: linear-gradient(188deg,#e4e7ee 50%,#fff 50%)">
			<view class="well_search" >
					<!-- <image @click="go_indexUcenter" class="well_pics" :src="src1" mode="aspectFill"></image> -->
					<u-search placeholder="搜索开发资源与知识" actionText="" v-model="keyword"></u-search>
					<!-- <view @click="$u.route('/pages/shop/shop')"><i class="zi zi_cartarrowPlus"></i></view> -->
		</view>
		</view>
		
		<view class="well_listBox">
		<view class="well_list1" @click="goto('/pages/vdesign/board')">
			<h1>拖拽建站</h1>
			<small>轻松操作5分钟免代码建站</small>
		</view>
		<view class="well_list2" @click="goto('/pages/qrcode/index')">
			<h1>二维码生成</h1>
			<small>免费高效的二维码生成工具</small>
		</view>
		<view class="well_list3">
			<h1>词云</h1>
			<small>生成特色的字体云图</small>
		</view>
		<view class="well_list4" @click="goto('/pages/ocr/index')">
			<h1>在线OCR识别</h1>
			<small>上传图片识别为文字可编辑</small>
		</view>
		<view class="well_list5">
			<h1>H5设计</h1>
			<small>轻松做出H5设计</small>
		</view>
		<view class="well_list5" @click="goto('/pages/wfont/worktable')">
			<h1>在线做字</h1>
			<small>设计你自己专属的字库</small>
		</view>
		</view>
		
		<view class="index_well">
			<!-- <view @click="goto('/pages/shop/shopZhan')">
				<view class="index_well_icon"><i class="zi zi_paintbrush"></i></view>
				<view class="index_well_start">
				<strong>装裱知识</strong>
				<span>当代瘦金珍品收藏</span>
				</view>
			</view> -->
			<view @click="go_showIndex">
				<view class="index_well_icon"><i class="zi zi_paintbrush"></i></view>
				<view class="index_well_start">
				<strong>佶雅阁精展</strong>
				<span>当代瘦金珍品收藏</span>
				</view>
			</view>
			<view @click="goto('/pages/channel/biao')">
				<view class="index_well_icon"><i class="zi zi_slidersh"></i></view>
				<view class="index_well_start">
				<strong>古法装裱局</strong>
				<span>宣和神韵天水技传</span>
				</view>
			</view>
			<view @click="goto('/pages/channel/hui?nid=49')">
				<view class="index_well_icon"><i class="zi zi_schoolDesk"></i></view>
				<view class="index_well_start">
				<strong>西江会</strong>
				<span>凝聚文化人的智慧</span>
				</view>
			</view>
			<!-- <view @click="goto('/pages/channel/edu')"> -->
			<view @click="goto('/pages/channel/class?nid=53')">
				<view class="index_well_icon"><i class="zi zi_magic"></i></view>
				<view class="index_well_start">
				<strong>瘦金传习社</strong>
				<span>30天移魂法训练营</span>
				</view>
			</view>
		</view>
		<view class="index_listBox">
		<!-- <view class="index_list"  @tap="showDetail(items.GeneralID)" v-for="(items,list) in conlist" :key="list">
			<view class="index_list_pic">
			<img :src="items.TopImg" mode="widthFix"></image>
			</view>
			<view class="index_list_txt">
				<view class="index_list_txtTitle">{{items.Title}}</view>
				<view> {{items.CreateTime}}</view>
				</view>
		</view> -->
		<u-button class="index_more" @click="go_indexMore">阅读更多 +</u-button>
		</view>
		
		<view class="index_about">
			<view>Powered by 江西出海软件科技有限公司</view>
			<p>动妖创作云-云开发、找资源、造字用字及装裱，归属于江西出海软件科技有限公司旗之江西字研&reg;所团队，我们专注于web开发18年，提供丰富的OA、CMS、ERP、移动全栈开发，是目前国内尚未在百度GOOGLE上能检索到有第二家集成字体、CMS、图标、图库全闭环自主知识产权的软件服务商，是国家高新科技企业，分别在南昌、上海、北京设立研发中心，服务高端产业客户。</p>
		</view>
	<!-- <cart-footer></cart-footer> -->
	<mybar></mybar>	
	
	</view>
</template>
<script>
	import cardSwiper from "@/components/helang-cardSwiper/helang-cardSwiper"
	export default {
		data() {
			return {
				// topNavIndex:0,
				pageScrollTop:0,	// 页面滚动距离
				conlist:[],
				src1:"https://www.sjtzj.com/Template/sjthome/style/images/xianlong.jpg",
				keyword: "", // 搜索关键字
			}
		},
		components:{
			cardSwiper
		},
		computed:{
			topNavStyle(){
				let r = this.pageScrollTop  / 100;
				return {
					"class":r>=0.85?'style2':'',
					// "style":`background-color: rgba(66, 185, 131,${r>=1?1:r});`
				}
			}
		},
		onLoad() {
		},
		onReady() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#e4e7ee',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
		},
		// 页面滚动监听
		onPageScroll(e){
			this.pageScrollTop = Math.floor(e.scrollTop);
		},
		methods: {
			// 顶部导航改变 
			changeTopNav(e){
				this.topNavIndex = e.currentTarget.dataset.index
			},
			getConlist(){ // 调数据
				this.$u.get('content_list',{
					pnid:43,
					cpage:1,
					psize:5,
				}).then((res)=>{
					// console.log(res)
					for	(let i=0;i<res.result.length;i++){
						res.result[i].CreateTime=res.result[i].CreateTime.toString().replace(/T/g," ");
					}
					this.conlist=res.result;
				})
			},
			showDetail(itemid){  // 进入内容页
				uni.navigateTo({
					url:'/pages/home/enjoy_item?id='+itemid
				})
			},
			go_showIndex(){
				uni.navigateTo({ //进入佶雅阁展
					url:'/pages/channel/zhan'
				})
			},		
			go_indexMore(){
				uni.navigateTo({ //进入更多
					url:'/pages/home/live'
				})
			},	
			go_indexUcenter(){
				uni.switchTab({ //进入会员中心
					url:'/pages/home/ucenter'
				})
			},	
			goto(url) { //通用clik链接方法
				uni.navigateTo({
					url:url
				})
			},
			toSearch(){  // 去搜索
				uni.navigateTo({
					url:`/pages/channel/search?keyword=${this.keyword}`  
				})
			},
		},
		onLoad(){
			this.getConlist()
		},
	}
</script>
<style lang="scss">
@import "style/home_card.scss";
// page{background: #0F0F11; color: #ccc;}
	/* 标题栏 */
	.title{position: fixed; top: 0; left: 0; width: 100%; height: auto; padding-top: var(--status-bar-height); z-index: 10; color: rgba(255,255,255,0.8);
		&>view{height: 44px;}
		.box1{width: 60rpx;	margin: 0 40rpx; font-size: 36rpx;}
		.tab{
			&>view{/*margin: 0 30rpx;*/line-height: 64rpx; font-size: 36rpx; position: relative; letter-spacing: 0; transition: transform 0.3s ease-in-out 0s; transform: scale(1,1);
				&.active{color: rgba(255,255,255,1); transform: scale(1.15,1.15);}
			}
		}
		&.style2{color: #FFF;
			.tab{
				&>view{
					&.active{color: #FFF;}
				}
			}
		}
	}
</style>