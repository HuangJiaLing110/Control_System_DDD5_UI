<template>
  <div>
    <!--   下拉选择框 位置关键词选择/经纬度选择   -->
    <a-row :gutter="16">
      <a-col :md="16" :sm="16" :xs="16">
        <a-form
          :model="formState"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          labelAlign="left"
        >
          <a-form-item label="选择规划方式">
            <a-select v-model:value="modePlan">
              <a-select-option value="l">位置经纬度</a-select-option>
              <a-select-option value="k">地点关键字</a-select-option>
            </a-select>
          </a-form-item>
          <template v-if="flagCollection.showSelectFlag==1">
            <a-form-item label="起点位置关键词">
              <a-input v-model:value="formState.startKeyword" id="startPos"/>
            </a-form-item>
            <a-form-item label="结束位置关键词">
              <a-input v-model:value="formState.endKeyword" id="endPos"/>
            </a-form-item>
          </template>
          <template v-if="flagCollection.showSelectFlag==0">
            <a-form-item label="起点位置经纬度">
              <a-input v-model:value="formState.startLocation"/>
            </a-form-item>
            <a-form-item label="结束位置经纬度">
              <a-input v-model:value="formState.endLocation"/>
            </a-form-item>

          </template>
          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="handleSearch">查找</a-button>
            <a-button style="margin-left: 10px">取消</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>

    <a-card>
      <!-- 地图view     -->
      <div class="mapView">
        <div id="container" style="height: 600px"></div>
        <div id="panel"></div>
      </div>
    </a-card>
  </div>
</template>
<script>
  import {defineComponent, ref, onMounted, reactive, watch} from "vue";
  import {message} from 'ant-design-vue';
  import AMapLoader from "@amap/amap-jsapi-loader";

  export default defineComponent({
    components: {},
    props: {},
    emits: [],
    name: "MPathPlan",
    setup() {
      //定义
      const mapInstance = ref(null);
      const modePlan = ref("k");
      const formState = reactive({});
      let AMapInstance = reactive(null);
      let drivingInstance=reactive(null);
      let flagCollection = reactive({showSelectFlag: 1});

      //监听
      watch(modePlan, (newVal) => {
        console.log(newVal)
        if (newVal == "l") {
          flagCollection.showSelectFlag = 0;
        }
        if (newVal == "k") {
          //关键词
          flagCollection.showSelectFlag = 1;
        }
      });

      //定位查找
      function handleSearch() {
        let domPanel = document.querySelector("#panel");
        //判断关键词是否存在
        console.log(formState.startKeyword, formState.endKeyword)
        if(formState.startKeyword!==undefined && formState.endKeyword!==undefined){
          //每次查找清空节点
          domPanel.innerHTML='';
          //清除搜索路线结果
          if(drivingInstance!=null){
            drivingInstance.clear();
          }


          drivingInstance = new AMapInstance.Driving({
            map: mapInstance.value,
            panel: domPanel,
            size: 4, //大型货车
          });
          //查询路线
          drivingInstance.search(
            [
              {keyword: formState.startKeyword},
              {keyword: formState.endKeyword},
            ],
            function (status, result) {
              if (status === "complete") {
                console.log("绘制驾车路线完成");
              } else {
                console.log("获取驾车数据失败：" + result);
              }
            }
          );
        }else{
          message.warn('请输入起始点或者终点');
          return;
        }

      }

      //获取地图搜素提示
      function getTipAutocomplete(AMap, el) {
        //创建一个自动提示实例
        new AMap.AutoComplete({
          input: el
        });
      }

      //获取地图信息
      function mapInit() {
        let domMap = document.querySelector("#container");

        let domStartPos = document.querySelector("#startPos");
        let domEndPos = document.querySelector("#endPos");
        AMapLoader.load({
          key: "006d995d433058322319fa797f2876f5",
          version: "2.0",
          plugins: ["AMap.TruckDriving", "AMap.ToolBar", "AMap.Driving", "AMap.AutoComplete","AMap.Geolocation"],
        }).then((AMap) => {
          AMapInstance = AMap;
          //渲染地图
          let options = {
            resizeEnable: true,
            // center: [116.397428, 39.90923], //地图中心点
            zoom: 13, //地图显示的缩放级别
          };
          mapInstance.value = new AMap.Map(domMap, options);
          //添加工具条
          mapInstance.value.addControl(new AMap.ToolBar({position: "LT"}));
          //添加自动提示
          getTipAutocomplete(AMap, domStartPos);
          getTipAutocomplete(AMap, domEndPos);
          //获取浏览器定位
          let geolocation=new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：5s
            buttonPosition:'RB',    //定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
          });
          //添加定位控件
          mapInstance.value.addControl(geolocation);
          //获取地图中心点
          //let center = mapInstance.value.getCenter();
          //console.log(center);
          geolocation.getCurrentPosition(function(status,result){
            if(status=='complete'){
              console.log(result)
            }else{
              console.log(result)
            }
          });
        });
      }

      //生命周期
      onMounted(() => {
        mapInit();
      });
      return {
        modePlan,
        mapInstance,
        drivingInstance,
        flagCollection,
        formState,
        AMapInstance,
        handleSearch,
      };
    },
  });
</script>
<style scoped>
  .mapView {
    position: relative;
  }

  #panel {
    position: absolute;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 10px;
    right: 10px;
    width: 280px;
  }

  #panel .amap-call {
    background-color: #009cf9;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  #panel .amap-lib-driving {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    overflow: hidden;
  }
</style>
