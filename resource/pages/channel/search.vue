<template>
	<view>
		<scroll-view style="height: 100vh;" scroll-y="true" @scrolltolower="getList">
			<view class="enjoy_list">
				<view @tap="showDetail(item.GeneralID)" v-for="(item, index) in list" :key="index">
					<view class="enjoy_list_title">{{item.Title}}</view>
					<view class="enjoy_list_sys">{{item.synopsis}}</view>			
					<view class="enjoy_list_pic">
						<image :src="item.TopImg" mode="widthFix" ></image>
					</view>
				</view>
			</view>
			<u-loadmore :status="loadStatus" @loadmore="getList" bg-color="transparent" />
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: "",
				list: [],
				cpage: 1,
				psize: 13,
				loadStatus: "loadmore",
				matchedCount: 0,
				nids: ""
			}
		},
		onLoad(options) {
			this.keyword = options.keyword;
			uni.setNavigationBarTitle({
				title: `搜索 “${this.keyword}”`
			})
			//this.getList();

			this.$u.get("node_list").then(res => {
				for (let i = 0; i < res.result.length; i++) {
					this.nids += "," + res.result[i].NodeID;
				}
				this.nids = this.nids.substr(1);
				this.getList();
			});
		},
		methods: {
			async getList() {
				if (this.loadStatus == "loading") {
					return;
				}
				this.loadStatus = "loading";

				let res = await this.$u.get("content_list", {
					nids: this.nids,
					elite: 0,
					cpage: this.cpage,
					psize: this.psize
				});

				let data = res.result;
				for (let i = 0; i < data.length; i++) {
					const item = data[i];
					if (item.Title.indexOf(this.keyword) >= 0) {
						this.list.push(item);
						this.matchedCount++;
					}
				}

				if (data.length > 0) {
					this.cpage++;
					this.loadStatus = "loadmore";
					if (this.matchedCount < this.psize) {
						this.getList();
					} else {
						this.matchedCount = 0;
					}
				} else {
					this.loadStatus = "nomore";
				}
			},
			showDetail(itemid){
				uni.navigateTo({
					url:'/pages/home/enjoy_item?id='+itemid
				})
			}
		}
	}
</script>

<style>

</style>
