<script setup>
  import { useRouter } from 'vue-router';
  import { reactive, onMounted } from 'vue';

  const props = defineProps({});

  const data = reactive({});

  const router = useRouter();
</script>

<template>
  <div class="flex-col justify-start page">
    <div class="flex-col justify-start relative group_2">
      <div class="flex-col justify-start relative section_3">
        <div class="section_4"></div>
        <img
          class="image_6 pos_4"
          src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=a42d2134ffc73f3ae5cec6f682562622.png"
        />
      </div>
      <div class="flex-row section pos">
        <div class="flex-col items-start shrink-0 self-start group_3">
          <span class="font text_2">🌟目标</span>
          <span class="font text_4 mt-23">成功跑路上岸</span>
        </div>
        <div class="flex-row flex-1 ml-49">
          <div class="flex-col items-center shrink-0 self-start group_4">
            <span class="font_2 text_3">已坚持天数</span>
            <span class="font text_5 mt-24">15天</span>
          </div>
          <div class="flex-col justify-start items-center flex-1 relative section_2 ml-23">
            <div class="section_5"></div>
            <img
              class="image_5 pos_3"
              src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=87669546fa18210efa98b0e6d3f6b5e8.png"
            />
            <img
              class="image_4 pos_2"
              src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=68d8252965b7384f060faedacef28367.png"
            />
          </div>
        </div>
      </div>
      <div class="flex-col section_6 pos_5">
        <div class="flex-col group_5">
          <div class="flex-col items-start self-stretch section_7">
            <span class="font text_1">Hi 我是DouDou</span>
            <span class="font_2 text_6 mt-13">我可以为你制定任务、陪你聊天、帮你提效</span>
          </div>
          <div class="flex-row justify-between equal-division group_1 mt-16">
            <div class="flex-col items-center equal-division-item_1">
              <img
                class="shrink-0 image_7"
                src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=a67fe6e4354cfee0874fc38dd6baa9d5.png"
              />
              <span class="font_3 mt-14">领取任务</span>
            </div>
            <div class="flex-col items-center equal-division-item">
              <img
                class="shrink-0 image_7"
                src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=660902b3aea9c710a6687b5dace09abf.png"
              />
              <span class="font_3 text_10 mt-14">聊聊谈</span>
            </div>
            <div class="flex-col items-center equal-division-item_3 section_8">
              <img
                class="shrink-0 image_7"
                src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=f406b4daa9e365de69c09a1bdcda9246.png"
              />
              <span class="font_3 text_8 mt-14">提高效率</span>
            </div>
          </div>
        </div>
        <div class="flex-col mt-190">
          <img
            class="self-start image_8"
            src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=5e6ced7910852a7f71fa6cf70e86dbe7.png"
          />
          <div class="flex-row justify-between items-center self-stretch section_9">
            <span class="font_2 text_7">和doudou聊一下吧</span>
            <img
              class="image_9"
              src="https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=4205b31831d578227aed4ef2e0d1a69b.png"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
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
    height: 100%;
  }
  .group_2 {
    padding: 13px 0 33.5px;
  }
  .section_3 {
    background-image: url('https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=89dd8e072752bb2369f802cdb39294f2.png');
    background-position: 0% 0%;
    background-size: 360px 619.5px;
    background-repeat: no-repeat;
  }
  .section_4 {
    background-image: url('https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=89dd8e072752bb2369f802cdb39294f2.png');
    background-position: 0% 0%;
    background-size: 360px 619.5px;
    background-repeat: no-repeat;
    height: 619.5px;
  }
  .image_6 {
    width: 101px;
    height: 99px;
  }
  .pos_4 {
    position: absolute;
    right: 10.5px;
    top: 8px;
  }
  .section {
    padding: 1px 0 10px 20px;
    background-color: #fee399;
    border-radius: 16px;
    box-shadow: 0px 4px 0px #ffc072;
  }
  .pos {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }
  .group_3 {
    margin-top: 19px;
  }
  .font {
    font-size: 16px;
    font-family: Microsoft YaHei;
    line-height: 15.5px;
    font-weight: 700;
    color: #333333;
  }
  .text_2 {
    line-height: 17px;
    font-weight: unset;
  }
  .text_4 {
    line-height: 15.5px;
  }
  .group_4 {
    margin-top: 24px;
  }
  .font_2 {
    font-size: 12px;
    font-family: Microsoft YaHei;
    line-height: 11.5px;
    color: #333333;
  }
  .text_3 {
    line-height: 11.5px;
  }
  .text_5 {
    line-height: 14.5px;
  }
  .section_2 {
    padding: 20.5px 0 8.5px;
    background-image: url('https://ide.code.fun/api/image?token=68a1e48f2b7b7600119d1a96&name=b22ad39c160c14b9759703d57a3c615b.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    height: 109px;
  }
  .section_5 {
    background-color: #00000000;
    width: 80px;
    height: 80px;
  }
  .image_5 {
    width: 92px;
    height: 92px;
  }
  .pos_3 {
    position: absolute;
    left: 50%;
    bottom: 2px;
    transform: translateX(-50%);
  }
  .image_4 {
    border-radius: 44px;
    width: 56px;
    height: 59px;
  }
  .pos_2 {
    position: absolute;
    left: 50%;
    top: 1.5px;
    transform: translateX(-50%);
  }
  .section_6 {
    padding: 29px 0 32px;
    background-image: linear-gradient(180deg, #eef1f61a 0%, #c1e0f6 100%);
    border-radius: 16px 16px 0px 0px;
    backdrop-filter: blur(2px);
  }
  .pos_5 {
    position: absolute;
    left: 0;
    right: 0;
    top: 120px;
  }
  .group_5 {
    padding: 0 13px;
  }
  .section_7 {
    margin-right: 6px;
    padding: 11.5px 12px 12.5px;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
  }
  .text_1 {
    margin-left: 1.5px;
  }
  .text_6 {
    line-height: 12px;
    opacity: 0.5;
  }
  .equal-division {
    align-self: flex-start;
  }
  .group_1 {
    width: 280px;
  }
  .equal-division-item_1 {
    padding: 4.5px 0 8.5px;
    background-color: #ffffff;
    border-radius: 8px;
    filter: drop-shadow(0px 2px 2px #40528c0d);
    overflow: hidden;
    width: 80px;
    height: 62px;
  }
  .image_7 {
    width: 23px;
    height: 23px;
  }
  .font_3 {
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
    filter: drop-shadow(0px 2px 2px #40528c0d);
    overflow: hidden;
    width: 80px;
    height: 62px;
  }
  .text_10 {
    line-height: 11.5px;
  }
  .equal-division-item_3 {
    margin-right: 15px;
  }
  .section_8 {
    padding: 4.5px 0 8.5px;
    background-color: #ffffff;
    border-radius: 8px;
    filter: drop-shadow(0px 2px 2px #40528c0d);
    overflow: hidden;
    width: 65px;
    height: 62px;
  }
  .text_8 {
    line-height: 12px;
  }
  .image_8 {
    width: 116px;
    height: 105px;
  }
  .section_9 {
    margin-left: 13px;
    margin-right: 19px;
    padding: 6px 11px 5px 12px;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    border: solid 0.5px #999999;
  }
  .text_7 {
    line-height: 11.5px;
  }
  .image_9 {
    border-radius: 50%;
    width: 36px;
    height: 36px;
  }
</style>