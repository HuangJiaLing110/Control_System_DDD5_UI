/** 繁体中文 */
import lang from 'ant-design-vue/es/locale/zh_TW';

export default {
  ...lang,
  ele: {
    tabs: {
      reload: '重繪當前',
      fullscreen: '内容全屏',
      fullscreenExit: '退出全屏',
      closeLeft: '關閉左側',
      closeRight: '關閉右側',
      closeOther: '關閉其他',
      closeAll: '關閉全部'
    },
    setting: {
      title: '整體風格設定',
      sideStyles: {
        dark: '暗色側邊欄',
        light: '亮色側邊欄'
      },
      headStyles: {
        light: '亮色頂欄',
        dark: '暗色頂欄',
        primary: '主色頂欄'
      },
      layoutStyles: {
        side: '左側選單佈局',
        top: '頂部選單佈局',
        mix: '混合選單佈局'
      },
      colors: {
        default: '拂曉藍',
        dust: '薄暮',
        sunset: '日暮',
        volcano: '火山',
        purple: '醬紫',
        cyan: '明青',
        green: '極光綠',
        geekblue: '極客藍'
      },
      darkMode: '開啟暗黑模式',
      layoutStyle: '導航模式',
      sideMenuStyle: '側欄雙排選單',
      bodyFull: '內容區域鋪滿',
      other: '其它配寘',
      fixedHeader: '固定頂欄區域',
      fixedSidebar: '固定側欄區域',
      fixedBody: '固定主體區域',
      logoAutoSize: 'Logo寬度自動',
      colorfulIcon: '側欄彩色圖標',
      sideUniqueOpen: '側欄排他展開',
      weakMode: '開啟色弱模式',
      showFooter: '開啟全域頁腳',
      showTabs: '開啟多頁簽欄',
      tabStyle: '頁簽顯示風格',
      tabStyles: {
        default: '默認',
        dot: '圓點',
        card: '卡片'
      },
      tips: '該功能可實时預覽各種佈局效果，修改後會緩存在本地，下次打開會記憶主題配寘.'
    },
    tableTools: {
      refresh: '重繪',
      size: '密度',
      sizeOption: {
        large: '寬鬆',
        medium: '默認',
        small: '中等',
        mini: '緊湊'
      },
      columns: '列設定',
      columnsOption: {
        columns: '列展示',
        reset: '重置',
        index: '序號',
        selection: '選擇列',
        untitled: '無標題'
      },
      fullscreen: '全屏'
    },
    fileList: {
      selectAll: '全選',
      selectTips: '已選中 {total} 個檔案/資料夾',
      fileName: '檔名',
      fileSize: '大小',
      fileTimestamp: '修改日期'
    },
    cropper: {
      zoomIn: '放大',
      zoomOut: '縮小',
      rotateLeft: '向左旋轉',
      rotateRight: '向右旋轉',
      moveLeft: '左移',
      moveRight: '右移',
      moveUp: '上移',
      moveDown: '下移',
      flipX: '左右翻轉',
      flipY: '上下翻轉',
      reset: '重新開始',
      upload: '選擇圖片',
      ok: '完成',
      title: '裁剪圖片'
    },
    map: {
      title: '選擇位置',
      placeholder: '輸入關鍵字蒐索',
      message: '請點擊清單選中位置',
      ok: '確認'
    }
  }
};
