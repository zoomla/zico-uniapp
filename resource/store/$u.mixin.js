import { mapState } from 'vuex'
import store from "@/store"

let $uStoreKey = [];
let $initStoreState = {}
try{
	$uStoreKey = store.state ? Object.keys(store.state) : [];
	let lifeData = uni.getStorageSync('lifeData');
	$initStoreState = JSON.parse(JSON.stringify(store.state));
	store.replaceState(Object.assign(store.state,lifeData))
	
}catch(e){
	
}

module.exports = {
	beforeCreate() {
		// 将vuex方法挂在到$u中
		// 使用方法为：如果要修改vuex的state中的user.name变量为"史诗" => this.$u.vuex('user.name', '史诗')
		// 如果要修改vuex的state的version变量为1.0.1 => this.$u.vuex('version', '1.0.1')
		this.$u.vuex = (name, value) => {
			this.$store.commit('$uStore', {
				name,value
			})
		}
		
		this.$u.vuexReset = ()=>{
			this.$store.commit('$resetStore',$initStoreState);
		}
	},
	computed: {
		// 将vuex的state中的所有变量，解构到全局混入的mixin中
		...mapState($uStoreKey)
	}
}