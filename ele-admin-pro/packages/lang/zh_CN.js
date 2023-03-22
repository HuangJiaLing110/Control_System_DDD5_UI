/** 简体中文 */
import lang from 'ant-design-vue/es/locale/zh_CN';

export default {
  ...lang,
  ele: {
    tabs: {
      reload: '刷新当前',
      fullscreen: '内容全屏',
      fullscreenExit: '退出全屏',
      closeLeft: '关闭左侧',
      closeRight: '关闭右侧',
      closeOther: '关闭其他',
      closeAll: '关闭全部'
    },
    setting: {
      title: '整体风格设置',
      sideStyles: {
        dark: '暗色侧边栏',
        light: '亮色侧边栏'
      },
      headStyles: {
        light: '亮色顶栏',
        dark: '暗色顶栏',
        primary: '主色顶栏'
      },
      layoutStyles: {
        side: '左侧菜单布局',
        top: '顶部菜单布局',
        mix: '混合菜单布局'
      },
      colors: {
        default: '拂晓蓝',
        dust: '薄暮',
        sunset: '日暮',
        volcano: '火山',
        purple: '酱紫',
        cyan: '明青',
        green: '极光绿',
        geekblue: '极客蓝'
      },
      darkMode: '开启暗黑模式',
      layoutStyle: '导航模式',
      sideMenuStyle: '侧栏双排菜单',
      bodyFull: '内容区域铺满',
      other: '其它配置',
      fixedHeader: '固定顶栏区域',
      fixedSidebar: '固定侧栏区域',
      fixedBody: '固定主体区域',
      logoAutoSize: 'Logo宽度自动',
      colorfulIcon: '侧栏彩色图标',
      sideUniqueOpen: '侧栏排他展开',
      weakMode: '开启色弱模式',
      showFooter: '开启全局页脚',
      showTabs: '开启多页签栏',
      tabStyle: '页签显示风格',
      tabStyles: {
        default: '默认',
        dot: '圆点',
        card: '卡片'
      },
      tips: '该功能可实时预览各种布局效果, 修改后会缓存在本地, 下次打开会记忆主题配置.'
    },
    tableTools: {
      refresh: '刷新',
      size: '密度',
      sizeOption: {
        large: '宽松',
        medium: '默认',
        small: '中等',
        mini: '紧凑'
      },
      columns: '列设置',
      columnsOption: {
        columns: '列展示',
        reset: '重置',
        index: '序号',
        selection: '选择列',
        untitled: '无标题'
      },
      fullscreen: '全屏'
    },
    fileList: {
      selectAll: '全选',
      selectTips: '已选中 {total} 个文件/文件夹',
      fileName: '文件名',
      fileSize: '大小',
      fileTimestamp: '修改日期'
    },
    cropper: {
      zoomIn: '放大',
      zoomOut: '缩小',
      rotateLeft: '向左旋转',
      rotateRight: '向右旋转',
      moveLeft: '左移',
      moveRight: '右移',
      moveUp: '上移',
      moveDown: '下移',
      flipX: '左右翻转',
      flipY: '上下翻转',
      reset: '重新开始',
      upload: '选择图片',
      ok: '完成',
      title: '裁剪图片'
    },
    map: {
      title: '选择位置',
      placeholder: '输入关键字搜索',
      message: '请点击列表选中位置',
      ok: '确定'
    }
  }
};
