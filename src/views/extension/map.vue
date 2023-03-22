<template>
  <div class="ele-body ele-body-card">
    <!-- 地图位置选择弹窗 -->
    <ele-map-picker
      v-model:visible="showPicker"
      :need-city="true"
      @done="onChoose"/>
    <ele-map-picker
      v-model:visible="showPicker2"
      :need-city="true"
      :search-type="1"
      @done="onChoose"/>
    <!-- 弹窗选择位置 -->
    <a-card title="弹窗选择位置" :bordered="false">
      <a-space>
        <a-button
          type="primary"
          @click="showPicker=true">地图选择位置(POI)
        </a-button>
        <a-button
          type="primary"
          @click="showPicker2=true">关键字检索模式
        </a-button>
      </a-space>
      <div v-if="form.location">
        <div style="margin-top: 12px;">选择位置: {{ form.location }}</div>
        <div style="margin-top: 12px;">详细地址: {{ form.address }}</div>
        <div style="margin-top: 12px;">经 纬 度 : {{ form.jinweidu }}</div>
      </div>
    </a-card>
    <!-- 官网底部地图 -->
    <a-card title="官网底部地图" :bordered="false">
      <div ref="locationMap" style="height: 360px;max-width: 1000px;"></div>
    </a-card>
    <!-- 轨迹展示及轨迹回放 -->
    <a-card title="轨迹展示及轨迹回放" :bordered="false">
      <div ref="trackMap" style="height: 360px;margin-bottom: 16px;max-width: 1000px;"></div>
      <a-space>
        <a-button
          type="primary"
          @click="startTrackAnim">开始动画
        </a-button>
        <a-button
          type="primary"
          @click="pauseTrackAnim">暂停动画
        </a-button>
        <a-button
          type="primary"
          @click="resumeTrackAnim">继续动画
        </a-button>
      </a-space>
    </a-card>
  </div>
</template>

<script>
import EleMapPicker from 'ele-admin-pro/packages/ele-map-picker';
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
  name: 'ExtensionMap',
  components: {EleMapPicker},
  data() {
    return {
      // 是否显示地图选择弹窗
      showPicker: false,
      // 是否显示地图选择弹窗2
      showPicker2: false,
      // 表单
      form: {},
      // 小车的marker
      carMarker: null,
      // 轨迹路线
      lineData: [
        [116.478935, 39.997761],
        [116.478939, 39.997825],
        [116.478912, 39.998549],
        [116.478912, 39.998549],
        [116.478998, 39.998555],
        [116.478998, 39.998555],
        [116.479282, 39.99856],
        [116.479658, 39.998528],
        [116.480151, 39.998453],
        [116.480784, 39.998302],
        [116.480784, 39.998302],
        [116.481149, 39.998184],
        [116.481573, 39.997997],
        [116.481863, 39.997846],
        [116.482072, 39.997718],
        [116.482362, 39.997718],
        [116.483633, 39.998935],
        [116.48367, 39.998968],
        [116.484648, 39.999861]
      ],
      // 官网底部地图的实例
      mapInsLocation: null,
      // 小车轨迹地图的实例
      mapInsTrack: null
    };
  },
  computed: {
    // 是否是暗黑模式
    darkMode() {
      return this.$store.state.theme.darkMode;
    }
  },
  mounted() {
    this.renderLocationMap();
    this.renderTrackMap();
  },
  methods: {
    /* 地图选择后回调 */
    onChoose(location) {
      console.log(location);
      this.form = {
        location: location.city.province + '/' + location.city.city + '/' + location.city.district,
        address: location.name + ' ' + location.address,
        jinweidu: location.lng + ',' + location.lat
      };
      this.showPicker = false;
      this.showPicker2 = false;
    },
    /* 渲染官网底部地图 */
    renderLocationMap() {
      AMapLoader.load({
        'key': '006d995d433058322319fa797f2876f5',
        'version': '2.0',
        'plugins': ['AMap.InfoWindow', 'AMap.Marker']
      }).then((AMap) => {
        // 渲染地图
        let option = {
          zoom: 13,  // 初缩放级别
          center: [114.346084, 30.511215 + 0.005]  // 初始中心点
        };
        if (this.darkMode) {
          option.mapStyle = 'amap://styles/dark';
        }
        this.mapInsLocation = new AMap.Map(this.$refs.locationMap, option);
        // 创建信息窗体
        let infoWindow = new AMap.InfoWindow({
          content: `
            <div style="color: #333;">
              <div style="padding: 5px;font-size: 16px;">武汉易云智科技有限公司</div>
              <div style="padding: 0 5px;">地址：湖北省武汉市洪山区雄楚大道222号</div>
              <div style="padding: 0 5px;">电话：020-123456789</div>
            </div>
            <a style="padding: 8px 5px 0;text-decoration: none;display: inline-block;" class="ele-text-primary"
              href="//uri.amap.com/marker?position=114.346084,30.511215&name=武汉易云智科技有限公司"
              target="_blank">到这里去→</a>
          `
        });
        infoWindow.open(this.mapInsLocation, [114.346084, 30.511215]);
        let icon = new AMap.Icon({
          size: new AMap.Size(25, 34),
          image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
          imageSize: new AMap.Size(25, 34)
        });
        let marker = new AMap.Marker({
          icon: icon,
          position: [114.346084, 30.511215],
          offset: new AMap.Pixel(-12, -28)
        });
        marker.setMap(this.mapInsLocation);
        marker.on('click', () => {
          infoWindow.open(this.mapInsLocation);
        });
      }).catch(e => {
        console.error(e);
      });
    },
    /* 渲染轨迹回放地图 */
    renderTrackMap() {
      AMapLoader.load({
        'key': '006d995d433058322319fa797f2876f5',
        'version': '2.0',
        'plugins': ['AMap.MoveAnimation', 'AMap.Marker', 'AMap.Polyline']
      }).then((AMap) => {
        // 渲染地图
        let option = {
          zoom: 17,
          center: [116.478935, 39.997761],
        };
        if (this.darkMode) {
          option.mapStyle = 'amap://styles/dark';
        }
        this.mapInsTrack = new AMap.Map(this.$refs.trackMap, option);
        // 创建小车marker
        this.carMarker = new AMap.Marker({
          map: this.mapInsTrack,
          position: [116.478935, 39.997761],
          icon: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
          offset: new AMap.Pixel(-13, -26),
        });
        // 绘制轨迹
        new AMap.Polyline({
          map: this.mapInsTrack,
          path: this.lineData,
          showDir: true,
          strokeColor: '#28F',  // 线颜色
          strokeOpacity: 1,     // 线透明度
          strokeWeight: 6,      // 线宽
          //strokeStyle: 'solid'  // 线样式
        });
        // 通过的轨迹
        let passedPolyline = new AMap.Polyline({
          map: this.mapInsTrack,
          showDir: true,
          strokeColor: '#4B5',  // 线颜色
          strokeOpacity: 1,     // 线透明度
          strokeWeight: 6,      // 线宽
        });
        // 小车移动回调
        this.carMarker.on('moving', function (e) {
          passedPolyline.setPath(e.passedPath);
        });
        // 地图自适应
        this.mapInsTrack.setFitView();
      }).catch(e => {
        console.error(e);
      });
    },
    /* 开始轨迹回放动画 */
    startTrackAnim() {
      this.carMarker.stopMove();
      this.carMarker.moveAlong(this.lineData, {
        duration: 200,
        autoRotation: true,
      });
    },
    /* 暂停轨迹回放动画 */
    pauseTrackAnim() {
      this.carMarker.pauseMove();
    },
    /* 继续开始轨迹回放动画 */
    resumeTrackAnim() {
      this.carMarker.resumeMove();
    }
  },
  watch: {
    darkMode() {
      if (this.mapInsLocation) {
        if (this.darkMode) {
          this.mapInsLocation.setMapStyle('amap://styles/dark');
        } else {
          this.mapInsLocation.setMapStyle('amap://styles/normal');
        }
      }
      if (this.mapInsTrack) {
        if (this.darkMode) {
          this.mapInsTrack.setMapStyle('amap://styles/dark');
        } else {
          this.mapInsTrack.setMapStyle('amap://styles/normal');
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
