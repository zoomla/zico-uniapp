
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/home/index","pages/home/ucenter","pages/home/create","pages/home/live","pages/home/enjoy","pages/home/enjoy_item","pages/home/enjoy_item_comments","pages/member/login","pages/member/wxauth","pages/member/fav","pages/member/myorder","pages/member/money","pages/member/pay","pages/member/setting","pages/member/jifen","pages/member/mybiao","pages/member/mybiao_item","pages/member/uzhuxiao","pages/shop/cart","pages/shop/getOrder","pages/shop/shop","pages/shop/shop_class","pages/shop/shop_item","pages/shop/renren","pages/shop/shopZhan","pages/shop/choose_address","pages/webview/z01-com","pages/webview/zfont-list","pages/webview/sjtzj-com","pages/webview/73ic-com","pages/webview/zfont-f","pages/webview/z01-ico","pages/webview/copyright_privacy","pages/webview/copyright_server","pages/channel/hui","pages/channel/zhan","pages/channel/biao","pages/channel/edu","pages/channel/class","pages/channel/yuyue","pages/channel/search","pages/channel/class_super"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"test","navigationBarBackgroundColor":"#FFFFFF","backgroundColor":"#FFFFFF"},"tabBar":{"color":"#909399","selectedColor":"#bebebf","backgroundColor":"#1A191F","borderStyle":"black","list":[{"pagePath":"pages/home/index","iconPath":"static/images/foot_icon1.png","selectedIconPath":"static/images/foot_icon1_2.png","text":"精裱"},{"pagePath":"pages/home/create","iconPath":"static/images/foot_icon2.png","selectedIconPath":"static/images/foot_icon2_2.png","text":"造字"},{"pagePath":"pages/home/enjoy","iconPath":"static/images/foot_icon4.png","selectedIconPath":"static/images/foot_icon4_2.png","text":"瘦金"},{"pagePath":"pages/home/ucenter","iconPath":"static/images/foot_icon5.png","selectedIconPath":"static/images/foot_icon5_2.png","text":"我的"}],"midButton":{"width":"50px","height":"68px","iconPath":"static/images/mid.png","iconWidth":"50px","text":"发现"}},"preloadRule":{"pages/home/index":{"network":"all","packages":["__APP__","pages/channel"]},"pages/shop/shop":{"network":"all","packages":["pages/shop"]},"pages/home/live":{"network":"all","packages":["pages/member"]},"pages/home/ucenter":{"network":"all","packages":["pages/webview"]}},"nvueCompiler":"uni-app","nvueStyleCompiler":"weex","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"装裱大师","compilerVersion":"3.2.16","subPackages":[{"root":"pages/member"},{"root":"pages/shop"},{"root":"pages/webview"},{"root":"pages/channel"}],"entryPagePath":"pages/home/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/home/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"装裱大师-造字用字及装裱","enablePullDownRefresh":false,"navigationBarBackgroundColor":"#0F0F11"}},{"path":"/pages/home/ucenter","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"会员中心","enablePullDownRefresh":false}},{"path":"/pages/home/create","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/home/live","meta":{},"window":{"navigationBarTitleText":"发现·字研社旗下矩阵","enablePullDownRefresh":false}},{"path":"/pages/home/enjoy","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"绝美瘦金·千年传承","enablePullDownRefresh":false}},{"path":"/pages/home/enjoy_item","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/home/enjoy_item_comments","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/member/login","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/member/wxauth","meta":{},"window":{"navigationBarTitleText":"登录","enablePullDownRefresh":false}},{"path":"/pages/member/fav","meta":{},"window":{"navigationBarTitleText":"我的收藏","enablePullDownRefresh":false}},{"path":"/pages/member/myorder","meta":{},"window":{"navigationBarTitleText":"我的订单","enablePullDownRefresh":false}},{"path":"/pages/member/money","meta":{},"window":{"navigationBarTitleText":"资金明细","enablePullDownRefresh":false}},{"path":"/pages/member/pay","meta":{},"window":{"navigationBarTitleText":"支付页面","enablePullDownRefresh":false}},{"path":"/pages/member/setting","meta":{},"window":{"navigationBarTitleText":"个人信息设置","enablePullDownRefresh":false}},{"path":"/pages/member/jifen","meta":{},"window":{"navigationBarTitleText":"积分管理","enablePullDownRefresh":false}},{"path":"/pages/member/mybiao","meta":{},"window":{"navigationBarTitleText":"我的裱件","enablePullDownRefresh":false}},{"path":"/pages/member/mybiao_item","meta":{},"window":{"navigationBarTitleText":"字研社艺术品鉴真证书","enablePullDownRefresh":false}},{"path":"/pages/member/uzhuxiao","meta":{},"window":{"navigationBarTitleText":"注销帐户操作","enablePullDownRefresh":false}},{"path":"/pages/shop/cart","meta":{},"window":{"navigationBarTitleText":"购物车","enablePullDownRefresh":false}},{"path":"/pages/shop/getOrder","meta":{},"window":{"navigationBarTitleText":"订单结算","enablePullDownRefresh":false}},{"path":"/pages/shop/shop","meta":{},"window":{"navigationBarTitleText":"字研所线上商城","enablePullDownRefresh":false}},{"path":"/pages/shop/shop_class","meta":{},"window":{"navigationBarTitleText":"商城列表","enablePullDownRefresh":false}},{"path":"/pages/shop/shop_item","meta":{},"window":{"navigationBarTitleText":"艺术品详情","enablePullDownRefresh":false}},{"path":"/pages/shop/renren","meta":{},"window":{"navigationBarTitleText":"人人画","enablePullDownRefresh":false}},{"path":"/pages/shop/shopZhan","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/shop/choose_address","meta":{},"window":{"navigationBarTitleText":"我的地址","enablePullDownRefresh":false}},{"path":"/pages/webview/z01-com","meta":{},"window":{"navigationBarTitleText":"逐浪软件","enablePullDownRefresh":false}},{"path":"/pages/webview/zfont-list","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/webview/sjtzj-com","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/webview/73ic-com","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/webview/zfont-f","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/webview/z01-ico","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/webview/copyright_privacy","meta":{},"window":{"navigationBarTitleText":"隐私政策","enablePullDownRefresh":false}},{"path":"/pages/webview/copyright_server","meta":{},"window":{"navigationBarTitleText":"服务协议","enablePullDownRefresh":false}},{"path":"/pages/channel/hui","meta":{},"window":{"navigationBarTitleText":"西江会-汇聚江右智慧","enablePullDownRefresh":false}},{"path":"/pages/channel/zhan","meta":{},"window":{"navigationBarTitleText":"佶雅阁瘦金书法珍品展","enablePullDownRefresh":false}},{"path":"/pages/channel/biao","meta":{},"window":{"navigationBarTitleText":"古法装裱局-字研社荣誉出品","enablePullDownRefresh":false}},{"path":"/pages/channel/edu","meta":{},"window":{"navigationBarTitleText":"瘦金传习社","enablePullDownRefresh":false}},{"path":"/pages/channel/class","meta":{},"window":{"navigationBarTitleText":"文章子列表","enablePullDownRefresh":false}},{"path":"/pages/channel/yuyue","meta":{},"window":{"navigationBarTitleText":"预约参观江西字研所","enablePullDownRefresh":false}},{"path":"/pages/channel/search","meta":{},"window":{"navigationBarTitleText":"搜索结果页","enablePullDownRefresh":false}},{"path":"/pages/channel/class_super","meta":{},"window":{"navigationBarTitleText":"文章父栏目列表","enablePullDownRefresh":false}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
