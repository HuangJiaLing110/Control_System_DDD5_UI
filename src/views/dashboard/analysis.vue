<template>
  <div class="ele-body ele-body-card">
    <!-- 顶部统计快 -->
    <a-row :gutter="16">
      <a-col :lg="6" :md="12" :sm="24" :xs="24">
        <a-card class="analysis-chart-card" :bordered="false">
          <div class="ele-text-secondary ele-cell">
            <div class="ele-cell-content">总销售额</div>
            <a-tooltip title="指标说明">
              <question-circle-outlined/>
            </a-tooltip>
          </div>
          <h1 class="analysis-chart-card-num">¥ 126,560</h1>
          <div class="analysis-chart-card-content" style="padding-top: 16px;">
            <a-space size="middle">
              <span>周同比12% <caret-up-outlined class="ele-text-danger"/></span>
              <span>日同比11% <caret-down-outlined class="ele-text-success"/></span>
            </a-space>
          </div>
          <a-divider/>
          <div>日销售额 ￥12,423</div>
        </a-card>
      </a-col>
      <a-col :lg="6" :md="12" :sm="24" :xs="24">
        <a-card class="analysis-chart-card" :bordered="false">
          <div class="ele-text-secondary ele-cell">
            <div class="ele-cell-content">访问量</div>
            <ele-tag color="red">日</ele-tag>
          </div>
          <h1 class="analysis-chart-card-num">8,846</h1>
          <ele-chart :options="visitChartOption" class="analysis-chart-card-content"/>
          <a-divider/>
          <div>日访问量 1,234</div>
        </a-card>
      </a-col>
      <a-col :lg="6" :md="12" :sm="24" :xs="24">
        <a-card class="analysis-chart-card" :bordered="false">
          <div class="ele-text-secondary ele-cell">
            <div class="ele-cell-content">支付笔数</div>
            <ele-tag color="blue">月</ele-tag>
          </div>
          <h1 class="analysis-chart-card-num">6,560</h1>
          <ele-chart :options="payNumChartOption" class="analysis-chart-card-content"/>
          <a-divider/>
          <div>转化率 60%</div>
        </a-card>
      </a-col>
      <a-col :lg="6" :md="12" :sm="24" :xs="24">
        <a-card class="analysis-chart-card" :bordered="false">
          <div class="ele-text-secondary ele-cell">
            <div class="ele-cell-content">活动运营效果</div>
            <ele-tag color="green">周</ele-tag>
          </div>
          <h1 class="analysis-chart-card-num">78%</h1>
          <div class="analysis-chart-card-content" style="padding-top: 16px;">
            <a-progress
              :percent="78"
              :show-info="false"
              stroke-color="#13c2c2"/>
          </div>
          <a-divider/>
          <a-space size="middle">
            <span>周同比12% <caret-up-outlined class="ele-text-danger"/></span>
            <span>日同比11% <caret-down-outlined class="ele-text-success"/></span>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
    <!-- 销售额、访问量 -->
    <a-card :bordered="false" :body-style="{padding: 0}">
      <a-tabs size="large" class="monitor-card-tabs">
        <a-tab-pane tab="销售额" key="saleroom">
          <a-row :gutter="16">
            <a-col :lg="17" :md="16" :sm="24" :xs="24">
              <div class="demo-monitor-title">销售量趋势</div>
              <ele-chart :options="saleChartOption" style="height: 320px;"/>
            </a-col>
            <a-col :lg="7" :md="8" :sm="24" :xs="24">
              <div class="demo-monitor-title">门店销售额排名</div>
              <div
                v-for="(item,index) in saleroomRankData"
                :key="index"
                class="demo-monitor-rank-item ele-cell">
                <ele-tag
                  shape="circle"
                  :color="index<3?'#314659':''"
                  style="border: none;">{{ index + 1 }}
                </ele-tag>
                <div class="ele-cell-content">{{ item.name }}</div>
                <div class="ele-text-secondary">{{ item.value }}</div>
              </div>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane tab="访问量" key="visits" force-render>
          <a-row :gutter="16">
            <a-col :lg="17" :md="16" :sm="24" :xs="24">
              <div class="demo-monitor-title">访问量趋势</div>
              <ele-chart :options="visitsChartOption" style="height: 320px;"/>
            </a-col>
            <a-col :lg="7" :md="8" :sm="24" :xs="24">
              <div class="demo-monitor-title">门店访问量排名</div>
              <div
                v-for="(item,index) in visitsRankData"
                :key="index"
                class="demo-monitor-rank-item ele-cell">
                <ele-tag
                  shape="circle"
                  :color="index<3?'#314659':''"
                  style="border: none;">{{ index + 1 }}
                </ele-tag>
                <div class="ele-cell-content">{{ item.name }}</div>
                <div class="ele-text-secondary">{{ item.value }}</div>
              </div>
            </a-col>
          </a-row>
        </a-tab-pane>
        <template #tabBarExtraContent>
          <a-space size="middle" class="analysis-tabs-extra">
            <a-radio-group v-model:value="saleSearch.dateType">
              <a-radio-button value="1">今天</a-radio-button>
              <a-radio-button value="2">本周</a-radio-button>
              <a-radio-button value="3">本月</a-radio-button>
              <a-radio-button value="4">本年</a-radio-button>
            </a-radio-group>
            <a-range-picker v-model:value="saleSearch.datetime">
              <template #suffixIcon>
                <calendar-outlined/>
              </template>
            </a-range-picker>
          </a-space>
        </template>
      </a-tabs>
    </a-card>
    <!-- 折线图、词云 -->
    <a-row :gutter="16">
      <a-col :lg="16" :md="14" :sm="24" :xs="24">
        <a-card
          :bordered="false"
          title="最近1小时访问情况"
          :body-style="{padding: '16px 6px 0 0'}">
          <ele-chart
            :options="visitHourChartOption"
            style="height: 362px;"/>
        </a-card>
      </a-col>
      <a-col :lg="8" :md="10" :sm="24" :xs="24">
        <a-card :bordered="false" title="热门搜索">
          <ele-word-cloud
            :data="hotSearchData"
            style="height: 330px;"/>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import EleChart from 'ele-admin-pro/packages/ele-chart';
import EleWordCloud from 'ele-admin-pro/packages/ele-word-cloud';
import {
  QuestionCircleOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  CalendarOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'DashboardAnalysis',
  components: {
    EleChart,
    EleWordCloud,
    QuestionCircleOutlined,
    CaretUpOutlined,
    CaretDownOutlined,
    CalendarOutlined
  },
  data() {
    return {
      // 支付笔数数据
      payNumData: [],
      // 销售量搜索参数
      saleSearch: {
        dateType: '4',
        datetime: []
      },
      // 销售量数据
      saleroomData: [],
      // 销售量排名数据
      saleroomRankData: [],
      // 访问量数据
      visitsData: [],
      // 访问量排名数据
      visitsRankData: [],
      // 最近1小时访问情况数据
      visitHourData: [],
      // 词云数据
      hotSearchData: []
    };
  },
  computed: {
    // 访问量折线图配置
    visitChartOption() {
      if (!this.payNumData.length) {
        return null;
      }
      return {
        color: '#975fe5',
        tooltip: {
          trigger: 'axis',
          formatter: '<i class="ele-chart-dot" style="background: #975fe5;"></i>{b0}: {c0}'
        },
        grid: {
          top: 10,
          bottom: 0,
          left: 0,
          right: 0
        },
        xAxis: [
          {
            show: false,
            type: 'category',
            boundaryGap: false,
            data: this.payNumData.map(d => d.date)
          }
        ],
        yAxis: [
          {
            show: false,
            type: 'value',
            splitLine: {show: false}
          }
        ],
        series: [
          {
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {opacity: 0.5},
            data: this.payNumData.map(d => d.value)
          }
        ]
      };
    },
    // 支付笔数柱状图配置
    payNumChartOption() {
      return {
        tooltip: {
          trigger: 'axis',
          formatter: '<i class="ele-chart-dot" style="background: #3aa1ff;"></i>{b0}: {c0}'
        },
        grid: {
          top: 10,
          bottom: 0,
          left: 0,
          right: 0
        },
        xAxis: [
          {
            show: false,
            type: 'category',
            data: this.payNumData.map(d => d.date)
          }
        ],
        yAxis: [
          {
            show: false,
            type: 'value',
            splitLine: {show: false}
          }
        ],
        series: [
          {
            type: 'bar',
            data: this.payNumData.map(d => d.value)
          }
        ]
      }
    },
    // 销售额柱状图配置
    saleChartOption() {
      return {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            type: 'category',
            data: this.saleroomData.map(d => d.month)
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            type: 'bar',
            data: this.saleroomData.map(d => d.value)
          }
        ]
      };
    },
    // 访问量柱状图配置
    visitsChartOption() {
      return {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            type: 'category',
            data: this.visitsData.map(d => d.month)
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            type: 'bar',
            data: this.visitsData.map(d => d.value)
          }
        ]
      };
    },
    // 最近1小时访问情况折线图配置
    visitHourChartOption() {
      if (!this.visitHourData.length) {
        return null;
      }
      return {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['浏览量', '访问量'],
          right: 20
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.visitHourData.map(d => d.time)
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '浏览量',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {opacity: 0.5},
            data: this.visitHourData.map(d => d.views)
          },
          {
            name: '访问量',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {opacity: 0.5},
            data: this.visitHourData.map(d => d.visits)
          }
        ]
      }
    }
  },
  mounted() {
    this.getPayNumData();
    this.getSaleroomData();
    this.getVisitHourData();
    this.getWordCloudData();
  },
  methods: {
    /* 获取支付笔数数据 */
    getPayNumData() {
      this.payNumData = [
        {date: '2020-06-12', value: 7},
        {date: '2020-06-13', value: 5},
        {date: '2020-06-14', value: 4},
        {date: '2020-06-15', value: 2},
        {date: '2020-06-16', value: 4},
        {date: '2020-06-17', value: 7},
        {date: '2020-06-18', value: 5},
        {date: '2020-06-19', value: 6},
        {date: '2020-06-20', value: 5},
        {date: '2020-06-21', value: 9},
        {date: '2020-06-22', value: 6},
        {date: '2020-06-23', value: 3},
        {date: '2020-06-24', value: 1},
        {date: '2020-06-25', value: 5},
        {date: '2020-06-26', value: 3},
        {date: '2020-06-27', value: 6},
        {date: '2020-06-18', value: 5}
      ];
    },
    /* 获取销售量数据 */
    getSaleroomData() {
      // 销售量
      this.saleroomData = [
        {month: '1月', value: 816},
        {month: '2月', value: 542},
        {month: '3月', value: 914},
        {month: '4月', value: 781},
        {month: '5月', value: 355},
        {month: '6月', value: 796},
        {month: '7月', value: 714},
        {month: '8月', value: 1195},
        {month: '9月', value: 1055},
        {month: '10月', value: 271},
        {month: '11月', value: 384},
        {month: '12月', value: 1098}
      ];
      this.saleroomRankData = [
        {name: '工专路 1 号店', value: '323,234'},
        {name: '工专路 2 号店', value: '323,234'},
        {name: '工专路 3 号店', value: '323,234'},
        {name: '工专路 4 号店', value: '323,234'},
        {name: '工专路 5 号店', value: '323,234'},
        {name: '工专路 6 号店', value: '323,234'},
        {name: '工专路 7 号店', value: '323,234'}
      ];
      // 访问量
      this.visitsData = [
        {month: '1月', value: 1098},
        {month: '2月', value: 384},
        {month: '3月', value: 271},
        {month: '4月', value: 1055},
        {month: '5月', value: 1195},
        {month: '6月', value: 714},
        {month: '7月', value: 796},
        {month: '8月', value: 355},
        {month: '9月', value: 781},
        {month: '10月', value: 914},
        {month: '11月', value: 542},
        {month: '12月', value: 816}
      ];
      this.visitsRankData = [
        {name: '工专路 1 号店', value: '323,234'},
        {name: '工专路 2 号店', value: '323,234'},
        {name: '工专路 3 号店', value: '323,234'},
        {name: '工专路 4 号店', value: '323,234'},
        {name: '工专路 5 号店', value: '323,234'},
        {name: '工专路 6 号店', value: '323,234'},
        {name: '工专路 7 号店', value: '323,234'}
      ];
    },
    /* 获取最近1小时访问情况数据 */
    getVisitHourData() {
      this.visitHourData = [
        {time: '16:00', visits: 15, views: 45},
        {time: '16:05', visits: 39, views: 169},
        {time: '16:10', visits: 152, views: 400},
        {time: '16:15', visits: 94, views: 285},
        {time: '16:20', visits: 102, views: 316},
        {time: '16:25', visits: 86, views: 148},
        {time: '16:30', visits: 39, views: 150},
        {time: '16:35', visits: 38, views: 234},
        {time: '16:40', visits: 95, views: 158},
        {time: '16:45', visits: 30, views: 100},
        {time: '16:50', visits: 86, views: 266}
      ];
    },
    /* 获取词云数据 */
    getWordCloudData() {
      this.hotSearchData = [
        {name: "软妹子", value: 23},
        {name: "汪星人", value: 23},
        {name: "长腿欧巴", value: 23},
        {name: "萝莉", value: 22},
        {name: "辣~", value: 22},
        {name: "K歌", value: 22},
        {name: "大长腿", value: 21},
        {name: "川妹子", value: 21},
        {name: "女神", value: 21},
        {name: "米粉", value: 20},
        {name: "专注设计", value: 20},
        {name: "逛街", value: 20},
        {name: "黑长直", value: 20},
        {name: "海纳百川", value: 19},
        {name: "萌萌哒", value: 19},
        {name: "坚持", value: 19},
        {name: "话唠", value: 19},
        {name: "果粉", value: 18},
        {name: "喵星人", value: 18},
        {name: "花粉", value: 18},
        {name: "衬衫控", value: 18},
        {name: "宅男", value: 17},
        {name: "小清新", value: 17},
        {name: "眼镜男", value: 17},
        {name: "琼瑶", value: 17},
        {name: "穷游党", value: 16},
        {name: "铲屎官", value: 16},
        {name: "正太", value: 16},
        {name: "中二病", value: 16},
        {name: "夜猫子", value: 15},
        {name: "逗比", value: 15},
        {name: "腹黑", value: 15},
        {name: "吃鸡", value: 15},
        {name: "为了联盟", value: 14},
        {name: "背包客", value: 14},
        {name: "民谣", value: 14},
        {name: "为了部落", value: 14},
        {name: "懒癌患者", value: 13},
        {name: "追剧", value: 13},
        {name: "IT民工", value: 13},
        {name: "CNB成员", value: 13},
        {name: "选择困难", value: 12},
        {name: "锤粉", value: 12},
        {name: "欧皇", value: 12},
        {name: "仙气十足", value: 12}
      ];
    }
  }
}
</script>

<style scoped>
/* 统计卡片 */
.analysis-chart-card :deep(.ant-card-body) {
  padding: 16px 22px 12px 22px;
}

.analysis-chart-card-num {
  font-size: 30px;
}

.analysis-chart-card-content {
  height: 40px;
}

.analysis-chart-card :deep(.ant-divider) {
  margin: 12px 0;
}

/* 销售额、访问量 */
.monitor-card-tabs :deep(.ant-tabs-bar) {
  padding: 0 16px 0 4px;
}

.monitor-card-tabs :deep(.ant-tabs-tab) {
  padding-left: 2px;
  padding-right: 2px;
  margin: 0 12px !important;
}

.monitor-card-tabs :deep(.ant-tabs-tabpane) {
  padding-bottom: 10px;
}

.demo-monitor-title {
  padding: 6px 20px;
}

.demo-monitor-rank-item {
  padding: 0 20px;
  margin-top: 18px;
}

@media screen and (max-width: 880px) {
  .analysis-tabs-extra {
    display: none;
  }
}
</style>
