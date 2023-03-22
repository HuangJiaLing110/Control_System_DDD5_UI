<template>
  <div class="ele-body ele-body-card">
    <a-row :gutter="16">
      <a-col :lg="12" :md="24" :sm="24" :xs="24">
        <a-card title="基础演示" :bordered="false">
          <!-- 操作按钮 -->
          <a-space style="margin-bottom: 16px;">
            <a-button
              type="primary"
              :disabled="!ready1"
              @click="play">播放
            </a-button>
            <a-button
              type="primary"
              :disabled="!ready1"
              @click="pause">暂停
            </a-button>
            <a-button
              type="primary"
              :disabled="!ready1"
              @click="replay">重新播放
            </a-button>
            <a-button
              type="primary"
              :disabled="!ready1"
              @click="changeSrc">切换视频源
            </a-button>
          </a-space>
          <!-- 播放器 -->
          <xgplayer
            :config="config1"
            @player="onPlayer1"/>
        </a-card>
      </a-col>
      <a-col :lg="12" :md="24" :sm="24" :xs="24">
        <a-card title="显示弹幕" :bordered="false">
          <!-- 操作按钮 -->
          <a-space style="margin-bottom: 16px;">
            <a-input
              style="width: 160px;"
              v-model:value="dmText"
              placeholder="请输入弹幕内容"
              :disabled="!ready2"/>
            <a-button
              type="primary"
              :disabled="!ready2"
              @click="shoot">发射
            </a-button>
          </a-space>
          <!-- 播放器 -->
          <xgplayer
            :config="config2"
            @player="onPlayer2"/>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Xgplayer from 'xgplayer-vue';

export default {
  name: 'ExtensionPlayer',
  components: {Xgplayer},
  data() {
    return {
      // 视频播放器一配置
      config1: {
        id: 'demoPlayer1',
        lang: 'zh-cn',
        fluid: true,
        // 视频地址
        url: 'https://s1.pstatp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4',
        // 封面
        poster: 'https://imgcache.qq.com/open_proj/proj_qcloud_v2/gateway/solution/general-video/css/img/scene/1.png',
        // 开启倍速播放
        playbackRate: [0.5, 1, 1.5, 2],
        // 开启画中画
        pip: true
      },
      // 视频播放器一实例
      player1: null,
      // 视频播放器一是否实例化完成
      ready1: false,
      // 视频播放器二配置
      config2: {
        id: 'demoPlayer2',
        lang: 'zh-cn',
        fluid: true,
        url: 'https://blz-videos.nosdn.127.net/1/OverWatch/AnimatedShots/Overwatch_TheatricalTeaser_WeAreOverwatch_zhCN.mp4',
        poster: 'https://imgcache.qq.com/open_proj/proj_qcloud_v2/gateway/solution/general-video/css/img/scene/1.png',
        danmu: {
          comments: [
            {
              id: '1',
              start: 0,
              txt: '空降',
              duration: 15000,
              color: true,
              style: {
                color: '#ffcd08',
                fontSize: '20px'
              }
            },
            {
              id: '2',
              start: 1500,
              txt: '前方高能',
              duration: 15000,
              color: true,
              style: {
                color: '#ffcd08',
                fontSize: '20px'
              }
            },
            {
              id: '3',
              start: 3500,
              txt: '弹幕护体',
              duration: 15000,
              color: true,
              style: {
                color: '#ffcd08',
                fontSize: '20px'
              }
            },
            {
              id: '4',
              start: 4500,
              txt: '弹幕护体',
              duration: 15000,
              color: true,
              style: {
                color: '#ffcd08',
                fontSize: '20px'
              }
            },
            {
              id: '5',
              start: 6000,
              txt: '前方高能',
              duration: 15000,
              color: true,
              style: {
                color: '#ffcd08',
                fontSize: '20px'
              }
            },
            {
              id: '6',
              start: 8500,
              txt: '弹幕护体',
              duration: 15000,
              color: true,
              style: {
                color: '#ffcd08',
                fontSize: '20px'
              }
            },
            {
              id: '7',
              start: 10000,
              txt: '666666666',
              duration: 15000,
              color: true,
              style: {
                color: '#ffcd08',
                fontSize: '20px'
              }
            },
            {
              id: '8',
              start: 12500,
              txt: '前方高能',
              duration: 15000,
              color: true,
              style: {
                color: '#ffcd08',
                fontSize: '20px'
              }
            },
            {
              id: '9',
              start: 15500,
              txt: '666666666',
              duration: 15000,
              color: true,
              style: {
                color: '#ffcd08',
                fontSize: '20px'
              }
            },
            {
              id: '10',
              start: 16500,
              txt: '666666666',
              duration: 15000,
              color: true,
              style: {
                color: '#ffcd08',
                fontSize: '20px'
              }
            },
            {
              id: '11',
              start: 18000,
              txt: '关弹幕，保智商',
              duration: 15000,
              color: true,
              style: {
                color: '#ffcd08',
                fontSize: '20px'
              }
            },
            {
              id: '12',
              start: 20500,
              txt: '关弹幕，保智商',
              duration: 15000,
              color: true,
              style: {
                color: '#ffcd08',
                fontSize: '20px'
              }
            },
            {
              id: '13',
              start: 22000,
              txt: '666666666',
              duration: 15000,
              color: true,
              style: {
                color: '#ffcd08',
                fontSize: '20px'
              }
            },
            {
              id: '14',
              start: 25500,
              txt: '666666666',
              duration: 15000,
              color: true,
              style: {
                color: '#ffcd08',
                fontSize: '20px'
              }
            },
            {
              id: '15',
              start: 26000,
              txt: '前方高能',
              duration: 15000,
              color: true,
              style: {
                color: '#ffcd08',
                fontSize: '20px'
              }
            }
          ]
        }
      },
      // 视频播放器二实例
      player2: null,
      // 视频播放器二是否实例化完成
      ready2: false,
      // 弹幕输入内容
      dmText: ''
    };
  },
  methods: {
    /* 播放器一渲染完成 */
    onPlayer1(e) {
      this.player1 = e;
      this.player1.on('play', () => {
        this.ready1 = true;
      });
    },
    /* 播放 */
    play() {
      if (this.player1.paused) {
        this.player1.play();
      }
    },
    /* 暂停 */
    pause() {
      if (!this.player1.paused) {
        this.player1.pause();
      }
    },
    /* 重新播放 */
    replay() {
      this.player1.replay();
    },
    /* 切换视频源 */
    changeSrc() {
      this.player1.src = 'https://blz-videos.nosdn.127.net/1/OverWatch/AnimatedShots/Overwatch_TheatricalTeaser_WeAreOverwatch_zhCN.mp4';
      if (this.player1.paused) {
        this.player1.play();
      }
    },
    /* 播放器二渲染完成 */
    onPlayer2(e) {
      this.player2 = e;
      this.player2.on('play', () => {
        this.ready2 = true;
      });
    },
    /* 发射弹幕 */
    shoot() {
      if (!this.dmText) {
        this.$message.error('请输入弹幕内容');
        return;
      }
      this.player2.danmu.sendComment({
        id: new Date().getTime(),
        duration: 15000,
        color: true,
        start: this.player2.currentTime * 1000,
        txt: this.dmText,
        style: {
          color: '#fa1f41',
          fontSize: '20px',
          border: 'solid 1px #fa1f41'
        }
      });
      this.dmText = '';
    }
  }
}
</script>

<style scoped>
</style>
