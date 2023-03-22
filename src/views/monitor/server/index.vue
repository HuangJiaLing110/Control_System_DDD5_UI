<template>
  <div class="ele-body ele-body-card">
    <template v-if="loading">
      <a-spin />
    </template>
    <template v-else>
      <a-row :gutter="16">
        <a-col :md="12" :sm="12" :xs="12">
          <a-card title="CPU">
            <table
              cellspacing="0"
              style="width: 100%"
              class="my-table my-table-m"
            >
              <thead>
              <tr>
                <th class="is-bb">
                  <div class="cell">属性</div>
                </th>
                <th class="is-bb">
                  <div class="cell">值</div>
                </th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td><div class="cell">核心数</div></td>
                <td>
                  <div class="cell" v-if="server.cpu">
                    {{ server.cpu.cpuNum }}
                  </div>
                </td>
              </tr>
              <tr>
                <td><div class="cell">用户使用率</div></td>
                <td>
                  <div class="cell" v-if="server.cpu">
                    {{ server.cpu.used }}%
                  </div>
                </td>
              </tr>
              <tr>
                <td><div class="cell">系统使用率</div></td>
                <td>
                  <div class="cell" v-if="server.cpu">
                    {{ server.cpu.sys }}%
                  </div>
                </td>
              </tr>
              <tr>
                <td><div class="cell">当前空闲率</div></td>
                <td>
                  <div class="cell" v-if="server.cpu">
                    {{ server.cpu.free }}%
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </a-card>
        </a-col>
        <a-col :md="12" :sm="12" :xs="12">
          <a-card title="内存">
            <table
              cellspacing="0"
              style="width: 100%"
              class="my-table my-table-m"
            >
              <thead>
              <tr>
                <th class="is-bb">
                  <div class="cell">属性</div>
                </th>
                <th class="is-bb">
                  <div class="cell">内存</div>
                </th>
                <th class="is-bb">
                  <div class="cell">JVM</div>
                </th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td><div class="cell">总内存</div></td>
                <td>
                  <div class="cell" v-if="server.mem">
                    {{ server.mem.total }}G
                  </div>
                </td>
                <td>
                  <div class="cell" v-if="server.jvm">
                    {{ server.jvm.total }}M
                  </div>
                </td>
              </tr>
              <tr>
                <td><div class="cell">已用内存</div></td>
                <td>
                  <div class="cell" v-if="server.mem">
                    {{ server.mem.used }}G
                  </div>
                </td>
                <td>
                  <div class="cell" v-if="server.jvm">
                    {{ server.jvm.used }}M
                  </div>
                </td>
              </tr>
              <tr>
                <td><div class="cell">剩余内存</div></td>
                <td>
                  <div class="cell" v-if="server.mem">
                    {{ server.mem.free }}G
                  </div>
                </td>
                <td>
                  <div class="cell" v-if="server.jvm">
                    {{ server.jvm.free }}M
                  </div>
                </td>
              </tr>
              <tr>
                <td><div class="cell">使用率</div></td>
                <td>
                  <div
                    class="cell"
                    v-if="server.mem"
                    :class="{ 'text-danger': server.mem.usage > 80 }"
                  >
                    {{ server.mem.usage }}%
                  </div>
                </td>
                <td>
                  <div
                    class="cell"
                    v-if="server.jvm"
                    :class="{ 'text-danger': server.jvm.usage > 80 }"
                  >
                    {{ server.jvm.usage }}%
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </a-card>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :md="24" :sm="24" :xs="24">
          <a-card title="服务器信息">
            <table
              cellspacing="0"
              style="width: 100%"
              class="my-table my-table-m"
            >
              <tbody>
              <tr>
                <td><div class="cell">服务器名称</div></td>
                <td>
                  <div class="cell" v-if="server.sys">
                    {{ server.sys.computerName }}
                  </div>
                </td>
                <td><div class="cell">操作系统</div></td>
                <td>
                  <div class="cell" v-if="server.sys">
                    {{ server.sys.osName }}
                  </div>
                </td>
              </tr>
              <tr>
                <td><div class="cell">服务器IP</div></td>
                <td>
                  <div class="cell" v-if="server.sys">
                    {{ server.sys.computerIp }}
                  </div>
                </td>
                <td><div class="cell">系统架构</div></td>
                <td>
                  <div class="cell" v-if="server.sys">
                    {{ server.sys.osArch }}
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </a-card>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :md="24" :sm="24" :xs="24">
          <a-card title="Java虚拟机信息">
            <table
              cellspacing="0"
              style="width: 100%"
              class="my-table my-table-m"
            >
              <tbody>
              <tr>
                <td><div class="cell">Java名称</div></td>
                <td>
                  <div class="cell" v-if="server.jvm">
                    {{ server.jvm.name }}
                  </div>
                </td>
                <td><div class="cell">Java版本</div></td>
                <td>
                  <div class="cell" v-if="server.jvm">
                    {{ server.jvm.version }}
                  </div>
                </td>
              </tr>
              <tr>
                <td><div class="cell">启动时间</div></td>
                <td>
                  <div class="cell" v-if="server.jvm">
                    {{ server.jvm.startTime }}
                  </div>
                </td>
                <td><div class="cell">运行时长</div></td>
                <td>
                  <div class="cell" v-if="server.jvm">
                    {{ server.jvm.runTime }}
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="1"><div class="cell">安装路径</div></td>
                <td colspan="3">
                  <div class="cell" v-if="server.jvm">
                    {{ server.jvm.home }}
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="1"><div class="cell">项目路径</div></td>
                <td colspan="3">
                  <div class="cell" v-if="server.sys">
                    {{ server.sys.userDir }}
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </a-card>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :md="24" :sm="24" :xs="24">
          <a-card title="磁盘状态">
            <table
              cellspacing="0"
              style="width: 100%"
              class="my-table my-table-m"
            >
              <thead>
              <tr>
                <th class="is-bb"><div class="cell">盘符路径</div></th>
                <th class="is-bb"><div class="cell">文件系统</div></th>
                <th class="is-bb"><div class="cell">盘符类型</div></th>
                <th class="is-bb"><div class="cell">总大小</div></th>
                <th class="is-bb"><div class="cell">可用大小</div></th>
                <th class="is-bb"><div class="cell">已用大小</div></th>
                <th class="is-bb"><div class="cell">已用百分比</div></th>
              </tr>
              </thead>
              <tbody v-if="server.sysFiles">
              <tr v-for="sysFile in server.sysFiles" :key="sysFile.id">
                <td>
                  <div class="cell">{{ sysFile.dirName }}</div>
                </td>
                <td>
                  <div class="cell">{{ sysFile.sysTypeName }}</div>
                </td>
                <td>
                  <div class="cell">{{ sysFile.typeName }}</div>
                </td>
                <td>
                  <div class="cell">{{ sysFile.total }}</div>
                </td>
                <td>
                  <div class="cell">{{ sysFile.free }}</div>
                </td>
                <td>
                  <div class="cell">{{ sysFile.used }}</div>
                </td>
                <td>
                  <div
                    class="cell"
                    :class="{ 'text-danger': sysFile.usage > 80 }"
                  >
                    {{ sysFile.usage }}%
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </a-card>
        </a-col>
      </a-row>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //加载层信息
      loading: true,
      //服务器信息
      server: [],
    };
  },

  components: {},
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      this.$http
        .get("/monitor/server")
        .then((res) => {
          this.loading = false;

          if (res.data.code === 0) {
            this.server = res.data.data;
          } else {
            this.$message.error(res.data.msg);
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
.text-danger {
  color: #ed5565;
}
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
.my-table-m {
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
.my-table-m th {
  overflow: hidden;
  background: #fff;
}
.my-table-m th.is-bb {
  padding: 10px 0;
  border-bottom: 1px solid #dfe6ec;
}
.my-table-m td {
  padding: 10px 0;
  border-bottom: 1px solid #dfe6ec;
}
</style>
