/** 常用工具方法 license by http://eleadmin.com */
export default {
  /**
   * 倒计时
   * @param endTime 结束时间
   * @param serverTime 服务端当前时间
   * @param callback 回调
   * @returns {number} 定时器实例
   */
  countdown(endTime, serverTime, callback) {
    let type = typeof serverTime === 'function',
      end = new Date(endTime).getTime(),
      now = new Date((!serverTime || type) ? new Date().getTime() : serverTime).getTime(),
      count = end - now,
      time = [
        Math.floor(count / (1000 * 60 * 60 * 24)),  // 天
        Math.floor(count / (1000 * 60 * 60)) % 24,  // 时
        Math.floor(count / (1000 * 60)) % 60,  // 分
        Math.floor(count / 1000) % 60  // 秒
      ];
    if (type) {
      callback = serverTime;
    }
    let timer = setTimeout(() => {
      this.countdown(endTime, now + 1000, callback);
    }, 1000);
    callback && callback(count > 0 ? time : [0, 0, 0, 0], serverTime, timer);
    if (count <= 0) {
      clearTimeout(timer);
    }
    return timer;
  },
  /**
   * 某个时间在当前时间的多久前
   * @param time 需要语义化的时间
   * @param onlyDate 超过30天是否仅返回日期
   * @returns {string} 语义化后的时间
   */
  timeAgo(time, onlyDate) {
    if (!time) {
      return '';
    }
    if (typeof time === 'string') {
      time = time.replace(/-/g, '/');
    }
    let arr = [[], []],
      stamp = new Date().getTime() - new Date(time).getTime();
    // 30天以上返回具体日期
    if (stamp > 1000 * 60 * 60 * 24 * 31) {
      stamp = new Date(time);
      arr[0][0] = this.digit(stamp.getFullYear(), 4);
      arr[0][1] = this.digit(stamp.getMonth() + 1);
      arr[0][2] = this.digit(stamp.getDate());
      // 是否输出时间
      if (!onlyDate) {
        arr[1][0] = this.digit(stamp.getHours());
        arr[1][1] = this.digit(stamp.getMinutes());
        arr[1][2] = this.digit(stamp.getSeconds());
      }
      return arr[0].join('-') + ' ' + arr[1].join(':');
    }
    if (stamp >= 1000 * 60 * 60 * 24) {
      return ((stamp / 1000 / 60 / 60 / 24) | 0) + '天前';
    } else if (stamp >= 1000 * 60 * 60) {
      return ((stamp / 1000 / 60 / 60) | 0) + '小时前';
    } else if (stamp >= 1000 * 60 * 3) {
      return ((stamp / 1000 / 60) | 0) + '分钟前';
    } else if (stamp < 0) {
      return '未来';
    } else {
      return '刚刚';
    }
  },
  /**
   * 数字前置补零
   * @param num 数字
   * @param length 位数
   * @returns {string}
   */
  digit(num, length) {
    let str = '';
    num = String(num);
    length = length || 2;
    for (let i = num.length; i < length; i++) {
      str += '0';
    }
    return num < Math.pow(10, length) ? str + (num | 0) : num;
  },
  /**
   * 转化为日期格式字符
   * @param time 时间
   * @param format 格式
   * @returns {string}
   */
  toDateString(time, format) {
    if (!time) {
      return '';
    }
    if (typeof time === 'string') {
      time = time.replace(/-/g, '/');
    } else if (typeof time === 'number' && String(time).length === 10) {
      // 10位时间戳处理
      time = time * 1000;
    }
    let date = new Date(time),
      ymd = [
        this.digit(date.getFullYear(), 4),
        this.digit(date.getMonth() + 1),
        this.digit(date.getDate())
      ],
      hms = [
        this.digit(date.getHours()),
        this.digit(date.getMinutes()),
        this.digit(date.getSeconds())
      ];
    format = format || 'yyyy-MM-dd HH:mm:ss';
    return format.replace(/yyyy/g, ymd[0])
      .replace(/MM/g, ymd[1])
      .replace(/dd/g, ymd[2])
      .replace(/HH/g, hms[0])
      .replace(/mm/g, hms[1])
      .replace(/ss/g, hms[2]);
  },
  /**
   * html转义, 防止xss注入
   * @param html 需要转义的字符串
   * @returns {string}
   */
  escape(html) {
    return String(html || '')
      .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;');
  },
  /**
   * pid形式数据转children形式
   * @param data 需要转换的数组
   * @param idKey id字段名
   * @param pidKey pid字段名
   * @param childKey 生成的children字段名
   * @param pid 顶级的pid
   * @param addPIds 是否添加所有父级id的字段
   * @param parentsKey 所有父级id的字段名称，默认parentIds
   * @param parentIds 所有父级id
   * @returns {[]}
   */
  toTreeData(data, idKey, pidKey, childKey, pid, addPIds, parentsKey, parentIds) {
    if (typeof data === 'object' && !Array.isArray(data)) {
      idKey = data.idKey;
      pidKey = data.pidKey;
      childKey = data.childKey;
      pid = data.pid;
      addPIds = data.addPIds;
      parentsKey = data.parentsKey;
      parentIds = data.parentIds;
      data = data.data;
    }
    if (!childKey) {
      childKey = 'children';
    }
    if (pid === undefined) {
      pid = [];
      data.forEach(d => {
        let flag = true;
        for (let i = 0; i < data.length; i++) {
          if (d[pidKey] == data[i][idKey]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          pid.push(d[pidKey]);
        }
      });
    }
    let result = [];
    data.forEach(d => {
      if (d[idKey] == d[pidKey]) {
        console.error('data error: ', d)
        return;
      }
      if (Array.isArray(pid) ? (pid.indexOf(d[pidKey]) !== -1) : (d[pidKey] == pid)) {
        let children = this.toTreeData({
          data: data,
          idKey: idKey,
          pidKey: pidKey,
          childKey: childKey,
          pid: d[idKey],
          addPIds: addPIds,
          parentsKey: parentsKey,
          parentIds: parentIds ? parentIds.concat([d[idKey]]) : []
        });
        if (children.length > 0) {
          d[childKey] = children;
        }
        if (addPIds) {
          d[parentsKey || 'parentIds'] = parentIds || [];
        }
        result.push(d);
      }
    });
    return result;
  },
  /**
   * 遍历children形式数据
   * @param data 需要遍历的数组
   * @param callback 回调
   * @param childKey children字段名
   */
  eachTreeData(data, callback, childKey) {
    if (!data || !data.length) {
      return;
    }
    if (!childKey) {
      childKey = 'children';
    }
    data.forEach(d => {
      if (callback(d) !== false && d[childKey]) {
        this.eachTreeData(d[childKey], callback, childKey);
      }
    });
  },
  /**
   * 处理树形数据
   * @param data 需要处理的数据
   * @param formatter 处理器
   * @param childKey children字段名
   * @returns {[]} 处理后的数据
   */
  formatTreeData(data, formatter, childKey) {
    let result = [];
    if (data && data.length) {
      if (!childKey) {
        childKey = 'children';
      }
      data.forEach(d => {
        let item = formatter(d);
        if (item !== false) {
          if (item[childKey]) {
            item[childKey] = this.formatTreeData(item[childKey], formatter, childKey);
          }
          result.push(item);
        }
      });
    }
    return result;
  },
  /**
   * 让浏览器全屏切换
   * @returns {boolean} 是否是全屏状态
   */
  toggleFullscreen(el, fullscreen) {
    if (!el) {
      el = document.documentElement;
      if (fullscreen === undefined) {
        fullscreen = !(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        );
      }
    }
    if (fullscreen) {
      const rfs = (
        el.requestFullScreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullScreen
      );
      if (rfs) {
        rfs.call(el);
      } else {
        throw new Error('您的浏览器不支持全屏模式');
      }
    } else {
      const cfs = (
        document.exitFullScreen ||
        document.webkitCancelFullScreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen
      );
      if (cfs) {
        cfs.call(document);
      }
    }
    return fullscreen;
  },
  /**
   * 获取屏幕宽度
   * @returns {number}
   */
  screenWidth() {
    return document.documentElement.clientWidth || document.body.clientWidth;
  },
  /**
   * 获取屏幕高度
   * @returns {number}
   */
  screenHeight() {
    return document.documentElement.clientHeight || document.body.clientHeight;
  },
  /**
   * html转text, 获取html的纯文本
   * @param html
   * @returns {*}
   */
  htmlToText(html) {
    return html.replace(/<[^>]+>/g, '');
  },
  /**
   * 获取设备信息
   * @param key 自定义的agent
   * @returns {{weixin: *, os: (string|undefined), ie: boolean}}
   */
  device(key) {
    let agent = navigator.userAgent.toLowerCase(),
      // 获取版本号
      getVersion = function (label) {
        const exp = new RegExp(label + '/([^\\s\\_\\-]+)');
        label = (agent.match(exp) || [])[1];
        return label || false;
      },
      // 返回结果集
      result = {
        os: function () {
          // 底层操作系统
          if (/windows/.test(agent)) {
            return 'windows';
          } else if (/linux/.test(agent)) {
            return 'linux';
          } else if (/iphone|ipod|ipad|ios/.test(agent)) {
            return 'ios';
          } else if (/mac/.test(agent)) {
            return 'mac';
          } else if (/android/.test(agent)) {
            return 'android';
          }
        }(),
        ie: function () {
          // ie版本
          return (!!window.ActiveXObject || 'ActiveXObject' in window) ? (
            (agent.match(/msie\s(\d+)/) || [])[1] || '11'  // 由于ie11并没有msie的标识
          ) : false;
        }(),
        weixin: getVersion('micromessenger')  // 是否微信
      };
    // 任意的key
    if (key && !result[key]) {
      result[key] = getVersion(key);
    }
    // 是否移动设备
    result.android = /android/.test(agent);
    result.ios = result.os === 'ios';
    result.mobile = result.android || result.ios;
    return result;
  },
  /**
   * 生成随机id
   * @param length 长度
   * @returns {string}
   */
  uuid(length = 32) {
    const num = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let str = '';
    for (let i = 0; i < length; i++) {
      str += num.charAt(Math.floor(Math.random() * num.length));
    }
    return str;
  },
  /**
   * 生成m到n的随机数, 不包含n
   * @param m 最小值
   * @param n 最大值
   * @returns {number}
   */
  random(m, n) {
    return Math.floor(Math.random() * (m - n) + n);
  },
  /**
   * 百度地图坐标转高德地图坐标
   * @param point 坐标
   * @returns {{lng: number, lat: number}}
   */
  bd09ToGcj02: function (point) {
    const x_pi = (3.14159265358979324 * 3000.0) / 180.0;
    const x = point.lng - 0.0065, y = point.lat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    return {
      lng: z * Math.cos(theta),
      lat: z * Math.sin(theta)
    };
  },
  /**
   * 高德地图坐标转百度地图坐标
   * @param point 坐标
   * @returns {{lng: number, lat: number}}
   */
  gcj02ToBd09: function (point) {
    const x_pi = (3.14159265358979324 * 3000.0) / 180.0;
    const x = point.lng, y = point.lat;
    const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    return {
      lng: z * Math.cos(theta) + 0.0065,
      lat: z * Math.sin(theta) + 0.006
    };
  },
  /**
   * 深度克隆对象
   * @param obj
   * @returns {{}|*}
   */
  deepClone: function (obj) {
    let result;
    const type = this.typeOf(obj);
    if (type === 'Object') {
      result = {};
    } else if (type === 'Array') {
      result = [];
    } else {
      return obj;
    }
    Object.keys(obj).forEach(key => {
      const copy = obj[key],
        cType = this.typeOf(copy);
      if (cType === 'Object' || cType === 'Array') {
        result[key] = this.deepClone(copy);
      } else {
        result[key] = obj[key];
      }
    });
    return result;
  },
  /**
   * 获取变量类型
   * @param obj
   * @returns {string}
   */
  typeOf(obj) {
    if (obj === null) {
      return 'Null';
    }
    if (obj === undefined) {
      return 'Undefined';
    }
    return Object.prototype.toString.call(obj).slice(8, -1);
  },
  /**
   * 播放音频
   * @param url 音频地址
   */
  play(url) {
    return new Audio(url).play();
  },
  /**
   * 判断富文本是否为空
   * @param html
   */
  htmlIsBlank(html) {
    if (!html) {
      return true;
    }
    const media = ['img', 'audio', 'video', 'iframe', 'object'];
    for (let i = 0; i < media.length; i++) {
      if (html.indexOf('<' + media[i]) > -1) {
        return false;
      }
    }
    // 去掉所有空格
    let str = html.replace(/\s*/g, '');
    if (!str) {
      return true;
    }
    // 去掉所有&nbsp;
    str = str.replace(/&nbsp;/ig, '');
    if (!str) {
      return true;
    }
    // 去掉所有html标签
    str = str.replace(/<[^>]+>/g, '');
    return !str;
  },
  /**
   * 导出excel
   * @param XLSX XLSX对象
   * @param sheet 数组或sheet对象
   * @param sheetname 文件名称
   * @param type 文件格式
   */
  exportSheet(XLSX, sheet, sheetname, type) {
    if (!sheetname) {
      sheetname = 'sheet1';
    }
    if (!type) {
      type = 'xlsx';
    }
    if (Array.isArray(sheet)) {
      sheet = XLSX.utils.aoa_to_sheet(sheet);
    }
    let workbook = {
      SheetNames: [sheetname],
      Sheets: {}
    };
    workbook.Sheets[sheetname] = sheet;
    XLSX.writeFile(workbook, sheetname + '.' + type);
  },
  /**
   * 数字千分位
   * @param num
   * @returns {string}
   */
  formatNumber(num) {
    return String(num).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
  },
  /**
   * 判断是否是外链
   * @param url 地址
   * @returns {boolean}
   */
  isUrl(url) {
    return !!(url && (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('//')
    ));
  },
  /**
   * 常用颜色
   */
  beautifulColors: [
    'rgb(24,144,255)',
    'rgb(102,181,255)',
    'rgb(65, 217, 199)',
    'rgb(47, 194, 91)',
    'rgb(110, 219, 143)',
    'rgb(154, 230, 92)',
    'rgb(250, 204, 20)',
    'rgb(230, 150, 92)',
    'rgb(87, 173, 113)',
    'rgb(34, 50, 115)',
    'rgb(115, 138, 230)',
    'rgb(117, 100, 204)',
    'rgb(133, 67, 224)',
    'rgb(168, 119, 237)',
    'rgb(92, 142, 230)',
    'rgb(19, 194, 194)',
    'rgb(112, 224, 224)',
    'rgb(92, 163, 230)',
    'rgb(52, 54, 199)',
    'rgb(128, 130, 255)',
    'rgb(221, 129, 230)',
    'rgb(240, 72, 100)',
    'rgb(250, 125, 146)',
    'rgb(213, 152, 217)'
  ]
}
