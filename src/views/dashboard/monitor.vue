<template>
  <div class="ele-body ele-body-card">
    <!-- 顶部统计卡片 -->
    <a-row :gutter="16">
      <a-col :md="6" :sm="12" :xs="12">
        <a-card :bordered="false" class="monitor-count-card">
          <ele-tag
            color="blue"
            shape="circle"
            size="large">
            <eye-filled/>
          </ele-tag>
          <h1 class="monitor-count-card-num">21.2 k</h1>
          <div class="monitor-count-card-text">总访问人数</div>
          <ele-avatar-list
            :data="visitUsers"
            size="small"
            :max="4"/>
        </a-card>
      </a-col>
      <a-col :md="6" :sm="12" :xs="12">
        <a-card :bordered="false" class="monitor-count-card">
          <ele-tag
            color="orange"
            shape="circle"
            size="large">
            <fire-filled/>
          </ele-tag>
          <h1 class="monitor-count-card-num">1.6 k</h1>
          <div class="monitor-count-card-text">点击量（近30天）</div>
          <div class="monitor-count-card-trend ele-text-success">
            <up-outlined/>
            <span>110.5%</span>
          </div>
          <a-tooltip title="指标说明">
            <question-circle-outlined class="monitor-count-card-tips"/>
          </a-tooltip>
        </a-card>
      </a-col>
      <a-col :md="6" :sm="12" :xs="12">
        <a-card :bordered="false" class="monitor-count-card">
          <ele-tag
            color="red"
            shape="circle"
            size="large">
            <flag-filled/>
          </ele-tag>
          <h1 class="monitor-count-card-num">826.0</h1>
          <div class="monitor-count-card-text">到达量（近30天）</div>
          <div class="monitor-count-card-trend ele-text-danger">
            <down-outlined/>
            <span>15.5%</span>
          </div>
        </a-card>
      </a-col>
      <a-col :md="6" :sm="12" :xs="12">
        <a-card :bordered="false" class="monitor-count-card">
          <ele-tag
            color="green"
            shape="circle"
            size="large">
            <thunderbolt-filled/>
          </ele-tag>
          <h1 class="monitor-count-card-num">28.8 %</h1>
          <div class="monitor-count-card-text">转化率（近30天）</div>
          <div class="monitor-count-card-trend ele-text-success">
            <up-outlined/>
            <span>65.8%</span>
          </div>
          <a-tooltip title="指标说明">
            <question-circle-outlined class="monitor-count-card-tips"/>
          </a-tooltip>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <!-- 用户分布 -->
      <a-col :lg="18" :md="24" :sm="24" :xs="24">
        <a-card :bordered="false" title="用户分布">
          <a-row>
            <a-col :sm="18" :xs="24">
              <ele-chart
                :options="userCountMapOption"
                style="height: 485px;"/>
            </a-col>
            <a-col :sm="6" :xs="24">
              <ele-chart
                :options="userCountChartOption"
                style="height: 485px;"/>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <!-- 在线人数 -->
      <a-col :lg="6" :md="24" :sm="24" :xs="24">
        <a-row :gutter="16">
          <a-col :lg="24" :md="12" :sm="24" :xs="24">
            <a-card :bordered="false" title="在线人数">
              <div class="monitor-online-num-card">
                <div>{{ currentTime }}</div>
                <div class="monitor-online-num-title">
                  <ele-count-up
                    :end-val="228"
                    @ready="(ins) => { onlineNumAnimIns = ins; }"/>
                </div>
                <div class="monitor-online-num-text">在线总人数</div>
                <a-badge status="processing" :text="updateTimeText"/>
              </div>
            </a-card>
          </a-col>
          <a-col :lg="24" :md="12" :sm="24" :xs="24">
            <a-card
              :bordered="false"
              title="浏览器分布"
              :body-style="{padding: '6px 0'}">
              <ele-chart
                :options="browserChartOption"
                style="height: 240px;"/>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
      <!-- 用户评价 -->
      <a-col :lg="12" :md="24" :sm="24" :xs="24">
        <a-card :bordered="false" title="用户评价">
          <div class="ele-cell ele-cell-align-bottom">
            <div style="font-size: 51px;line-height: 1;">4.5</div>
            <div class="ele-cell-content">
              <a-rate :value="userRate" disabled/>
              <span style="color: #fadb14;margin-left: 8px;">很棒</span>
            </div>
          </div>
          <div class="ele-cell" style="margin: 18px 0;">
            <div style="font-size: 28px;line-height: 1;" class="ele-text-placeholder">-0%</div>
            <div class="ele-cell-content ele-text-small ele-text-secondary">当前没有评价波动</div>
          </div>
          <div class="ele-cell">
            <div class="ele-cell-content">
              <a-progress
                :percent="60"
                stroke-color="#52c41a"
                :show-info="false"/>
            </div>
            <div class="monitor-evaluate-text">
              <star-filled/>
              <span>5 : 368 人</span>
            </div>
          </div>
          <div class="ele-cell">
            <div class="ele-cell-content">
              <a-progress
                :percent="40"
                stroke-color="#1890ff"
                :show-info="false"/>
            </div>
            <div class="monitor-evaluate-text">
              <star-filled/>
              <span>4 : 256 人</span>
            </div>
          </div>
          <div class="ele-cell">
            <div class="ele-cell-content">
              <a-progress
                :percent="20"
                stroke-color="#faad14"
                :show-info="false"/>
            </div>
            <div class="monitor-evaluate-text">
              <star-filled/>
              <span>3 : 49 人</span>
            </div>
          </div>
          <div class="ele-cell">
            <div class="ele-cell-content">
              <a-progress
                :percent="10"
                stroke-color="#f5222d"
                :show-info="false"/>
            </div>
            <div class="monitor-evaluate-text">
              <star-filled/>
              <span>2 : 14 人</span>
            </div>
          </div>
          <div class="ele-cell">
            <div class="ele-cell-content">
              <a-progress
                :percent="0"
                :show-info="false"/>
            </div>
            <div class="monitor-evaluate-text">
              <star-filled/>
              <span>1 : 0 人</span>
            </div>
          </div>
        </a-card>
      </a-col>
      <!-- 用户满意度 -->
      <a-col :lg="6" :md="12" :sm="24" :xs="24">
        <a-card :bordered="false" title="用户满意度">
          <div class="ele-cell ele-text-center">
            <div class="ele-cell-content" style="font-size: 24px;">856</div>
            <div class="ele-cell-content">
              <div class="monitor-face-smile"><i></i></div>
              <div class="ele-text-secondary" style="margin-top: 8px;">正面评论</div>
            </div>
            <h2 class="ele-cell-content ele-text-success">82%</h2>
          </div>
          <a-divider style="margin: 26px 0;"/>
          <div class="ele-cell ele-text-center">
            <div class="ele-cell-content" style="font-size: 24px;">60</div>
            <div class="ele-cell-content">
              <div class="monitor-face-cry"><i></i></div>
              <div class="ele-text-secondary" style="margin-top: 8px;">负面评论</div>
            </div>
            <h2 class="ele-cell-content ele-text-danger">9%</h2>
          </div>
        </a-card>
      </a-col>
      <!-- 用户活跃度 -->
      <a-col :lg="6" :md="12" :sm="24" :xs="24">
        <a-card :bordered="false" title="用户活跃度">
          <div class="ele-cell" style="padding: 32px 0;">
            <div class="ele-cell-content ele-text-center">
              <div class="monitor-progress-group">
                <a-progress
                  type="circle"
                  :percent="70"
                  stroke-color="#52c41a"
                  :show-info="false"
                  :width="161"/>
                <a-progress
                  type="circle"
                  :percent="60"
                  stroke-color="#1890ff"
                  :show-info="false"
                  :width="121"
                  :stroke-width="5"/>
                <a-progress
                  type="circle"
                  :percent="35"
                  stroke-color="#f5222d"
                  :show-info="false"
                  :width="91"
                  :stroke-width="4"/>
              </div>
            </div>
            <div class="monitor-progress-legends">
              <div class="ele-text-small">
                <a-badge color="green" text="活跃率: 70%"/>
              </div>
              <div class="ele-text-small">
                <a-badge color="blue" text="留存率: 60%"/>
              </div>
              <div class="ele-text-small">
                <a-badge color="red" text="跳出率: 35%"/>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import EleCountUp from 'ele-admin-pro/packages/ele-count-up';
import EleChart from 'ele-admin-pro/packages/ele-chart';
import {
  QuestionCircleOutlined,
  EyeFilled,
  FireFilled,
  FlagFilled,
  ThunderboltFilled,
  UpOutlined,
  DownOutlined,
  StarFilled
} from '@ant-design/icons-vue';

export default {
  name: 'DashboardMonitor',
  components: {
    EleCountUp,
    EleChart,
    QuestionCircleOutlined,
    EyeFilled,
    FireFilled,
    FlagFilled,
    ThunderboltFilled,
    UpOutlined,
    DownOutlined,
    StarFilled
  },
  data() {
    return {
      // 访问人数头像列表数据
      visitUsers: [
        {
          name: 'SunSmile',
          avatar: 'https://cdn.eleadmin.com/20200609/c184eef391ae48dba87e3057e70238fb.jpg'
        },
        {
          name: '你的名字很好听',
          avatar: 'https://cdn.eleadmin.com/20200609/b6a811873e704db49db994053a5019b2.jpg'
        },
        {
          name: '全村人的希望',
          avatar: 'https://cdn.eleadmin.com/20200609/948344a2a77c47a7a7b332fe12ff749a.jpg'
        },
        {
          name: 'Jasmine',
          avatar: 'https://cdn.eleadmin.com/20200609/f6bc05af944a4f738b54128717952107.jpg'
        },
        {
          name: '酷酷的大叔',
          avatar: 'https://cdn.eleadmin.com/20200609/2d98970a51b34b6b859339c96b240dcd.jpg'
        }
      ],
      // 在线总人数倒计时
      updateTime: 5,
      // 中国地图轮廓数据
      chinaMapData: null,
      // 用户分布数据
      userCountData: [],
      // 当前时间
      currentTime: '20:58:22',
      // 在线人数动画数字组件实例
      onlineNumAnimIns: null,
      // 在线人数更新定时器
      onlineNumTimer: null,
      // 浏览器分布环形图数据
      browserCountData: [],
      // 用户评分
      userRate: 4.5
    };
  },
  computed: {
    // 在线人数倒计时文字
    updateTimeText() {
      return this.updateTime + ' 秒后更新';
    },
    // 用户分布地图配置
    userCountMapOption() {
      if (!this.chinaMapData) {
        return null;
      }
      let data = this.userCountData.map(d => d.value).sort((a, b) => (a - b));
      return {
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          min: data[data.length - 1] || 0,
          max: data[0] || 0,
          text: ['高', '低'],
          calculable: true,
          color: ['#1890FF', '#EBF3FF']
        },
        series: [
          {
            name: '用户数',
            type: 'map',
            mapType: 'china',
            label: {show: true},
            data: this.userCountData
          }
        ]
      };
    },
    // 用户分布柱状图配置
    userCountChartOption() {
      let data = this.userCountData.filter(d => d.value > 0).sort((a, b) => {
        return a.value - b.value;
      });
      return {
        tooltip: {
          trigger: 'axis',
          formatter: '<i class="ele-chart-dot" style="background-color:#3aa1ff;"></i>{b0}: {c0}'
        },
        grid: {
          top: 0,
          bottom: 0,
          left: 50,
          right: 0
        },
        yAxis: [
          {
            type: 'category',
            axisLine: {show: false},
            axisTick: {show: false},
            data: data.map(d => d.name)
          }
        ],
        xAxis: [
          {
            show: false,
            type: 'value',
            splitLine: {show: false}
          }
        ],
        series: [
          {
            type: 'bar',
            data: data.map(d => d.value)
          }
        ]
      };
    },
    // 浏览器分布饼图配置
    browserChartOption() {
      return {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          data: this.browserCountData.map(d => d.name),
          bottom: 5,
          itemWidth: 10,
          itemHeight: 10,
          icon: 'circle'
        },
        series: [
          {
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['50%', '43%'],
            label: {show: false},
            data: this.browserCountData
          }
        ]
      };
    }
  },
  mounted() {
    this.doUpdateOnlineNum();
    this.getChinaMapData();
    this.getUserCountData();
    this.getBrowserCountData();
  },
  methods: {
    /* 在线人数更新倒计时 */
    doUpdateOnlineNum() {
      this.currentTime = this.$util.toDateString(new Date(), 'HH:mm:ss');
      this.onlineNumTimer = setInterval(() => {
        this.currentTime = this.$util.toDateString(new Date(), 'HH:mm:ss');
        if (this.updateTime === 1) {
          this.updateTime = 5;
          if (this.onlineNumAnimIns) {
            this.onlineNumAnimIns.update(100 + Math.round(Math.random() * 900));
          }
        } else {
          this.updateTime--;
        }
      }, 1000);
    },
    /* 获取中国地图数据并注册地图 */
    getChinaMapData() {
      this.$http.get('https://cdn.eleadmin.com/20200610/china-provinces.geo.json').then(res => {
        EleChart.registerMap('china', res.data);
        this.chinaMapData = res.data;
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 获取用户分布数据 */
    getUserCountData() {
      this.userCountData = [
        {name: "贵州", value: 570},
        {name: "云南", value: 8890},
        {name: "重庆", value: 10010},
        {name: "吉林", value: 5056},
        {name: "山西", value: 2123},
        {name: "天津", value: 9130},
        {name: "江西", value: 10170},
        {name: "广西", value: 6172},
        {name: "陕西", value: 9251},
        {name: "黑龙江", value: 5125},
        {name: "安徽", value: 9530},
        {name: "北京", value: 51919},
        {name: "福建", value: 3756},
        {name: "上海", value: 59190},
        {name: "湖北", value: 37109},
        {name: "湖南", value: 8966},
        {name: "四川", value: 31020},
        {name: "辽宁", value: 7222},
        {name: "河北", value: 3451},
        {name: "河南", value: 9693},
        {name: "浙江", value: 62310},
        {name: "山东", value: 39231},
        {name: "江苏", value: 35911},
        {name: "广东", value: 55891}
      ];
    },
    /* 获取用户浏览器分布数据 */
    getBrowserCountData() {
      this.browserCountData = [
        {name: 'Chrome', value: 9052},
        {name: 'Safari', value: 535},
        {name: 'Firefox', value: 1610},
        {name: 'Edge', value: 2800},
        {name: 'IE', value: 3200},
        {name: 'Other', value: 1700}
      ];
    }
  },
  beforeUnmount() {
    // 销毁定时器
    if (this.onlineNumTimer) {
      clearInterval(this.onlineNumTimer);
    }
  }
}
</script>

<style scoped>
/* 统计卡片 */
.monitor-count-card {
  text-align: center;
}

.monitor-count-card .monitor-count-card-num {
  margin-top: 6px;
  font-size: 32px;
}

.monitor-count-card .monitor-count-card-text {
  font-size: 12px;
  margin: 8px 0;
  opacity: .8;
}

.monitor-count-card .monitor-count-card-trend {
  font-weight: bold;
  line-height: 26px;
}

.monitor-count-card .monitor-count-card-trend > .anticon {
  margin-right: 6px;
}

.monitor-count-card .monitor-count-card-tips {
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  opacity: .6;
}

/* 当前在线人数卡片 */
.monitor-online-num-card {
  text-align: center;
}

.monitor-online-num-text {
  margin-bottom: 6px;
}

.monitor-online-num-title {
  font-size: 48px;
  margin-bottom: 13px;
}

@media screen and (max-width: 992px) {
  .monitor-online-num-card {
    padding: 22px 0;
  }
}

/* 用户评价 */
.monitor-evaluate-text {
  width: 90px;
  flex-shrink: 0;
  white-space: nowrap;
  opacity: .8;
}

.monitor-evaluate-text > .anticon {
  font-size: 12px;
  margin: 0 6px 0 8px;
}

/* 笑脸、哭脸 */
.monitor-face-smile, .monitor-face-cry {
  width: 50px;
  height: 50px;
  display: inline-block;
  background: #FBD971;
  border-radius: 50%;
  position: relative;
}

.monitor-face-smile > i, .monitor-face-smile:before, .monitor-face-smile:after,
.monitor-face-cry > i, .monitor-face-cry:before, .monitor-face-cry:after {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transform: rotate(225deg);
  border: 3px solid #F0C419;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  position: absolute;
  bottom: 8px;
  left: 11px;
}

.monitor-face-smile:before, .monitor-face-smile:after,
.monitor-face-cry:before, .monitor-face-cry:after {
  content: "";
  width: 12px;
  height: 12px;
  left: 8px;
  top: 14px;
  border-color: #F29C1F;
  transform: rotate(45deg);
}

.monitor-face-smile:after, .monitor-face-cry:after {
  left: auto;
  right: 8px;
}

.monitor-face-cry > i {
  transform: rotate(45deg);
  bottom: -6px;
}

/** 圆形进度条组合 */
.monitor-progress-group {
  position: relative;
  display: inline-block;
}

.monitor-progress-group .ant-progress:not(:first-child) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: -1px;
}

.monitor-progress-legends > div + div {
  margin-top: 8px;
}
</style>
