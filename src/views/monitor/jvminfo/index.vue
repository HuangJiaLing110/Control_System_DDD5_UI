
<template>
  <div class="ele-body ele-body-card">
    <a-spin :spinning="loading">
      <a-row :gutter="16">
        <a-col :md="24" :sm="24" :xs="24">
          <a-card title="JVM信息">
            <div id="container"></div>
          </a-card>
        </a-col>
      </a-row>

    </a-spin>

  </div>
</template>
<script>
  import {Chart} from '@antv/g2';
  import moment from 'moment';
  //设置时区
  moment.locale('zh-cn');
  export default {
    data() {
      return {
        loading: true,
        //数据初始化
        dataSource: {
          memoryInfo: [],
          bufferInfo: [],
          threadsInfo: [],
          classesInfo: [],
          gcInfo: [],
        },
        //图表数据
        transData: [],


      }
    },
    created() {

      this.getJvmInfo();
    },
    mounted() {
    },
    methods: {
      //获取Jvm信息
      getJvmInfo() {
        this.loading = false;
        Promise.all([
          this.getAction('actuator/metrics/jvm.memory.max'),
          this.getAction('actuator/metrics/jvm.memory.committed'),
          this.getAction('actuator/metrics/jvm.memory.used'),
          this.getAction('actuator/metrics/jvm.buffer.memory.used'),
          this.getAction('actuator/metrics/jvm.buffer.count'),
          this.getAction('actuator/metrics/jvm.threads.daemon'),
          this.getAction('actuator/metrics/jvm.threads.live'),
          this.getAction('actuator/metrics/jvm.threads.peak'),
          this.getAction('actuator/metrics/jvm.classes.loaded'),
          this.getAction('actuator/metrics/jvm.classes.unloaded'),
          this.getAction('actuator/metrics/jvm.gc.memory.allocated'),
          this.getAction('actuator/metrics/jvm.gc.memory.promoted'),
          this.getAction('actuator/metrics/jvm.gc.max.data.size'),
          this.getAction('actuator/metrics/jvm.gc.live.data.size'),
          this.getAction('actuator/metrics/jvm.gc.pause')
        ]).then((response) => {

          response.forEach((value) => {
            let perData = value.data;
            //获取name
            let name = value.data.name;
            //获取value
            let val = perData.measurements[0].value;
            //将数据转换成MB
            if (name === 'jvm.memory.max'
              || name === 'jvm.memory.committed'
              || name === 'jvm.memory.used'
              || name === 'jvm.buffer.memory.used'
              || name === 'jvm.gc.memory.allocated'
              || name === 'jvm.gc.memory.promoted'
              || name === 'jvm.gc.max.data.size'
              || name === 'jvm.gc.live.data.size'
            ) {
              //转换MB
              val = this.convert(val, Number);
            }
            if (name.indexOf('gc') != -1) {
              if (name == "jvm.gc.memory.allocated") {
                name = "GC时，年经代分配的内存空间";
                val = val + "MB";
              }
              if (name == "jvm.gc.memory.promoted") {
                name = "GC时，老年代分配的内存空间";
                val = val + "MB";
              }
              if (name == "jvm.gc.max.data.size") {
                name ="GC时，老年代的最大内存空间";
                val = val + "MB";
              }
              if (name == "jvm.gc.live.data.size") {
                name ="GC时，老年代的内存空间";
                val = val + "MB";
              }
              if (name == "jvm.gc.pause") {
                name = "系统启动以来GC次数";
                val = val + "次";
              }


              this.dataSource.gcInfo.push({name: name, value: val});
              this.transData.push({label: 'gc时相关信息', name: name, value: val});
            } else {

              //buffer统计
              if (name.indexOf('buffer') != -1) {
                if(name=="jvm.buffer.memory.used"){
                  name="JVM 缓冲区已用内存";
                  val=val+"MB";
                }
                if(name=="jvm.buffer.count"){
                  name="当前缓冲区数量";
                  val=val+"个";
                }

                this.dataSource.bufferInfo.push({name: name, value: val});
                this.transData.push({label: 'buffer(缓冲信息)', name: name, value: val});
              } else if (name.indexOf('threads') != -1) {
                if(name=="jvm.threads.daemon"){
                    name="JVM 守护线程数量";
                    val=val+"个";
                }
                if(name=="jvm.threads.live"){
                  name="JVM 当前活跃线程数量";
                  val=val+"个";
                }
                if(name=="jvm.threads.peak"){
                  name="JVM 峰值线程数量";
                  val=val+"个";
                }
                //线程统计
                this.dataSource.threadsInfo.push({name: name, value: val});
                this.transData.push({label: 'threads线程信息', name: name, value: val});
              } else if (name.indexOf('classes') != -1) {
                if(name=="jvm.classes.loaded"){
                  name="JVM 已加载 Class 数量";
                  // val=val+"个";
                }
                if(name=="jvm.classes.unloaded"){
                  name="JVM 未加载 Class 数量";
                  // val=val+"个";
                }
                //classes统计
                this.dataSource.classesInfo.push({name: name, value: val});
                this.transData.push({label: 'classes(class相关数量)', name: name, value: val});
              } else {
                if(name=="jvm.memory.max"){
                  name="JVM最大内存";
                  val=val+"MB";
                }
                if(name=="jvm.memory.committed"){
                  name="JVM可用内存";
                  val=val+"MB";
                }
                if(name=="jvm.memory.used"){
                  name="JVM已用内存";
                  val=val+"MB";
                }
                //内存统计
                this.dataSource.memoryInfo.push({name: name, value: val});
                this.transData.push({label: 'memory内存信息(MB)', name: name, value: val});
              }
            }


          })


          this.setBarChart(this.transData, 'container', 750);
        })


      },
      //计算比例
      calcRate(data) {
        let info = [];
        let maxTotal = parseFloat(data[0].value);
        for (let i = 1; i < data.length; i++) {
          // console.log(parseFloat(data[i].value));
          info.push({name: data[i].name, val: parseFloat(data[i].value / maxTotal).toFixed(2)});
        }
        //console.log(info);
        return info;

      },
      //条形图图封装
      setBarChart(data, el, height) {
        const chart = new Chart({
          container: el,
          autoFit: true,
          height: height,
        });

        chart.data(data);

        chart
          .coordinate()
          .transpose()
          .scale(1, -1);

        chart.axis('val', {
          position: 'right',
        });
        chart.axis('label', {
          label: {
            offset: 12,
          },
        });

        chart.tooltip({
          shared: true,
          showMarkers: false,

        });

        chart
          .interval()
          .position('label*value')
          .color('name')
          .adjust([
            {
              type: 'dodge',
              marginRatio: 0,
            },
          ]);

        chart.interaction('active-region');

        chart.render();
      },
      //统一封装
      getAction(url) {
        //返回的是promise
        return this.$http.get(url);
      },
      //格式转换
      convert(value, type) {
        //数字转换成MB
        if (type === Number) {
          return Number(value / 1048576).toFixed(3)
        } else if (type === Date) {
          //日期处理
          return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
        }
        return value;
      }
    }
  }

</script>
<style scoped>

</style>

