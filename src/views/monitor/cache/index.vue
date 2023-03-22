<template>
  <div class="ele-body ele-body-card">
    <a-row :gutter="16">
      <a-col :md="24" :sm="24" :xs="24">
        <a-card title="基本信息">
          <!-- 表格区域 -->
          <table
            cellspacing="0"
            style="width: 100%"
            class="my-table my-table-m"
          >
            <tbody>
            <tr>
              <td><div class="cell">Redis版本</div></td>
              <td>
                <div class="cell" v-if="cache.info">
                  {{ cache.info.redis_version }}
                </div>
              </td>
              <td><div class="cell">运行模式</div></td>
              <td>
                <div class="cell" v-if="cache.info">
                  {{
                    cache.info.redis_mode == "standalone" ? "单机" : "集群"
                  }}
                </div>
              </td>
              <td><div class="cell">端口</div></td>
              <td>
                <div class="cell" v-if="cache.info">
                  {{ cache.info.tcp_port }}
                </div>
              </td>
              <td><div class="cell">客户端数</div></td>
              <td>
                <div class="cell" v-if="cache.info">
                  {{ cache.info.connected_clients }}
                </div>
              </td>
            </tr>
            <tr>
              <td><div class="cell">运行时间(天)</div></td>
              <td>
                <div class="cell" v-if="cache.info">
                  {{ cache.info.uptime_in_days }}
                </div>
              </td>
              <td><div class="cell">使用内存</div></td>
              <td>
                <div class="cell" v-if="cache.info">
                  {{ cache.info.used_memory_human }}
                </div>
              </td>
              <td><div class="cell">使用CPU</div></td>
              <td>
                <div class="cell" v-if="cache.info">
                  {{
                    parseFloat(cache.info.used_cpu_user_children).toFixed(2)
                  }}
                </div>
              </td>
              <td><div class="cell">内存配置</div></td>
              <td>
                <div class="cell" v-if="cache.info">
                  {{ cache.info.maxmemory_human }}
                </div>
              </td>
            </tr>
            <tr>
              <td><div class="cell">AOF是否开启</div></td>
              <td>
                <div class="cell" v-if="cache.info">
                  {{ cache.info.aof_enabled == "0" ? "否" : "是" }}
                </div>
              </td>
              <td><div class="cell">RDB是否成功</div></td>
              <td>
                <div class="cell" v-if="cache.info">
                  {{ cache.info.rdb_last_bgsave_status }}
                </div>
              </td>
              <td><div class="cell">Key数量</div></td>
              <td>
                <div class="cell" v-if="cache.dbSize">
                  {{ cache.dbSize }}
                </div>
              </td>
              <td><div class="cell">网络入口/出口</div></td>
              <td>
                <div class="cell" v-if="cache.info">
                  {{ cache.info.instantaneous_input_kbps }}kps/{{
                    cache.info.instantaneous_output_kbps
                  }}kps
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col md="12" :sm="12" :xs="24">
        <a-card title="命令统计">
          <div class="my-table my-table-m">
            <div ref="commandstats" style="height: 420px" />
          </div>
        </a-card>
      </a-col>
      <a-col md="12" :sm="12" :xs="24">
        <a-card title="内存信息">
          <div class="my-table my-table-m">
            <div ref="usedmemory" style="height: 420px" />
          </div>
        </a-card>
      </a-col>
    </a-row>

  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      data: [],
      columns: [],
      // 加载层信息
      loading: true,
      // 统计命令信息
      commandstats: null,
      // 使用内存
      usedmemory: null,
      // cache信息
      cache: [],
    };
  },
  created() {
    this.getList();

  },
  computed() {},
  components: {},

  methods: {
    async getList() {

      this.$http
        .get("/monitor/cache")
        .then((response) => {

          if (response.data.code === 0) {
            this.cache = response.data.data;
            // console.log(this.cache.info);
            //图表区域
            //初始化图表
            this.commandstats = echarts.init(
              this.$refs.commandstats,
              "macarons"
            );
            this.commandstats.setOption({
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)",
              },
              series: [
                {
                  name: "命令",
                  type: "pie",
                  roseType: "radius",
                  radius: [15, 95],
                  center: ["50%", "38%"],
                  data: this.cache.commandStats,
                  animationEasing: "cubicInOut",
                  animationDuration: 1000,
                },
              ],
            });
            //初始化
            this.usedmemory = echarts.init(this.$refs.usedmemory, "macarons");
            this.usedmemory.setOption({
              tooltip: {
                formatter:
                  "{b} <br/>{a} : " + this.cache.info.used_memory_human,
              },
              series: [
                {
                  name: "峰值",
                  type: "gauge",
                  min: 0,
                  max: 1000,
                  detail: {
                    formatter: this.cache.info.used_memory_human,
                  },
                  data: [
                    {
                      value: parseFloat(this.cache.info.used_memory_human),
                      name: "内存消耗",
                    },
                  ],
                },
              ],
            });
          } else {

            this.$message.error(response.data.msg);
          }
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
  },
};
</script>
<style scoped>
.my-table {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  -webkit-box-flex: 1;

  flex: 1;
  width: 100%;
  background: #fff;
  font-size: 14px;
  color: #606266;
}

.my-table-m .cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding: 0 10px;
}
.my-table-m td {
  padding: 10px 0;
  border-bottom: 1px solid #dfe6ec;
}
</style>
