import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;

App.mpType = 'app';
Vue.prototype.appId = 'wx884dfcb76a26d423';
// 引入全局uView
import uView from 'uview-ui';
Vue.use(uView);

// 此处为演示vuex使用，非uView的功能部分
import store from '@/store';

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js');
Vue.mixin(vuexStore);

// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare);

const app = new Vue({
	store,
	...App
});

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.interceptor.js';
Vue.use(httpInterceptor, app);

// http接口API抽离，免于写url或者一些固定的参数
import httpApi from '@/common/http.api.js';
Vue.use(httpApi, app);
import util from '@/common/util.js';
Vue.use(util, app);

app.$mount();

/* 项目VUE组件注册 */
const eventBus = new Vue();
Vue.prototype.EventBus = eventBus; // 用于组件通信的事件总线
// 底部的购物车栏
import cartFooter from "@/components/cart-footer.vue";
Vue.component("cart-footer", cartFooter);
// 商品添加到购物车按钮
import cartAddor from "@/components/cart-add.vue";
Vue.component("cart-add", cartAddor);
// 自定义bar
// import mybar from "@/components/mybar.vue";
// Vue.component("mybar", mybar);