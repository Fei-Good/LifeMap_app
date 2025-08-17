<template>
  <view class="page">
    <view class="group-2">
      <view class="section-3">
        <view class="section-4"></view>
        <image
          class="image-6 pos-4"
          src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=a42d2134ffc73f3ae5cec6f682562622.png"
        />
      </view>
      <view class="section pos">
        <view class="group-3">
          <text class="font text-2">🌟目标</text>
          <text class="font text-4 mt-23">成功跑路上岸</text>
        </view>
        <view class="flex-row ml-49">
          <view class="group-4">
            <text class="font-2 text-3">已坚持天数</text>
            <text class="font text-5 mt-24">15天</text>
          </view>
          <view class="section-2 ml-23">
            <view class="section-5"></view>
            <image
              class="image-5 pos-3"
              src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=87669546fa18210efa98b0e6d3f6b5e8.png"
            />
            <image
              class="image-4 pos-2"
              src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=68d8252965b7384f060faedacef28367.png"
            />
          </view>
        </view>
      </view>
      <view class="section-6 pos-5">
        <view class="group-5">
          <view class="section-7">
            <text class="font text-1">Hi 我是DouDou</text>
            <text class="font-2 text-6 mt-13">我可以为你制定任务、陪你聊天、帮你提效</text>
          </view>
          <view class="group-1 mt-16">
            <view class="equal-division-item-1" @tap="goToTask">
              <image
                class="image-7"
                src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=a67fe6e4354cfee0874fc38dd6baa9d5.png"
              />
              <text class="font-3 mt-14">领取任务</text>
            </view>
            <view class="equal-division-item" @tap="startChat">
              <image
                class="image-7"
                src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=660902b3aea9c710a6687b5dace09abf.png"
              />
              <text class="font-3 text-10 mt-14">聊聊谈</text>
            </view>
            <view class="equal-division-item-3 section-8" @tap="improveEfficiency">
              <image
                class="image-7"
                src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=f406b4daa9e365de69c09a1bdcda9246.png"
              />
              <text class="font-3 text-8 mt-14">提高效率</text>
            </view>
          </view>
        </view>
        <view class="mt-190">
          <image
            class="image-8"
            src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=5e6ced7910852a7f71fa6cf70e86dbe7.png"
          />
          <view class="section-9" @tap="startChat">
            <text class="font-2 text-7">和doudou聊一下吧</text>
            <image
              class="image-9"
              src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=4205b31831d578227aed4ef2e0d1a69b.png"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ChatPage',
  setup() {
    // 跳转到任务页面
    const goToTask = () => {
      uni.navigateTo({
        url: '/pages/task/task'
      })
      console.log('跳转到任务页面')
    }

    // 开始聊天
    const startChat = () => {
      uni.showToast({
        title: '开始聊天功能',
        icon: 'none'
      })
      console.log('开始聊天')
    }

    // 提高效率
    const improveEfficiency = () => {
      uni.showToast({
        title: '提高效率功能',
        icon: 'none'
      })
      console.log('提高效率')
    }

    return {
      goToTask,
      startChat,
      improveEfficiency
    }
  }
}
</script>

<style scoped>
.mt-23 {
  margin-top: 23px;
}
.ml-49 {
  margin-left: 49px;
}
.ml-23 {
  margin-left: 23px;
}
.mt-13 {
  margin-top: 13px;
}
.mt-190 {
  margin-top: 190px;
}
.page {
  padding: 19px 0 35px;
  background-image: linear-gradient(180deg, #fff9ee 0%, #ffffff 100%);
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100vh;
}
.group-2 {
  padding: 13px 0 33.5px;
  position: relative;
}
.section-3 {
  background-image: url('https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=89dd8e072752bb2369f802cdb39294f2.png');
  background-position: 0% 0%;
  background-size: 360px 619.5px;
  background-repeat: no-repeat;
  position: relative;
}
.section-4 {
  background-image: url('https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=89dd8e072752bb2369f802cdb39294f2.png');
  background-position: 0% 0%;
  background-size: 360px 619.5px;
  background-repeat: no-repeat;
  height: 619.5px;
}
.image-6 {
  width: 101px;
  height: 99px;
}
.pos-4 {
  position: absolute;
  right: 10.5px;
  top: 8px;
}
.section {
  padding: 1px 0 10px 20px;
  background-color: #fee399;
  border-radius: 16px;
  box-shadow: 0px 4px 0px #ffc072;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
.pos {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
.group-3 {
  margin-top: 19px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  align-self: flex-start;
}
.font {
  font-size: 16px;
  font-family: Microsoft YaHei;
  line-height: 15.5px;
  font-weight: 700;
  color: #333333;
}
.text-2 {
  line-height: 17px;
  font-weight: unset;
}
.text-4 {
  line-height: 15.5px;
}
.flex-row {
  display: flex;
  flex-direction: row;
  flex: 1;
}
.group-4 {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  align-self: flex-start;
}
.font-2 {
  font-size: 12px;
  font-family: Microsoft YaHei;
  line-height: 11.5px;
  color: #333333;
}
.text-3 {
  line-height: 11.5px;
}
.text-5 {
  line-height: 14.5px;
}
.section-2 {
  padding: 20.5px 0 8.5px;
  background-image: url('https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=b22ad39c160c14b9759703d57a3c615b.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 109px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  position: relative;
}
.section-5 {
  background-color: transparent;
  width: 80px;
  height: 80px;
}
.image-5 {
  width: 92px;
  height: 92px;
}
.pos-3 {
  position: absolute;
  left: 50%;
  bottom: 2px;
  transform: translateX(-50%);
}
.image-4 {
  border-radius: 44px;
  width: 56px;
  height: 59px;
}
.pos-2 {
  position: absolute;
  left: 50%;
  top: 1.5px;
  transform: translateX(-50%);
}
.section-6 {
  padding: 29px 0 32px;
  background-image: linear-gradient(180deg, rgba(238, 241, 246, 0.1) 0%, #c1e0f6 100%);
  border-radius: 16px 16px 0px 0px;
  backdrop-filter: blur(2px);
  display: flex;
  flex-direction: column;
}
.pos-5 {
  position: absolute;
  left: 0;
  right: 0;
  top: 120px;
}
.group-5 {
  padding: 0 13px;
  display: flex;
  flex-direction: column;
}
.section-7 {
  margin-right: 6px;
  padding: 11.5px 12px 12.5px;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
}
.text-1 {
  margin-left: 1.5px;
}
.text-6 {
  line-height: 12px;
  opacity: 0.5;
}
.group-1 {
  width: 280px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: flex-start;
}
.equal-division-item-1 {
  padding: 4.5px 0 8.5px;
  background-color: #ffffff;
  border-radius: 8px;
  filter: drop-shadow(0px 2px 2px rgba(64, 82, 140, 0.05));
  overflow: hidden;
  width: 80px;
  height: 62px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.image-7 {
  width: 23px;
  height: 23px;
  flex-shrink: 0;
}
.font-3 {
  font-size: 12px;
  font-family: Microsoft YaHei;
  line-height: 11.5px;
  font-weight: 700;
  color: #000000;
}
.equal-division-item {
  padding: 4.5px 0 8.5px;
  background-color: #ffffff;
  border-radius: 8px;
  filter: drop-shadow(0px 2px 2px rgba(64, 82, 140, 0.05));
  overflow: hidden;
  width: 80px;
  height: 62px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.text-10 {
  line-height: 11.5px;
}
.equal-division-item-3 {
  margin-right: 15px;
  padding: 4.5px 0 8.5px;
  background-color: #ffffff;
  border-radius: 8px;
  filter: drop-shadow(0px 2px 2px rgba(64, 82, 140, 0.05));
  overflow: hidden;
  width: 65px;
  height: 62px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.text-8 {
  line-height: 12px;
}
.image-8 {
  width: 116px;
  height: 105px;
  align-self: flex-start;
}
.section-9 {
  margin-left: 13px;
  margin-right: 19px;
  padding: 6px 11px 5px 12px;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  border: solid 0.5px #999999;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
}
.text-7 {
  line-height: 11.5px;
}
.image-9 {
  border-radius: 50%;
  width: 36px;
  height: 36px;
}

/* 添加点击效果 */
.equal-division-item-1:active,
.equal-division-item:active,
.equal-division-item-3:active,
.section-9:active {
  transform: scale(0.95);
  opacity: 0.8;
}
</style>

