/** 瑞典语 */
import lang from 'ant-design-vue/es/locale/sv_SE';

export default {
  ...lang,
  ele: {
    tabs: {
      reload: 'uppdatera',
      fullscreen: 'fullskärm',
      fullscreenExit: 'fullskärm',
      closeLeft: 'nära vänster',
      closeRight: 'nära höger',
      closeOther: 'nära andra',
      closeAll: 'Stäng alla'
    },
    setting: {
      title: 'temainställning',
      sideStyles: {
        dark: 'mörkt sidofält',
        light: 'lätt sidofält'
      },
      headStyles: {
        light: 'ljusrubrik',
        dark: 'mörk rubrik',
        primary: 'huvudrubrik'
      },
      layoutStyles: {
        side: 'sidmenylayout',
        top: 'toppmenylayout',
        mix: 'mixa meny layout'
      },
      colors: {
        default: 'daggry blå',
        dust: 'dammblått',
        sunset: 'solnedgång orange',
        volcano: 'vulkan',
        purple: 'gyllene lila',
        cyan: 'cyan',
        green: 'polargrön',
        geekblue: 'nördblått'
      },
      darkMode: 'mörkt läge',
      layoutStyle: 'navigationsläge',
      sideMenuStyle: 'Dubbla menyn i sidofältet',
      bodyFull: 'kroppens helskärm',
      other: 'annan inställning',
      fixedHeader: 'fast rubrik',
      fixedSidebar: 'fast sidofält',
      fixedBody: 'fast kropp',
      logoAutoSize: 'logotypanpassning',
      colorfulIcon: 'färgglada ikon',
      sideUniqueOpen: 'menyn unik öppen',
      weakMode: 'svagt läge',
      showFooter: 'visa sidfot',
      showTabs: 'visa flikar',
      tabStyle: 'flikstil',
      tabStyles: {
        default: 'standard',
        dot: 'punkt',
        card: 'kort'
      },
      tips: 'den kommer ihåg din konfiguration nästa gång du öppnar den.'
    },
    tableTools: {
      refresh: 'uppdatera',
      size: 'densitet',
      sizeOption: {
        large: 'lätt',
        medium: 'standard',
        small: 'sekundär',
        mini: 'kompakt'
      },
      columns: 'kolumner',
      columnsOption: {
        columns: 'kolumner',
        reset: 'återställa',
        index: 'tal',
        selection: 'urval',
        untitled: 'ofrälse'
      },
      fullscreen: 'fullskärm'
    },
    fileList: {
      selectAll: 'Välj alla',
      selectTips: 'vald {total} fil/katalog',
      fileName: 'namn',
      fileSize: 'storlek',
      fileTimestamp: 'Senast ändrad'
    },
    cropper: {
      zoomIn: 'zooma in',
      zoomOut: 'zooma ut',
      rotateLeft: 'rotera vänster',
      rotateRight: 'vrid höger',
      moveLeft: 'flytta vänster',
      moveRight: 'flytta höger',
      moveUp: 'flytta upp',
      moveDown: 'flytta ner',
      flipX: 'vänd x',
      flipY: 'vänd y',
      reset: 'återställa',
      upload: 'ladda upp',
      ok: 'OK',
      title: 'beskärare'
    },
    map: {
      title: 'adress',
      placeholder: 'ange nyckelord',
      message: 'vänligen välj en adress',
      ok: 'OK'
    }
  }
};
