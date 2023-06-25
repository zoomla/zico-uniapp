<template>
	<view>
		<view class="canvas_container">
			<canvas id="canvas" canvas-id="canvas" class="canvas"
				:style="{width: canvas.width + 'px', height: canvas.height + 'px'}" @touchstart="drawBegin"
				@touchmove="drawProcessing" @touchend="drawEnd" @touchcancel=""></canvas>
		</view>
		<view class="form-btn-group">
			<view class="form-btn form-btn-warn" @click="drawUndo">撤销</view>
			<view class="form-btn form-btn-warn" @click="drawRedo">还原</view>
			<view class="form-btn form-btn-ok" @click="drawReplay">回放</view>
			<view class="form-btn form-btn-err" @click="drawClear">重置</view>
		</view>
		<view class="wordlst_container">
			<view class="wordlst_title">选择文字</view>
			<view class="wordlst">
				<view v-for="item in font.words" @click="font.currentWrite.word = item.word; drawClear();">{{item.word}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/* 画板 */
				page: {
					width: 0,
					height: 0,
					navbar: {
						height: 0
					},
				},
				canvas: {
					width: 0,
					height: 0,
					instance: null,
					brush: {
						weight: 16
					},
					drawing: {
						flag: false,
						prePoint: {
							x: 0,
							y: 0
						}
					}
				},
				strokes: {
					drawing: null,
					list: [],
					undoList: []
				},
				/* 后端数据 */
				font: {
					currentWrite: {
						word: "永"
					},
					words: [
						{ word: "锟" },
						{ word: "斤" },
						{ word: "拷" },
						{ word: "烫" },
						{ word: "永" },
						{ word: "合" },
						{ word: "旬" },
						{ word: "祸" },
						{ word: "曾" },
						{ word: "框" },
						{ word: "外" },
						{ word: "秘" },
						{ word: "宋" },
						{ word: "强" },
						{ word: "誓" },
						{ word: "怜" },
						{ word: "周" },
						{ word: "遇" },
						{ word: "科" },
						{ word: "毕" },
						{ word: "敌" },
						{ word: "争" },
						{ word: "子" },
						{ word: "桨" },
						{ word: "药" },
					]
				},
			};
		},
		mounted() {
			const that = this;
			let canvas = uni.createCanvasContext("canvas");
			this.canvas.instance = canvas;
			uni.getSystemInfo({
				success: function(res) {
					that.canvas.width = res.windowWidth;
					that.canvas.height = res.windowWidth;
					that.page.width = res.windowWidth;
					that.page.height = res.windowHeight;
					that.page.navbar.height = res.screenHeight - res.windowHeight;

					setTimeout(function() {
						that.drawReset();
					}, 100);
				}
			});
		},
		methods: {
			drawBegin(ev) {
				this.canvas.drawing.flag = 1;
				this.canvas.drawing.prePoint.x = ev.touches[0].x;
				this.canvas.drawing.prePoint.y = ev.touches[0].y;
				this.strokes.drawing = [];
			},
			drawProcessing(ev) {
				const that = this;
				if (!this.canvas.drawing.flag) {
					return;
				}
				const touch = ev.touches[0];

				function __fixPoint(point) {
					let result = {
						x: false,
						y: false
					};

					if (point.x < 0) {
						point.x = 0;
					} else if (point.x > that.canvas.width) {
						point.x = that.canvas.width;
					} else {
						result.x = true;
					}
					if (point.y < 0) {
						point.y = 0;
					} else if (point.y > that.canvas.height) {
						point.y = that.canvas.height;
					} else {
						result.y = true;
					}

					return result;
				}

				function __getRandomColor() {
					let bsArr = ["0d6efd", "6610f2", "6f42c1", "d63384", "dc3545", "fd7e14", "ffc107", "198754", "20c997", "0dcaf0", "adb5bd", "000"];
					let layArr = ["009688", "5FB878", "393D49", "1E9FFF", "FFB800", "FF5722", "01AAED", "2F4056", "cccccc"];
					let arr = layArr;
					return "#" + arr[Math.floor(Math.random() * arr.length)];

					// function __g(color) {
					// 	return (color += '0123456789abcdef' [Math.floor(Math.random() * 16)]) && (color.length == 6) ? color : __g(color);
					// }
				}

				let pre = {
					x: this.canvas.drawing.prePoint.x,
					y: this.canvas.drawing.prePoint.y
				};
				let preCheck = __fixPoint(pre);
				let curr = {
					x: touch.x,
					y: touch.y
				};
				let currCheck = __fixPoint(curr);

				if (!preCheck.x || !preCheck.y) {
					this.canvas.drawing.prePoint.x = touch.x;
					this.canvas.drawing.prePoint.y = touch.y;
					return;
				}

				this.canvas.instance.beginPath();
				this.canvas.instance.setLineWidth(this.canvas.brush.weight);
				this.canvas.instance.setLineCap("round");
				this.canvas.instance.setLineJoin("round");
				this.canvas.instance.setStrokeStyle("#000000");
				this.canvas.instance.moveTo(pre.x, pre.y);
				this.canvas.instance.lineTo(curr.x, curr.y);
				this.canvas.instance.stroke();
				this.canvas.instance.draw(true);
				this.canvas.instance.closePath();

				this.strokes.drawing.push({
					from: {
						x: pre.x,
						y: pre.y
					},
					to: {
						x: curr.x,
						y: curr.y
					}
				});

				this.canvas.drawing.prePoint.x = touch.x;
				this.canvas.drawing.prePoint.y = touch.y;
			},
			drawEnd(ev) {
				this.canvas.drawing.flag = false;
				this.strokes.list.push(this.strokes.drawing);
				this.strokes.drawing = null;
				this.strokes.undoList.splice(0, this.strokes.undoList.length);
			},
			drawReset() {
				let fontSize = parseInt(this.canvas.width / 9 * 7);
				this.canvas.instance.beginPath();
				this.canvas.instance.setFillStyle("#dee2e6");
				this.canvas.instance.font = fontSize + "px HeiTi";
				this.canvas.instance.fillText(this.font.currentWrite.word, this.canvas.width / 2 - fontSize / 2, this.canvas.height / 2 + fontSize / 3);
				// this.canvas.instance.drawImage("/static/images/wdbg_cjk.png", 0, 0, this.canvas.width, this.canvas.height);
				this.canvas.instance.draw();
				this.canvas.instance.closePath();
			},
			drawClear() {
				this.drawReset();
				this.strokes.list.splice(0, this.strokes.list.length);
			},
			drawUndo() {
				if (!this.strokes.list.length) {
					return;
				}
				this.strokes.undoList.push(this.strokes.list.pop());
				this.drawReplay(0);
			},
			drawRedo() {
				if (!this.strokes.undoList.length) {
					return;
				}
				this.strokes.list.push(this.strokes.undoList.pop());
				this.drawReplay(0);
			},
			drawReplay(delay) {
				delay = parseInt(delay);
				if (isNaN(delay) || delay < 0) {
					delay = 30;
				}
				const that = this;
				this.drawReset();

				function __next(arr, idx) {
					if (idx >= arr.length) {
						return;
					}

					function __play(act, step) {
						if (step >= act.length) {
							__next(arr, idx + 1);
							return;
						}

						let item = act[step]; //line
						const split = 10;
						let xs = parseInt((item.to.x - item.from.x) / split) || 1; //x
						let ys = parseInt((item.to.y - item.from.y) / split) || 1; //y

						if (xs < 0) {
							xs = ~xs + 1;
						}
						if (ys < 0) {
							ys = ~ys + 1;
						}

						if (xs > ys) {
							xs = ys;
						} else if (xs < ys) {
							ys = xs;
						}

						function __ani(line, count) {
							if (count >= xs) {
								__play(act, step + 1);
								return;
							}

							that.canvas.instance.beginPath();
							that.canvas.instance.setLineWidth(that.canvas.brush.weight);
							that.canvas.instance.setLineCap("round");
							that.canvas.instance.setLineJoin("round");
							that.canvas.instance.setStrokeStyle("#000000");
							that.canvas.instance.moveTo(line.x, line.y);
							line.x += (item.to.x - item.from.x) / xs;
							line.y += (item.to.y - item.from.y) / xs;
							that.canvas.instance.lineTo(line.x, line.y);
							that.canvas.instance.stroke();
							that.canvas.instance.draw(true);
							that.canvas.instance.closePath();

							setTimeout(function() {
								__ani(line, count + 1);
							}, delay);
						}
						__ani({
							x: item.from.x,
							y: item.from.y
						}, 0);
					}

					let current = arr[idx]; //array
					__play(current, 0);
				}

				__next(this.strokes.list, 0);
			},
		},
	}
</script>

<style lang="scss">
.form-btn-group{display:flex; margin:0 20rpx 40rpx 20rpx;}
.form-btn-group>.form-btn{margin:0 20rpx;}

.wordlst_container{padding:0 26rpx;}
.wordlst_title{margin-bottom:20rpx; font-size:36rpx;}
.wordlst{display:flex; flex-wrap:wrap;}
.wordlst>view{display:flex; justify-content:center; align-items:center; width:calc(100% / 7 - 12rpx); height:80rpx; margin:6rpx; background:#e9ecef;}
</style>
