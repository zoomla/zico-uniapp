<template>
	<view>
		<view class="worktable">
			<view class="worktable_main">
				<view class="page" v-for="(page, pidx) in application.pages" :id="'page_' + page.id"
					v-show="pidx == application.currentPage"
					:class="(!params.isLive ? ' page-infinite ' : '')
						+ ((params.viewMode == 'lg' || params.viewMode == 'xl' || params.viewMode == 'xxl' || !params.viewMode) && currentPage.navigation.dock.default.mode == 'left' ? ' navleft ' : '')
						+ ((params.viewMode == 'xs' || params.viewMode == 'sm' || params.viewMode == 'md') && currentPage.navigation.dock.responsive.mode == 'left' ? ' navleft ' : '')
						+ ((params.viewMode == 'xs' || params.viewMode == 'sm' || params.viewMode == 'md') && currentPage.navigation.dock.responsive.mode == 'bottom' ? ' mbnavbottom ' : '')">
					<!-- 页面背景 -->
					<view class="page-layout-bg" style="z-index:0"
						v-if="u_getViewStyle(currentPage).background.mode == 'color'"
						:style="{backgroundColor:(u_getViewStyle(currentPage).background.color.src || 'transparent')}"></view>
					<view class="page-layout-bg" style="z-index:0" v-else
						:style="{backgroundImage:(u_getViewStyle(currentPage).background.image.src ? 'url('+$u.http.config.baseUrl+u_getViewStyle(currentPage).background.image.src+')' : 'none'),
							backgroundPosition:((u_getViewStyle(currentPage).background.image.position.left || '0%')+' '+(u_getViewStyle(currentPage).background.image.position.top || '0%')),
							backgroundSize:((u_getViewStyle(currentPage).background.image.size.width || 'auto')+' '+(u_getViewStyle(currentPage).background.image.size.height || 'auto'))}"></view>
					<!-- 页面导航 -->
					<view class="page-nav">
						<view class="vd_page_image page-logo" @click="(!params.isLive ? u_uploadImg(function(path) { this.application.logo.src=path; }) : (function(){})())">
							<view :style="{width:(application.logo.width*1 ? application.logo.width + 'px' : 'auto'), height:(application.logo.height*1 ? application.logo.height + 'px' : 'auto')}">
								<view style="width:100%; height:100%; background-repeat:no-repeat;"
									:style="{
										'background-image':'url('+$u.http.config.baseUrl+(!application.logo.src ? '/UploadFiles/nopic.svg' : application.logo.src)+')',
										'background-size': 'auto 100%',
									}"></view>
							</view>
						</view>
						<view class="page-nav-toggle" :class="style.navShow ? 'active' : ''" @click="style.navShow=!style.navShow"></view>
						<view class="page-nav-main" :class="style.navShow ? 'show' : ''">
							<view class="page-nav-link-list">
								<view class="page-nav-link" v-for="(nav, nidx) in page.layouts.filter(curr => curr.isNav)" @click="navActive(nav)">
									<text class="page-nav-link-ico zi" :class="'zi_' + (nav.ico || 'link')"></text>
									<text>{{nav.name}}</text>
								</view>
								<view class="page-nav-link" v-for="cnav in currentPage.navigation.list"
									@click="navActive(cnav)">
									<text class="page-nav-link-ico zi" :class="'zi_' + (cnav.ico || 'link')"></text>
									<text>{{cnav.name}}</text>
								</view>
							</view>
						</view>
					</view>
					<!-- 页面内容 -->
					<view class="page-scrollable">
						<view class="page-content">
							<view class="page-layout" v-for="(section, sidx) in page.layouts" :class="params.isLive ? 'border-0' : ''"
								:id="section.id" :data-pidx="pidx" :data-sidx="sidx">
								<!-- 布局内容 -->
								<view class="page-layout-body" :style="{minHeight:(u_getViewStyle(section).height + 'px')}">
									<component :is="'layout-' + section.type" :layout="section.items"></component>
								</view>
								<!-- 调整大小 -->
								<view class="page-layout-resize" v-if="!params.isLive"
									@touchstart.stop.prevent="style.dragsize.layout=section; u_dragsize_start($event)"
									@touchmove.stop.prevent="u_dragsize_ing($event)"
									@touchcancel.stop.prevent="u_dragsize_ok($event)"
									@touchend.stop.prevent="u_dragsize_ok($event)">拖动此处改变大小</view>
								<!-- 版块背景 -->
								<view class="page-layout-bg" v-if="u_getViewStyle(section).background.mode == 'color'"
										:style="{backgroundColor:(u_getViewStyle(section).background.color.src || 'transparent')}">
								</view>
								<view class="page-layout-bg" v-else
									:style="{backgroundImage:(u_getViewStyle(section).background.image.src ? 'url('+$u.http.config.baseUrl+u_getViewStyle(section).background.image.src+')' : 'none'),
									backgroundPosition:((u_getViewStyle(section).background.image.position.left || '0%')+' '+(u_getViewStyle(section).background.image.position.top || '0%')),
									backgroundSize:((u_getViewStyle(section).background.image.size.width || 'auto')+' '+(u_getViewStyle(section).background.image.size.height || 'auto'))}">
								</view>
								<!-- 设置按钮 -->
								<view class="page-layout-cfgbtn-group" v-if="!params.isLive">
									<view class="page-layout-cfgbtn" @click="layoutMove(sidx, 'up')"><u-icon name="arrow-up"></u-icon></view>
									<view class="page-layout-cfgbtn" @click="layoutMove(sidx, 'down')"><u-icon name="arrow-down"></u-icon></view>
									<view class="page-layout-cfgbtn" @click="style.layoutConfigModal.layoutIdx=sidx; style.layoutConfigModal.show=true"><u-icon name="grid-fill"></u-icon></view>
								</view>
							</view>
							<view class="page-layout" @click="layoutAdd()">
								<view style="padding:42rpx 0; font-size:36rpx; text-align:center; color:#606266; background:#fff;">
									<u-icon name="plus"></u-icon>
									<text style="margin-left:8rpx;">新增空布局</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 弹出设置按钮 -->
		<view class="cfgmodal-opener" :class="style.cfgmodalOpener.show ? 'show' : ''">
			<view class="cfgmodal-opener-toggler" @click="style.cfgmodalOpener.show=!style.cfgmodalOpener.show">
				<u-icon name="setting-fill"></u-icon>
			</view>
			<view class="cfgmodal-opener-content">
				<view @click="style.appConfigModal.show=true; style.cfgmodalOpener.show=false">应用设置</view>
				<view @click="style.pageConfigModal.show=true; style.cfgmodalOpener.show=false">页面设置</view>
			</view>
		</view>
		<!-- 应用 -->
		<u-popup class="popup_nobg" v-model="style.appConfigModal.show" mode="left" width="75%">
			<view class="app-cfgmodal">
				<view class="app-cfgmodal-body">
					<view class="app-cfgmodal-title">应用设置</view>
					<view style="flex:1; display:flex; flex-flow:column;">
						<scroll-view scroll-y style="height:100%;">
							<view class="form-item form-item-row">
								<view class="form-label">名称</view>
								<view class="form-control">
									<u-input v-model="application.name" :border="true"></u-input>
								</view>
							</view>
							<view class="form-item form-item-row">
								<view class="form-label">页面管理</view>
								<view class="form-control">
									<view class="app-cfgpage" v-for="(item,index) in application.pages">
										<view class="app-cfgpage-name">
											<view @click="application.currentPage=index">
												<u-icon name="map-fill" style="color:#333;" v-if="application.currentPage == index"></u-icon>
												<u-icon name="map" style="color:#606266;" v-else></u-icon>
											</view>
											<view><u-input v-model="item.name" :border="true"></u-input></view>
										</view>
										<view class="app-cfgpage-opera">
											<view style="color:#398ade;" @click="application.currentPage=index"><u-icon name="attach"></u-icon>切换至</view>
											<view style="color:#e45656;" v-if="index > 0" @click="pageRemove(index)"><u-icon name="trash"></u-icon>删除</view>
											<view v-else><u-icon name="home"></u-icon>主页</view>
										</view>
									</view>
									<view class="vd_list_adder" @click="pageAdd()">
										<u-icon name="plus"></u-icon>
										<text>新增页面</text>
									</view>
								</view>
							</view>
							<view class="form-item form-item-row" style="border:0;">
								<view class="form-label">logo设置</view>
								<view class="form-control">
									<view class="closed">暂未开放，敬请期待</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="app-cfgmodal-opera">
						<view class="form-btn form-btn-ok" :class="params.saving ? 'disable' : ''" @click="s_saveInfo()">保存</view>
						<view class="form-btn form-btn-err" @click="s_exit()">退出设计台</view>
					</view>
				</view>
				<view class="app-cfgmodal-toggler" @click="style.appConfigModal.show=false">
					<view><u-icon name="arrow-left-double" size="32"></u-icon></view>
				</view>
			</view>
		</u-popup>
		<!-- 页面 -->
		<u-popup class="popup_nobg" v-model="style.pageConfigModal.show" mode="top" height="80%">
			<view class="page-cfgmodal">
				<view class="page-cfgmodal-body">
					<view class="page-cfgmodal-title">页面设置</view>
					<view style="flex:1; display:flex; flex-flow:column;">
						<u-tabs-swiper ref="pageCfgTabs" :list="style.pageConfigModal.swiper.list" :bold="false" :active-color="'#3c9cff'"
							:current="style.pageConfigModal.swiper.current" @change="pageCfgTabsChange($event)"></u-tabs-swiper>
						<swiper style="flex:1;" :current="style.pageConfigModal.swiper.swiperCurrent"
							@transition="pageCfgTabsSwiperTransition($event)" @animationfinish="pageCfgTabsSwiperAnimationfinish($event)">
							<!-- 基础信息 -->
							<swiper-item style="height:100%;">
								<scroll-view scroll-y style="height:100%;">
									<view class="form-item form-item-row">
										<view class="form-label">页面名称</view>
										<view class="form-control">
											<u-input v-model="currentPage.name" :border="true"></u-input>
										</view>
									</view>
									<view class="form-item form-item-row">
										<view class="form-label">背景设置</view>
										<view class="form-control">
											<view class="closed">暂未开放，敬请期待</view>
										</view>
									</view>
								</scroll-view>
							</swiper-item>
							<!-- 板块管理 -->
							<swiper-item style="height:100%;">
								<scroll-view scroll-y style="height:100%;">
									<view class="page-cfglayout" v-for="(item,index) in currentPage.layouts">
										<view class="page-cfglayout-name">
											<view @click="style.icoSelModal.obj=item; style.icoSelModal.show=true"><text class="zi" :class="'zi_'+(item.ico || 'link')"></text></view>
											<view><u-input v-model="item.name" :border="true"></u-input></view>
										</view>
										<view class="page-cfglayout-opera">
											<view v-if="item.isNav" style="color:#e45656;" @click="item.isNav=false"><u-icon name="bookmark-fill"></u-icon>取消导航</view>
											<view v-else style="color:#398ade;" @click="item.isNav=true"><u-icon name="bookmark"></u-icon>设为导航</view>
											<view @click="layoutMove(index, 'up')"><u-icon name="arrow-upward"></u-icon>上移</view>
											<view @click="layoutMove(index, 'down')"><u-icon name="arrow-downward"></u-icon>下移</view>
											<view style="color:#e45656;" @click="layoutRemove(index)"><u-icon name="trash"></u-icon>删除</view>
										</view>
									</view>
									<view class="vd_list_adder" @click="layoutAdd()">
										<u-icon name="plus"></u-icon>
										<text>新增空布局</text>
									</view>
								</scroll-view>
							</swiper-item>
							<!-- 导航栏设置 -->
							<swiper-item style="height:100%;">
								<scroll-view scroll-y style="height:100%;">
									<view class="form-item form-item-row">
										<view class="form-label">默认导航样式</view>
										<view class="form-control">
											<u-radio-group v-model="currentPage.navigation.dock.default.mode">
												<u-radio v-for="item in style.pageConfigModal.navStyle.default" :name="item.value">
													<text>{{item.label}}</text>
												</u-radio>
											</u-radio-group>
										</view>
									</view>
									<view class="form-item form-item-row">
										<view class="form-label">移动设备导航样式</view>
										<view class="form-control">
											<u-radio-group v-model="currentPage.navigation.dock.responsive.mode">
												<u-radio v-for="item in style.pageConfigModal.navStyle.responsive" :name="item.value">
													<text>{{item.label}}</text>
												</u-radio>
											</u-radio-group>
										</view>
									</view>
									<view class="form-item form-item-row">
										<view class="form-label">页内导航</view>
										<view class="form-control">
											<view class="closed">暂未开放，敬请期待</view>
										</view>
									</view>
									<view class="form-item form-item-row">
										<view class="form-label">外链导航</view>
										<view class="form-control">
											<view class="page-cfgnav" v-for="(item,index) in currentPage.navigation.list">
												<view class="page-cfgnav-name">
													<view @click="style.icoSelModal.obj=item; style.icoSelModal.show=true"><text class="zi" :class="'zi_'+item.ico"></text></view>
													<view><u-input v-model="item.name" :border="true"></u-input></view>
												</view>
												<view class="page-cfgnav-link">
													<view>
														<u-input type="select" :value="v_navTypeName(item.type)" :border="true"
															@click="style.pageConfigModal.selNavType.navIdx=index; style.pageConfigModal.selNavType.show=true"></u-input>
													</view>
													<view>
														<u-input type="select" :value="v_navPageName(item.path)" :border="true" v-if="item.type=='page'"
															@click="style.pageConfigModal.selNavPage.navIdx=index; style.pageConfigModal.selNavPage.show=true"></u-input>
														<u-input v-model="item.path" :border="true" v-else></u-input>
													</view>
												</view>
												<view class="page-cfgnav-opera">
													<view @click="navMove(index, 'up')"><u-icon name="arrow-upward"></u-icon>上移</view>
													<view @click="navMove(index, 'down')"><u-icon name="arrow-downward"></u-icon>下移</view>
													<view style="color:#e45656;" @click="navRemove(index)"><u-icon name="trash"></u-icon>删除</view>
												</view>
											</view>
											<view class="vd_list_adder" @click="navAdd()">
												<u-icon name="plus"></u-icon>
												<text>新增导航项</text>
											</view>
										</view>
									</view>
								</scroll-view>
							</swiper-item>
						</swiper>
					</view>
					<view class="form-btn form-btn-err" style="margin-bottom:30rpx;" v-if="application.currentPage > 0" @click="pageRemove(application.currentPage)">删除此页</view>
				</view>
				<view class="page-cfgmodal-toggler" @click="style.pageConfigModal.show=false">
					<view><u-icon class="page-cfgmodal-toggler-ico" name="arrow-right-double"></u-icon></view>
				</view>
			</view>
		</u-popup>
		<!-- 布局 -->
		<u-popup class="popup_nobg" v-model="style.layoutConfigModal.show" mode="right" width="75%">
			<view class="page-layout-cfgmodal">
				<view class="page-layout-cfgmodal-toggler" @click="style.layoutConfigModal.show=false">
					<view><u-icon name="arrow-right-double" size="32"></u-icon></view>
				</view>
				<view class="page-layout-cfgmodal-body">
					<view class="page-layout-cfgmodal-title">布局设置</view>
					<view style="flex:1; display:flex; flex-flow:column;">
						<scroll-view scroll-y style="height:100%;">
							<view class="form-item form-item-row">
								<view class="form-label">布局名称</view>
								<view class="form-control">
									<u-input v-model="currentPageLayout.name" :border="true"></u-input>
								</view>
							</view>
							<view class="form-item form-item-row">
								<view class="form-label">布局类型</view>
								<view class="form-control">
									<u-input type="select" :value="v_layoutTypeName(currentPageLayout.type)" :border="true" @click="style.layoutConfigModal.selType.show=true"></u-input>
								</view>
							</view>
							<view class="form-item form-item-row">
								<view class="form-label">背景设置</view>
								<view class="form-control">
									<view class="closed">暂未开放，敬请期待</view>
								</view>
							</view>
							<!-- 各布局独有设置 -->
							<component :is="'layout-' + currentPageLayout.type + '-mgr'" v-model="currentPageLayout"></component>
						</scroll-view>
					</view>
					<view class="page-layout-cfgmodal-opera">
						<view style="display:flex; margin-top:20rpx;">
							<view class="form-btn form-btn-ok" style="margin:0 10rpx 0 0;"
								@click="layoutMove(style.layoutConfigModal.layoutIdx, 'up');
									style.layoutConfigModal.layoutIdx=(style.layoutConfigModal.layoutIdx-1 < 0 ? 0 : style.layoutConfigModal.layoutIdx-1)">上移</view>
							<view class="form-btn form-btn-ok" style="margin:0 0 0 10rpx;"
								@click="layoutMove(style.layoutConfigModal.layoutIdx, 'down');
									style.layoutConfigModal.layoutIdx=(style.layoutConfigModal.layoutIdx+1 >= currentPage.layouts.length ? currentPage.layouts.length-1 : style.layoutConfigModal.layoutIdx+1)">下移</view>
						</view>
						<view class="form-btn form-btn-err" @click="layoutRemove(style.layoutConfigModal.layoutIdx)">删除此布局</view>
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 布局类型选择 -->
		<u-select v-model="style.layoutConfigModal.selType.show" :list="style.layoutConfigModal.selType.list"
			@confirm="pageLayoutTypeSelectConfirm($event)"></u-select>
		<!-- 导航类型选择 -->
		<u-select v-model="style.pageConfigModal.selNavType.show" :list="style.pageConfigModal.selNavType.list"
			@confirm="currentPage.navigation.list[style.pageConfigModal.selNavType.navIdx].type=$event[0].value"></u-select>
		<!-- 页面导航页面选择 -->
		<u-select v-model="style.pageConfigModal.selNavPage.show" :list="application.pages" :value-name="'id'" :label-name="'name'"
			@confirm="currentPage.navigation.list[style.pageConfigModal.selNavPage.navIdx].path='$page_'+$event[0].value"></u-select>
		<!-- 图标选择 -->
		<u-popup v-model="style.icoSelModal.show" mode="center" width="80%" height="80%" :border-radius="8">
			<view style="display:flex; flex-flow:column; height:100%;">
				<view style="flex-shrink:0; display:flex; justify-content:space-between; padding:26rpx; font-size:34rpx;">
					<view>选择图标</view>
					<view @click="style.icoSelModal.show=false"><u-icon name="close"></u-icon></view>
				</view>
				<view style="flex:1; display:flex; flex-flow:column;">
					<scroll-view scroll-y style="height:100%;">
						<view style="display:inline-flex; justify-content:center; align-items:center; width:20%; height:100rpx; font-size:52rpx;"
							v-for="item in style.icoSelModal.list" @click="(style.icoSelModal.obj || {}).ico=item; style.icoSelModal.show=false">
							<text class="zi" :class="'zi_'+item"></text>
						</view>
					</scroll-view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import lay_0 from "@/components/vdesign/worktable/layout-0.vue";
	import lay_1 from "@/components/vdesign/worktable/layout-1.vue";
	import lay_2 from "@/components/vdesign/worktable/layout-2.vue";
	import lay_3 from "@/components/vdesign/worktable/layout-3.vue";
	import lay_4 from "@/components/vdesign/worktable/layout-4.vue";
	import lay_5 from "@/components/vdesign/worktable/layout-5.vue";
	import lay_100 from "@/components/vdesign/worktable/layout-100.vue";
	import lay_101 from "@/components/vdesign/worktable/layout-101.vue";
	import lay_102 from "@/components/vdesign/worktable/layout-102.vue";

	import lay_0_mgr from "@/components/vdesign/worktable/layout-0-mgr.vue";
	import lay_1_mgr from "@/components/vdesign/worktable/layout-1-mgr.vue";
	import lay_2_mgr from "@/components/vdesign/worktable/layout-2-mgr.vue";
	import lay_3_mgr from "@/components/vdesign/worktable/layout-3-mgr.vue";
	import lay_4_mgr from "@/components/vdesign/worktable/layout-4-mgr.vue";
	import lay_5_mgr from "@/components/vdesign/worktable/layout-5-mgr.vue";
	import lay_100_mgr from "@/components/vdesign/worktable/layout-100-mgr.vue";
	import lay_101_mgr from "@/components/vdesign/worktable/layout-101-mgr.vue";
	import lay_102_mgr from "@/components/vdesign/worktable/layout-102-mgr.vue";

	export default {
		components: {
			"layout-0": lay_0,
			"layout-1": lay_1,
			"layout-2": lay_2,
			"layout-3": lay_3,
			"layout-4": lay_4,
			"layout-5": lay_5,
			"layout-100": lay_100,
			"layout-101": lay_101,
			"layout-102": lay_102,

			"layout-0-mgr": lay_0_mgr,
			"layout-1-mgr": lay_1_mgr,
			"layout-2-mgr": lay_2_mgr,
			"layout-3-mgr": lay_3_mgr,
			"layout-4-mgr": lay_4_mgr,
			"layout-5-mgr": lay_5_mgr,
			"layout-100-mgr": lay_100_mgr,
			"layout-101-mgr": lay_101_mgr,
			"layout-102-mgr": lay_102_mgr,
		},
		data() {
			return {
				uid: this.$store.state.vuex_user.userId, // 当前登录用户id
				//-------- 页面组件样式控制
				style: {
					cfgmodalOpener: {
						show: false
					},
					appConfigModal: {
						show: false
					},
					pageConfigModal: {
						show: false,
						swiper: {
							current: 0,
							swiperCurrent: 0,
							list: [
								{name: "基础信息"}, //名称、背景
								{name: "板块管理"}, //名称、排序、图标、导航属性
								{name: "导航栏"}, //
							]
						},
						navStyle: {
							default: [
								{label: "传统吸顶", value: "top"},
								{label: "左侧栏垂直停靠", value: "left"},
							],
							responsive: [
								{label: "传统吸顶", value: "top"},
								{label: "仿APP底部菜单", value: "bottom"},
							]
						},
						selNavType: {
							show: false,
							list: [
								{label: "页面", value: "page"},
								{label: "外链", value: "link"},
							],
							navIdx: 0
						},
						selNavPage: {
							show: false,
							navIdx: 0
						}
					},
					layoutConfigModal: {
						show: false,
						selType: {
							show: false,
							list: [
								{label: "空布局", value: 0},
								{label: "纯文字布局", value: 1},
								{label: "带介绍文字的图片横幅布局", value: 2},
								{label: "带图片的短文章布局", value: 3},
								{label: "带介绍的大板块媒体布局", value: 4},
								{label: "相册轮播布局", value: 5},
								{label: "在线文章布局", value: 100},
								{label: "在线留言布局", value: 101},
								{label: "在线商城布局", value: 102},
							]
						},
						layoutIdx: 0
					},

					dragsize: {
						layout: null,
						oldYaxis: 0
					},
					icoSelModal: {
						show: false,
						list: ["xijuGanrang", "shadu", "bingdu", "dotteam", "qingjiye", "xiaoduye", "jujliren", "feiganrang", "workjia", "gelijia", "touxiju", "kouzao", "dotKe", "kou", "jujiawifi", "wanshanjujia", "lijia", "baitianjujia", "jujia", "fengche", "shuilongtou2", "shuilongtou", "xuanfengsan", "feixing", "gongqiao", "qiao", "duilian", "mother", "kangfau", "liuyedao", "gugj", "fesi", "mom", "father", "grandfather", "nose", "radiationsign", "pregnantfetus", "woundplacard", "emergencydoctor", "infusionbed", "stretcher", "nursestation", "headnurse", "Femaledoctor", "Maledoctor", "lifeHelicopter", "Medicalscissors", "pine", "squirrel", "lipline", "lips", "Chinesecalendar", "kiipstick", "Motherdaughter", "bouquet", "HotPot", "tiananmen", "Officialdocument", "Medicaldropper", "Cabbageround", "cabbage", "brain", "icp", "internet", "www", "Trojan", "snowmans", "corns", "apple", "flipflop", "sailboat", "Coco", "Parasols", "Divingglasses", "litesapling", "Magpies", "Waterflowers", "Blessed", "Coppermoney", "corn", "cherry", "balloon", "mapleleaf", "PhD", "Speech", "Class", "Chineseumbres", "Chineseknot", "Pisces", "TempleHeaven", "Monkey", "Superman", "jug", "Hanlantern", "LuckyCat", "GreatWalls", "Tricycle", "firecracker", "beauty", "Papercut", "Fubao", "Gossip", "rabbit", "auspicious", "windbell", "crab", "lotus", "Chineseumbre", "lantern", "Chinesedragon", "Christmasstoc", "snowman", "SantaClaus", "Sexylips", "loves", "Lovecord", "Fucircle", "badminton", "Thief", "ancientarchite", "redevelope", "tigerHead", "dragon", "chinaMap", "roundFlag", "baodingcity", "mahjong", "flightatten", "incenseburner", "buddhas", "buddha", "monk", "writing", "tvtowe", "aroll", "brake", "bone", "arice", "asurface", "dumplings", "bun", "steamedrolls", "steamedroll", "yensign", "xray", "wrench", "wonsign", "wineglass", "windowrestore", "windowminimize", "windowmaximize", "windowclose", "wifi", "wheelchair", "weight", "warehouse", "wallet", "walking", "volumeup", "volumeoff", "volumedown", "volleyballball", "video", "videoslash", "vials", "vial", "venus", "venusmars", "venusdouble", "utensils", "utensilspoon", "users", "userscog", "user", "usertimes", "usertie", "usertag", "userslash", "usershield", "usersecret", "userplus", "userninja", "userminus", "usermd", "userlock", "usergraduate", "userfriends", "useredit", "usercog", "userclock", "usercircle", "usercheck", "userastronaut", "useralt", "useraltslash", "upload", "unlock", "unlockalt", "unlink", "university", "universalaccess", "undo", "undoalt", "underline", "umbrella", "tv", "tty", "tshirt", "truck", "truckmoving", "truckloading", "trophy", "tree", "trash", "trashalt", "transgender", "transgenderalt", "train", "trademark", "toolbox", "toggleon", "toggleoff", "tint", "times", "timescircle", "ticketalt", "thumbtack", "thumbsup", "thumbsdown", "thermometer", "thermometerthreequarters", "thermometerquarter", "thermometerhalf", "thermometerfull", "thermometerempty", "thead", "thlist", "thlarge", "textwidth", "textheight", "terminal", "taxi", "tasks", "tape", "tags", "tag", "tachometeralt", "tablets", "tablet", "tabletalt", "table", "tabletennis", "syringe", "sync", "syncalt", "superscript", "sun", "suitcase", "subway", "subscript", "stroopwafel", "strikethrough", "streetview", "stream", "store", "storealt", "stopwatch", "stopcircle", "stickynote", "stethoscope", "stepforward", "stepbackward", "star", "starHalfb", "square", "squarefull", "spinner", "spaceshuttle", "sort", "sortup", "sortnumericup", "sortnumericdown", "sortdown", "sortamountup", "sortamountdown", "sortalphaup", "sortalphadown", "snowFlakeblack", "smoking", "smokingban", "smileBlack", "slidersh", "skull", "sitemap", "signal", "sign", "signoutalt", "signlanguage", "signinalt", "shower", "shoppingcart", "shoppingbasket", "shoppingbag", "shoeprints", "shippingfast", "ship", "shieldalt", "shekelsign", "share", "sharesquare", "sharealt", "sharealtsquare", "server", "seedling", "searchBlack", "searchplus", "searchminus", "screwdriver", "school", "save", "rupeesign", "ruler", "rulervertical", "rulerhorizontal", "rulercombined", "rublesign", "rss", "rsssquare", "rocket", "robot", "road", "ribbon", "retweet", "reply", "replyall", "registered", "redo", "redoalt", "recycle", "receipt", "random", "quoteright", "quoteleft", "quidditch", "question", "questioncircle", "qrcode", "puzzlepiece", "projectdiagram", "procedures", "print", "prescriptionbottle", "prescriptionbottlealt", "poweroff", "poundsign", "portrait", "poo", "podcast", "plus", "plusSquareblack", "pluscircle", "plug", "play", "playcircle", "plane", "pills", "piggybank", "phone", "phonevolume", "phonesquare", "phoneslash", "percentage", "percent", "peoplecarry", "pencilalt", "pensquare", "paw", "pause", "pausecircle", "paste", "parking", "paragraph", "parachutebox", "paperclip", "paperplane", "pallet", "palette", "paintbrush", "outdent", "objectungroup", "objectgroup", "notesmedical", "notequal", "newspaper", "neuter", "musicBold", "mousepointer", "motorcycle", "moon", "moneycheck", "moneycheckalt", "moneybill", "moneybillwave", "moneybillwavealt", "moneybillalt", "mobile", "mobilealt", "minus", "minussquare", "minuscircle", "microphone", "microphoneslash", "microphonealt", "microphonealtslash", "microchip", "mercury", "memory", "meh", "medkit", "mars", "marsstroke", "marsstrokev", "marsstrokeh", "marsdouble", "map", "mapsigns", "mappin", "mapmarker", "mapmarkeralt", "male", "magnet", "magic", "lowvision", "longarrowaltup", "longarrowaltright", "longarrowaltleft", "longarrowaltdown", "lock", "lockopen", "locationarrow", "list", "listul", "listol", "listalt", "lirasign", "link", "lightbulb", "lifering", "levelupalt", "leveldownalt", "lessthan", "lessthanequal", "lemon", "leaf", "laptop", "language", "kiwibird", "keyboards", "key", "italic", "info", "infocircle", "infinity", "industry", "indent", "inbox", "images", "image", "idcardBold", "idcardalt", "idbadge", "icursor", "hourglassb", "hourglassstart", "hourglasshalf", "hourglassend", "hospitalBold", "hospitalsymbol", "hospitalalt", "home", "hockeypuck", "history", "helicopter", "heartbeat", "heart", "headphones", "heading", "hdd", "hashtag", "handshake", "hands", "handshelping", "handspock", "handscissors", "handrock", "handpointer", "handpointup", "handpointright", "handpointleft", "handpointdown", "handpeace", "handpaper", "handlizard", "handholding", "handholdingusd", "handholdingheart", "hsquare", "greaterthan", "greaterthanequal", "graduationcap", "golfball", "globe", "glasses", "glassmartini", "gift", "genderless", "gem", "gavel", "gaspump", "gamepad", "futbol", "frown", "frog", "forward", "footballBold", "fonts", "folders", "folderOpen", "flask", "flagBold", "flagcheckered", "firstaid", "fire", "fireextinguisher", "filter", "film", "file", "fileWord", "fileVideohei", "filePowerpoint", "filePDF", "fileMedical", "fileMedicalalt", "fileImage", "fileExcel", "fileCodeB", "fileAudioB", "fileArchiveb", "filealt", "fighterjet", "female", "feather", "fax", "fastForward", "fastBackward", "eye", "eyeslash", "eyeDropper", "externalLinksquarealt", "externalLinkalt", "expand", "expandarrowsalt", "exclamation", "exclamationTriangle", "exclamationCircle", "exchangealt", "euroSign", "eraser", "equals", "envelopeBold", "envelopeSquare", "envelopeOpen", "ellipsisv", "ellipsish", "eject", "edit", "dumbbell", "download", "dove", "dotcircle", "openClosed", "doorClosed", "donate", "dolly", "dollyFlatbed", "dollarSign", "dna", "divide", "dice", "diceTwo", "diceThree", "diceSix", "diceOne", "diceFour", "diceFive", "diagnoses", "desktop", "deaf", "database", "cuts", "cubes", "SquareTable", "SmilLove", "motoCycle", "crh", "cube", "crown", "crow", "crosshairs", "crop", "creditcards", "couch", "copyrightBold", "copy", "compress", "compassBold", "compactdisc", "comments", "commentslash", "comment", "commentdots", "commentalt", "columns", "coins", "cogs", "cog", "coffee", "code", "codebranch", "cloud", "clouduploadalt", "clouddownloadalt", "closedcaptioning", "clone", "clockCir", "clipboard", "clipboardlist", "clipboardcheck", "circle", "circlenotch", "church", "child", "forUp", "forRight", "forLeft", "forDown", "circleUps", "circleRights", "circlelefts", "circleDowns", "chess", "chessrook", "chessqueen", "chesspawn", "chessknight", "chessking", "chessboard", "chessbishop", "check", "checksquare", "checkcircle", "chartpie", "chartline", "chartbar", "chartarea", "chalkboard", "chalkboardteacher", "certificate", "cartarrowPlus", "cartarrowdown", "caretUp", "caretsquareUp", "caretsquareRight", "caretsquareLeft", "caretsquaredown", "caretRight", "caretleft", "caretdown", "car", "capsules", "camera", "cameraretro", "squareBlod", "squareMultiplyB", "squarePlusB", "squareLessB", "squareHandCorrectB", "calendar", "calculator", "bus", "burn", "bullseye", "speaker", "building", "bug", "broom", "broadcasttower", "briefcase", "medical", "braille", "boxes", "box", "boxopen", "bowlingball", "bookmark", "book", "bookopen", "bomb", "lightning", "bold", "blind", "blender", "birthdaycake", "binoculars", "bicycle", "bells", "bellslash", "beer", "bed", "batterythreequarters", "bath", "basketballball", "baseballball", "bars", "barcode", "bandaid", "ban", "balancescale", "backward", "audiodescription", "at", "asterisk", "assistivelisteningsystems", "arrowsalt", "doubleArrowVertical", "doubleArrowLandscape", "arrowUp", "arrowRight", "arrowLeft", "arrowDown", "circleUpLong", "circleRightLong", "circleLeftLong", "circleDownLong", "circleUpBold", "circleRightBold", "circleLeftBold", "circleDownBold", "archive", "pathUp", "pathRight", "pathLeft", "pathDown", "doubleUp", "doubleRight", "doubleLeft", "doubleDown", "anchor", "SignLanguageUSA", "ambulance", "allergies", "alignright", "alignleft", "alignjustify", "aligncenter", "adjust", "addressCard", "addressBook", "batteryquarter", "batteryHalf", "battery", "batteryEmpty", "greatWall", "schoolDesk", "torch", "bulbLine", "bulbGlow", "bulbTorch", "handRight", "handLeft", "handLine", "handTwo", "handdown", "handup", "click", "fistLine", "scissors", "dumb", "hand", "shakeHands", "disk", "love", "hospital", "hourglass", "idRec", "bulb", "diamond", "paper", "fly", "write", "openMsg", "msgchat", "newMsg", "noSee", "copyfile", "chat", "keyboard", "maps", "idCheck", "fileGraph", "oneDollar", "envelope", "creditCard", "cc", "fileBook", "digg", "oppose", "fileVideo", "filePrt", "pdf", "filePic", "fileSilent", "fileCode", "fileAudio", "fileZip", "fileEdit", "word", "fileNew", "flag", "floderOpen", "floderLine", "cut", "selectFile", "floppyDisk", "jumpSquare", "listSquare", "lessSquare", "doubleSquare", "bubbleSquare", "plusSquare", "fileLine", "squareLine", "starHalfBlack", "starHalf", "starLine", "circleComponents", "snowflake", "halfMonth", "footballLine", "circleCancel", "reg", "circleVatar", "circleQuestion", "circlePlay", "circlePause", "smileyFace", "circleStop", "Rudder", "steeringWheel", "smile", "Cryingface", "compass", "circlesNesting", "copyright", "clock", "circleLine", "squareCorrect", "circleCorrect", "curve", "squareUp", "squareRight", "squareLeft", "squareDown", "squareHandle", "squareMultiply", "squarePlus", "squareLess", "squareHandCorrect", "squareBook", "house", "verFlag", "bell", "quiet", "circleUp", "circleRight", "circleLeft", "circleDonw", "Idcards", "IDcard", "textbook", "service", "menu", "search", "music", "glass"],
						obj: null
					},
					navShow: false,

					bgTypes: [
						{name: "纯色", value: "color"},
						{name: "图片", value: "image"},
					],
				},
				//-------- 工作台参数
				params: {
					did: 0,
					saving: false,
					isLive: false,
					isTlp: false,
					viewMode: "md",
					bgpreset: {
						image: [],
						color: ["#fa8c97", "#fec979", "#a0d26d", "#74cfe2", "#f4e5ff", "#a7bac1", "#d6d1bb", "#bdc6bc", "#f2f2f2"],
					}
				},
				//-------- 应用信息
				application: {
					name: "默认应用",
					logo: {
					    src: "/UploadFiles/nopic.svg",
					    height: "auto",
					    width: "auto",
					},
					pages: [],
					currentPage: 0,
					copyright: ""
				}
			};
		},
		computed: {
			currentPage: function () {
				return this.application.pages[this.application.currentPage] || {
					name: "新页面",
					navigation: {
						dock: {
							default: {
								mode: "top",
								top: {
									logoDock: ""
								},
								left: {}
							},
							responsive: {
								mode: "top",
								top: {},
								left: {},
								bottom: {}
							}
						},
						list: []
					},
					layouts: [],
					responsive: {xs:{enabled:true,style:{background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},sm:{enabled:true,style:{background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},md:{enabled:true,style:{background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},lg:{enabled:true,style:{background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},xl:{enabled:true,style:{background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},xxl:{enabled:true,style:{background:{mode:"color",color:{src:"#fff"},image:{src:"",size:{width:"auto",height:"auto"},position:{top:"0%",left:"0%"}}}}}},
				};
			},
			currentPageLayout: function() {
				return this.currentPage.layouts[this.style.layoutConfigModal.layoutIdx] || {
					type: 0,
					name: "",
					isNav: true,
					ico: "link",
					type: 0,
					items: [],
					responsive: {xs:{enabled:true,style:{height:0,background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},sm:{enabled:true,style:{height:0,background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},md:{enabled:true,style:{height:0,background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},lg:{enabled:true,style:{height:0,background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},xl:{enabled:true,style:{height:0,background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},xxl:{enabled:true,style:{height:300,background:{mode:"color",color:{src:""},image:{src:"",size:{width:"auto",height:"auto"},position:{top:"0%",left:"0%"}}}}}},
				};
			},
			currentPageLayoutTypeName: {
				get: function() {
					let typeId = this.currentPageLayout.type;
					let type = this.style.layoutConfigModal.selType.list.find(curr => curr.value == typeId);
					return (type || this.style.layoutConfigModal.selType.list[0]).label;
				},
				set: function(val) {}
			},
		},
		onLoad(options) {
			const that = this;
			if (options.id && options.istlp != 1) {
				this.$u.get("vd_site_get", {
					id: options.id
				}).then(res => {
					that.params.did = res.result.ID;
					that.initApp(JSON.parse(res.result.App));
				}).catch(err => {
					uni.showModal({
						title: "站点加载错误：" + err,
						showCancel: false
					});
				});
				return;
			}
			if (options.id && options.istlp == 1) {
				that.params.isTlp = true;
				this.$u.get("vd_board_get", {
					id: options.id
				}).then(res => {
					that.params.did = res.result.ID;
					that.initApp(JSON.parse(res.result.App));
				}).catch(err => {
					uni.showModal({
						title: "模板加载错误：" + err,
						showCancel: false
					});
				});
				return;
			}
			if (!options.id && options.tlp) {
				this.$u.get("vd_board_get", {
					id: options.tlp
				}).then(res => {
					that.params.did = res.result.ID;
					that.initApp(JSON.parse(res.result.App));
				}).catch(err => {
					uni.showModal({
						title: "模板加载错误：" + err,
						showCancel: false
					});
				});
				return;
			}
			
			this.pageAdd();
		},
		onBackPress(options) {
			if (options.from == "navigateBack") {
				return false;
			}

			this.style.appConfigModal.show = false;
			this.style.pageConfigModal.show = false;
			this.style.layoutConfigModal.show = false;
			return true;
		},
		methods: {
			/********** 初始化 **********/
			initApp(data) {
				const __assign = function(dest, given) {
					for (let key in dest) {
						let givenItem = given[key];
						let destItem = dest[key];
						if (!givenItem && (typeof givenItem == "object" || typeof givenItem == "undefined")) {
							continue;
						}

						if (destItem instanceof Array && givenItem instanceof Array) {
							for (let i = 0; i < givenItem.length; i++) {
								dest[key].push(givenItem[i]);
							}
							continue;
						}
						if (typeof destItem == "object" && typeof givenItem == "object") {
							__assign(destItem, givenItem);
							continue;
						}
						dest[key] = givenItem;
					}
				};
				__assign(this.application, data);
			},
			/********** 页面操作**********/
			// 添加页面
			pageAdd() {
				this.application.pages.push({id:this.u_guid(),name:"新页面"+(this.application.pages.length+1),navigation:{dock:{default:{mode:"top",top:{logoDock:""},left:{}},responsive:{mode:"top",top:{},left:{},bottom:{}}},list:[]},layouts:[],responsive:{xs:{enabled:true,style:{background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},sm:{enabled:true,style:{background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},md:{enabled:true,style:{background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},lg:{enabled:true,style:{background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},xl:{enabled:true,style:{background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},xxl:{enabled:true,style:{background:{mode:"color",color:{src:"#fff"},image:{src:"",size:{width:"auto",height:"auto"},position:{top:"0%",left:"0%"}}}}}}});
			},
			// 移除页面
			pageRemove(sidx) {
				const that = this;
				uni.showModal({
					title: "确认删除吗",
					success: function(res) {
						if (!res.confirm) {
							return;
						}

						that.style.pageConfigModal.show = false;
						that.application.pages.splice(sidx, 1);
						that.application.currentPage = 0;
					}
				});
			},
			// 添加布局项
			layoutAdd() {
				this.currentPage.layouts.push({id:this.u_guid(),name:"新版块"+(this.currentPage.layouts.length+1),isNav:true,responsive:{xs:{enabled:true,style:{height:0,background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},sm:{enabled:true,style:{height:0,background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},md:{enabled:true,style:{height:0,background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},lg:{enabled:true,style:{height:0,background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},xl:{enabled:true,style:{height:0,background:{mode:"",color:{src:""},image:{src:"",size:{width:"",height:""},position:{top:"",left:""}}}}},xxl:{enabled:true,style:{height:300,background:{mode:"color",color:{src:""},image:{src:"",size:{width:"auto",height:"auto"},position:{top:"0%",left:"0%"}}}}}},type:"0",items:[],});
			},
			// 移动布局项
			layoutMove(sidx, direction) {
				const array = this.currentPage.layouts;
				if (direction == "up") {
					if (sidx == 0) {
						return;
					}
					array.splice(sidx, 1, ...array.splice(sidx - 1, 1, array[sidx]));
					return;
				}
				if (direction == "down") {
					if (sidx == array.length - 1) {
						return;
					}
					array.splice(sidx, 1, ...array.splice(sidx + 1, 1, array[sidx]));
					return;
				}
			},
			// 移除布局项
			layoutRemove(sidx) {
				const that = this;
				that.style.layoutConfigModal.show = false;
				uni.showModal({
					title: "确认删除吗",
					success: function(res) {
						if (!res.confirm) {
							return;
						}

						that.currentPage.layouts.splice(sidx, 1);
					}
				});
			},
			// 添加导航项
			navAdd() {
				this.currentPage.navigation.list.push({id:this.u_guid(),name:"新导航",type:"link",path:"",ico:"link"});
			},
			// 移动导航项
			navMove(sidx, direction) {
            const array = this.currentPage.navigation.list;
            if (direction == "up") {
                if (sidx == 0) {
                    return;
                }
                array.splice(sidx, 1, ...array.splice(sidx - 1, 1, array[sidx]));
                return;
            }
            if (direction == "down") {
                if (sidx == array.length - 1) {
                    return;
                }
                array.splice(sidx, 1, ...array.splice(sidx + 1, 1, array[sidx]));
                return;
            }
			},
			// 移除导航项
			navRemove(sidx) {
				const that = this;
				uni.showModal({
					title: "确认删除吗",
					success: function(res) {
						if (!res.confirm) {
							return;
						}

						that.currentPage.navigation.list.splice(sidx, 1);
					}
				});
			},
			// 导航项激活
			navActive(item) {
				this.style.navShow = false;

				if (item.isNav) { //跳转页内布局
					return;
				}

				if (item.type == 'page') {
					let id = item.path.split('_')[1];
					let index = this.application.pages.findIndex(curr => curr.id == id);
					if (index > -1) {
						this.application.currentPage = index;
					}
				} else { //复制链接
					//...
				}
			},
			/********** 后端通讯 **********/
			// 保存
			s_saveInfo() {
				if (this.params.saving) {
					return;
				}
				this.params.saving = true;

				let copy = JSON.parse(JSON.stringify(this.application));
				copy.currentPage = 0;

				const that = this;
				const length = 1000;
				const _post = function(json, index, key) {
					that.$u.post("vd_app_save", {
						id: that.params.did,
						uid: that.uid,
						appname: that.application.name,
						istlp: (that.params.isTlp ? 1 : 0),
						main: JSON.stringify({
							total: (json.length % length > 0 ? parseInt(json.length / length) + 1 : json.length / length),
							current: index,
							fragment: json.substring((index - 1) * length, index * length),
							key: key
						})
					}).then(res => {
						if (res.retcode == -1) {
							that.params.saving = false;
							uni.showToast({
								title: "保存失败 " + res.retmsg,
								icon: "none"
							});
							return;
						}

						if (res.retmsg == "next") {
							_post(json, index + 1, res.result);
							return;
						}

						that.did = res.result;
						that.params.saving = false;
						uni.showToast({
							title: "保存成功",
							icon: "none"
						});
					}).catch(err => {
						uni.showToast({
							title: "保存失败 系统错误",
							icon: "none"
						});
						that.params.saving = false;
					});
				};
				_post(JSON.stringify(copy), 1, "none");
			},
			// 退出
			s_exit() {
				uni.showModal({
					title: "退出前请确认已保存修改",
					cancelText: "我再看看",
					confirmText: "我已保存，退出",
					success: function(res) {
						if (!res.confirm) {
							return;
						}

						uni.redirectTo({
							url: "manage"
						});
					}
				});
			},
			/********** 工具方法 **********/
			// 通用图片上传
			u_uploadImg(callback) {
				this.u_uploadFile(callback, "image");
			},
			// 通用视频上传
			u_uploadVid(callback) {
				this.u_uploadFile(callback, "video");
			},
			// 通用文件上传
			u_uploadFile(callback, type) {
				const that = this;
				const _upload = function(localPath) {
					uni.uploadFile({
						url: that.$u.http.config.baseUrl + that.$u.createUrl("upload"),
						name: "file",
						filePath: localPath,
						success: function(ures) {
							let udata = JSON.parse(ures.data);
							if (udata.retcode == "-1") {
								uni.showToast({
									title: "上传失败",
									icon: "none"
								});
								return;
							}

							(callback || function(path) {}).apply(that, [udata.result]);
						}
					});
				};

				if (type == "image") {
					uni.chooseImage({
						count: 1,
						sizeType: ["original"],
						success: function(res) {
							_upload(res.tempFilePaths[0]);
						}
					});
				} else if (type == "video") {
					uni.chooseVideo({
						count: 1,
						compressed: false,
						success: function(res) {
							_upload(res.tempFilePaths[0]);
						}
					});
				} else {
					uni.chooseFile({
						count: 1,
						success: function(res) {
							_upload(res.tempFilePaths[0]);
						}
					});
				}
			},
			// 拖动改大小 - 起始
			u_dragsize_start(ev) {
				this.style.dragsize.oldYaxis = ev.touches[0].clientY;
			},
			// 拖动改大小 - 拖动中
			u_dragsize_ing(ev) {
				if (!this.style.dragsize.layout) {
					return;
				}

				let h = this.u_getViewStyle(this.style.dragsize.layout).height;
				h += Math.round(ev.touches[0].clientY - this.style.dragsize.oldYaxis);
				this.style.dragsize.oldYaxis = ev.touches[0].clientY;
				this.u_getStyle(this.style.dragsize.layout).height = h;
			},
			// 拖动改大小 - 完成
			u_dragsize_ok(ev) {
				this.style.dragsize.layout = null;
				this.style.dragsize.oldYaxis = 0;
			},
			// GUID 生成
			u_guid() {
				return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
				function S4() {
					return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
				}
			},
			// 时间格式化
			u_formatDatetime(datetime) {
				let year = datetime.getFullYear();
				let month = datetime.getMonth();
				let day = datetime.getDate();
				let hours = datetime.getHours();
				let minutes = datetime.getMinutes();
				let secounds = datetime.getSeconds();

				return year + "-"
					+ padZero(month) + "-"
					+ padZero(day)
					;

				function padZero(src) {
					if (src >= 10) {
						return src.toString();
					}
					return "0" + src;
				}
			},
			// 根据响应式设置提取样式
			u_getStyle(obj) {
				return obj.responsive[this.params.viewMode].style;
			},
			// 根据响应式设置提取样式
			u_getViewStyle(obj) {
				let style = JSON.parse(JSON.stringify(this.u_getStyle(obj)));
				let defaultStyle = JSON.parse(JSON.stringify(obj.responsive["xxl"].style));
				return __assign(style, defaultStyle);

				function __assign(a, b) {
					for (const key in a) {
						let value = a[key];
						let refer = b[key];
						if (value && typeof value == "object") {
							value = __assign(value, refer);
						}
						if (!value && refer) {
							a[key] = refer;
						}
					}
					return a;
				}
			},
			/********** UI交互处理 **********/
			v_navTypeName(typeId) {
				return typeId == "page" ? "页面导航" : "外链导航";
			},
			v_navPageName(path) {
				let pageId = path.split('_')[1];
				let page = this.application.pages.find(curr => curr.id == pageId);
				return (page || {name: "- 页面不存在 -"}).name || "新页面";
			},
			v_layoutTypeName(typeId) {
				let type = this.style.layoutConfigModal.selType.list.find(curr => curr.value == typeId);
				return (type || this.style.layoutConfigModal.selType.list[0]).label;
			},
			pageCfgTabsChange(index) {
				this.style.pageConfigModal.swiper.swiperCurrent = index;
			},
			pageCfgTabsSwiperTransition({ detail: { dx } }) {
				this.$refs.pageCfgTabs.setDx(dx);
			},
			pageCfgTabsSwiperAnimationfinish({ detail: { current } }) {
				this.$refs.pageCfgTabs.setFinishCurrent(current);
				this.style.pageConfigModal.swiper.swiperCurrent = current;
				this.style.pageConfigModal.swiper.current = current;
			},
			pageLayoutTypeSelectConfirm(event) {
				const layout = this.currentPageLayout;
				if (layout.type == 0) {
					layout.items.splice(0, layout.items.length);
					layout.type = event[0].value;
					return;
				}

				const that = this;
				uni.showModal({
					title: "切换类型后，当前内容将丢失",
					confirmText: "切换",
					success: function(res) {
						layout.items.splice(0, layout.items.length);
						layout.type = event[0].value;
					}
				});
			},
		}
	}
</script>

<style lang="scss">
*,*::before,*::after{box-sizing:border-box}
.worktable{width:100%; height:100vh; background:#f8f9fa; overflow:auto;}
.worktable_main{width:100%; height:100%; margin:0 auto; background:#fff;}
.page{display:flex;flex-direction:column;width:100%;height:100%;position:relative}
.page.navleft{flex-direction:row;}
.page.mbnavbottom .page-nav{order:3;top:auto;bottom:0;border-top:1px solid #e9ecef;box-shadow:none}
.page.mbnavbottom .page-nav+*{padding-top:0;padding-bottom:calc(4rem)}
.page.mbnavbottom .page-logo{display:none}
.page.mbnavbottom .page-nav>.page-nav-toggle{display:none}
.page.mbnavbottom .page-nav-main{display:block}
.page.mbnavbottom .page-nav-link-list{justify-content:space-around;flex-direction:row}
.page.mbnavbottom .page-nav-link-list .page-nav-link{display:flex;flex-direction:column;align-items:center;padding-bottom:0}
.page.mbnavbottom .page-nav-link-list .page-nav-link-ico{display:block;margin-bottom:20rpx;font-size:50rpx;line-height:0}
.page.page-infinite .page-content{min-height:1000vh !important}
.page-scrollable{width:100%;height:100%;position:relative;z-index:1;overflow:auto}
.page-logo::after{content:"点击更换logo" !important;}
.page-nav{flex-shrink:0;display:flex;flex-wrap:wrap;width:100%;padding:.5rem;position:fixed;z-index:9;top:0;background:#fff;box-shadow:0 0 .5rem 0 rgba(0,0,0, .2)}
.page-nav+*{padding-top:100rpx}
.page-logo{width:100%; max-width:calc(100% - 4rem);margin:0;text-align:left}
.page-logo>view{max-height:60rpx;width:100%;height:100%}
.page-nav-toggle{display:inline-block;width:54rpx;height:42rpx;margin:10rpx 0 10rpx auto;position:relative;border:0;background:transparent;overflow:hidden}
.page-nav-toggle::before,.page-nav-toggle::after{content:"";display:block;width:54rpx;transition:all ease .3s}
.page-nav-toggle::before{height:42rpx;position:relative;border-width:6rpx 0 6rpx 0;border-style:solid;border-color:#5c666c}
.page-nav-toggle::after{height:6rpx;position:absolute;top:calc(50% - 6rpx / 2);background:#5c666c}
.page-nav-toggle.active::before{width:48rpx;height:6rpx;top:calc(50% - 6rpx / 2);border:0;background:#111;transform:rotate(45deg)}
.page-nav-toggle.active::after{width:48rpx;transform:rotate(-45deg);background:#111}
.page-nav-main{display:none;width:100%}
.page-nav-main.show{display:block}
.page-nav-link-list{display:flex;flex-direction:column;width:100%;padding:8rpx 20rpx 0 20rpx;background:#fff}
.page-nav-link{padding:20rpx;color:rgba(0,0,0,.5);text-decoration:none}
.page-nav-link:hover{color:#0d6efd}
.page-nav-link-ico{display:none}
.page-item-remove{box-sizing:content-box;display:none;width:1em;height:1em;padding:.25em .25em;position:absolute;top:-.75rem;right:.75rem;z-index:99;color:#000;background:#fff url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;border:0;border-radius:50%;cursor:pointer}
.page-layout{position:relative;border-bottom:2rpx dashed #dee2e6}
.page-layout>.page-item-remove{display:block}
.page-layout-smtool{display:flex;position:absolute;z-index:1;top:0;left:calc(50% - 45px);background:#373737}
.page-layout-smtool>*{width:30px;height:30px;color:#f8f9fa;cursor:pointer}
.page-layout-resize{display:block;width:100%;padding:4rpx 0;position:absolute;z-index:2;bottom:0;left:0;font-size:20rpx;text-align:center;color:#fff;background:rgba(0,0,0,.375);cursor:ns-resize}
.page-layout-bg{width:100%;height:100%;position:absolute;top:0;left:0;z-index:0;background-size:100% auto}
.page-layout-body{display:flex;align-items:center;width:100%;min-height:180px;padding:0 26rpx;position:relative;z-index:1;}
.page-nav.likemb{width:100% !important;position:absolute;z-index:9;flex-direction:row}
.page-nav.likemb+*{padding-top:calc(4rem - 8px)}
.page-logo.likemb{margin:0 !important;text-align:left}
.page-logo.likemb>view{max-height:40px}
.page-nav-toggle.likemb{display:block}
.page-nav-main.likemb{display:none}
.page-nav-main.likemb.show{display:block}
.page-nav-link-list.likemb{flex-direction:column;justify-content:start}
.page.mbnavbottom .page-nav.likemb{top:auto;bottom:0;border-top:1px solid #e9ecef;box-shadow:none}
.page.mbnavbottom .page-nav.likemb+*{padding-top:0;padding-bottom:calc(4rem - 8px)}
.page.mbnavbottom .page-logo.likemb{display:none}
.page.mbnavbottom .page-nav.likemb>.page-nav-toggle{display:none}
.page.mbnavbottom .page-nav-main.likemb{display:block}
.page.mbnavbottom .page-nav-link-list.likemb{justify-content:space-around;flex-direction:row}
.page.mbnavbottom .page-nav-link-list.likemb .page-nav-link{display:flex;flex-direction:column;align-items:center;padding-bottom:0}
.page.mbnavbottom .page-nav-link-list.likemb .page-nav-link-ico{display:block;margin-bottom:20rpx;font-size:50rpx;line-height:0}
.page-nav.likepc{position:relative;flex-direction:column}
.page-nav.likepc+*{padding-top:0}
.page-logo.likepc{margin:0 auto;text-align:center}
.page-logo.likepc>view{max-height:none}
.page-nav.likepc>.page-nav-toggle{display:none}
.page-nav-link-list.likepc{display:flex;flex-direction:row;justify-content:center}
.page-nav-link-list.likepc .page-nav-link-ico{display:none;}
.page.navleft .page-nav.likepc{width: auto;}
.page.navleft .page-logo.likepc{max-width:none;margin:2.85rem auto 1.375rem auto}
.page.navleft .page-nav.likepc>.page-nav-toggle{display:none}
.page.navleft .page-nav-link-list.likepc{flex-direction:column !important;font-size:1.1rem}
.page.navleft .page-nav-link-list.likepc .page-nav-link-ico{display:inline-block;font-size:1.25rem}

/* 各设置项 */
//布局设置
.page-layout-cfgbtn-group{display:flex; position:absolute; z-index:5; top:8rpx; right:12rpx;}
.page-layout-cfgbtn{padding:10rpx 16rpx; font-size:32rpx; background:#2979ff; color:#fff; border:2rpx solid #0d6efd; border-radius:8rpx;}
.page-layout-cfgbtn-group>.page-layout-cfgbtn{border-radius:0;}
.page-layout-cfgbtn-group>.page-layout-cfgbtn:first-child{border-radius:8rpx 0 0 8rpx;}
.page-layout-cfgbtn-group>.page-layout-cfgbtn:last-child{border-radius:0 8rpx 8rpx 0;}
.page-layout-cfgbtn-group>.page-layout-cfgbtn:not(:last-child){border-right:0;}
.page-layout-cfgmodal{display:flex; height:100%;}
.page-layout-cfgmodal-toggler{flex-shrink:0; display:flex; align-items:center;}
.page-layout-cfgmodal-toggler>view{padding:50rpx 14rpx; background:#fff; border-radius:8rpx 0 0 8rpx;}
.page-layout-cfgmodal-body{display:flex; flex-flow:column; width:100%; height:100%; padding:0 26rpx; position:relative; background:#fff;}
.page-layout-cfgmodal-title{padding:40rpx 0 20rpx 0; font-size:36rpx; font-weight:100;}
.page-layout-cfgmodal-opera{border-top:2rpx solid #dee2e6;}
//页面、导航设置
.page-cfgmodal{display:flex; flex-flow:column; width:100%; height:100%;}
.page-cfgmodal-body{flex:1; display:flex; flex-flow:column; padding:0 26rpx; background:#fff;}
.page-cfgmodal-toggler{flex-shrink:0; display:flex; justify-content:center;}
.page-cfgmodal-toggler>view{padding:8rpx 60rpx; background:#fff; border-radius:0 0 8rpx 8rpx;}
.page-cfgmodal-toggler-ico{transform:rotate(-90deg);}
.page-cfgmodal-title{padding:40rpx 0 10rpx 0; font-size:36rpx; font-weight:100;}
.page-cfglayout{margin:20rpx 0 40rpx 0;}
.page-cfglayout-name{display:flex; margin-bottom:8rpx;}
.page-cfglayout-name>view:first-child{flex-shrink:0; display:flex; justify-content:center; align-items:center; width:80rpx; font-size:38rpx;}
.page-cfglayout-name>view:last-child{width:100%;}
.page-cfglayout-opera{display:flex; justify-content:flex-end; font-size:28rpx;}
.page-cfglayout-opera>view{margin-right:40rpx; color:#606266;}
.page-cfglayout-opera>view:last-child{margin:0;}
.page-cfgnav{margin:20rpx 0 40rpx 0;}
.page-cfgnav-link{display:flex; margin-bottom:8rpx;}
.page-cfgnav-link>view:first-child{flex-shrink:0; width:200rpx; margin-right:12rpx;}
.page-cfgnav-link>view:last-child{width:100%;}
.page-cfgnav-name{display:flex; margin-bottom:8rpx;}
.page-cfgnav-name>view:first-child{flex-shrink:0; display:flex; justify-content:center; align-items:center; width:80rpx; font-size:38rpx;}
.page-cfgnav-name>view:last-child{width:100%;}
.page-cfgnav-opera{display:flex; justify-content:flex-end; font-size:28rpx;}
.page-cfgnav-opera>view{margin-right:40rpx; color:#606266;}
.page-cfgnav-opera>view:last-child{margin:0;}
//应用设置
.app-cfgmodal{display:flex; height:100%;}
.app-cfgmodal-toggler{flex-shrink:0; display:flex; align-items:center;}
.app-cfgmodal-toggler>view{padding:50rpx 14rpx; background:#fff; border-radius:0 8rpx 8rpx 0;}
.app-cfgmodal-body{display:flex; flex-flow:column; width:100%; height:100%; padding:0 26rpx; position:relative; background:#fff;}
.app-cfgmodal-title{padding:40rpx 0 20rpx 0; font-size:36rpx; font-weight:100;}
.app-cfgmodal-opera{border-top:2rpx solid #dee2e6;}
.app-cfgpage{margin:20rpx 0 30rpx 0;}
.app-cfgpage-name{display:flex; margin-bottom:8rpx;}
.app-cfgpage-name>view:last-child{width:100%;}
.app-cfgpage-name>view:first-child{flex-shrink:0; display:flex; justify-content:center; align-items:center; margin-right:8rpx; font-size:44rpx;}
.app-cfgpage-opera{display:flex; justify-content:flex-end; font-size:28rpx;}
.app-cfgpage-opera>view{margin-right:40rpx; color:#606266;}
.app-cfgpage-opera>view:last-child{margin:0;}
//设置弹出按钮
.cfgmodal-opener{position:fixed; z-index:15; top:35%; left:0;}
.cfgmodal-opener-toggler{padding:20rpx 12rpx; font-size:40rpx; background:#ffc107; border-left:2rpx solid #f9ae3d; border-radius:0 8rpx 8rpx 0;}
.cfgmodal-opener-content{display:none; padding:2rpx 16rpx; background:#ffc107; border-radius:0 0 8rpx 0;}
.cfgmodal-opener-content>view{padding:18rpx 20rpx; border-bottom:2rpx solid #fff3cd;}
.cfgmodal-opener-content>view:last-child{border:0;}
.cfgmodal-opener.show>.cfgmodal-opener-toggler{padding:6rpx 0; text-align:center; border-bottom:2rpx solid #ff9900; border-radius:0 8rpx 0 0;}
.cfgmodal-opener.show>.cfgmodal-opener-content{display:block;}

.closed{padding:30rpx 0; font-size:36rpx; text-align:center; color:#adb5bd;}
</style>
