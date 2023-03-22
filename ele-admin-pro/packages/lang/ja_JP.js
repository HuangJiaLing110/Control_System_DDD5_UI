/** 日语 */
import lang from 'ant-design-vue/es/locale/ja_JP';

export default {
  ...lang,
  ele: {
    tabs: {
      reload: '現在を更新',
      fullscreen: 'フルスクリーン',
      fullscreenExit: 'フルスクリーン',
      closeLeft: '左を閉じる',
      closeRight: '右側を閉じる',
      closeOther: 'その他を閉じる',
      closeAll: 'すべてを閉じる'
    },
    setting: {
      title: 'テーマの設定',
      sideStyles: {
        dark: '暗いサイドバー',
        light: '明るいサイドバー'
      },
      headStyles: {
        light: '明るいトップバー',
        dark: '暗いトップバー',
        primary: 'カラートップバー'
      },
      layoutStyles: {
        side: '左メニューレイアウト',
        top: 'トップメニューレイアウト',
        mix: 'ミックスメニューレイアウト'
      },
      colors: {
        default: '明けの空',
        dust: '夕暮れ',
        sunset: '日が暮れる',
        volcano: '火山',
        purple: '濃い紫色',
        cyan: '明るい青',
        green: '极光绿',
        geekblue: '极客蓝'
      },
      darkMode: '暗黒モード',
      layoutStyle: 'ナビゲーションモード',
      sideMenuStyle: 'サイドバーダブルメニュー',
      bodyFull: '内容がしきつめる',
      other: 'その他の設定',
      fixedHeader: 'トップバーを固定',
      fixedSidebar: 'サイドバーを固定する',
      fixedBody: '本体を固定する',
      logoAutoSize: 'Logo幅適応',
      colorfulIcon: 'カラーバーのアイコン',
      sideUniqueOpen: '横の列を彼が広げます',
      weakMode: '色弱モード',
      showFooter: 'グローバルフッタ',
      showTabs: '複数ページの欄',
      tabStyle: 'ページスタイル',
      tabStyles: {
        default: 'デフォルト',
        dot: '円点',
        card: 'カード'
      },
      tips: '修正後はローカルにキャッシュされます。今度はテーマ設定を記憶します。'
    },
    tableTools: {
      refresh: '更新',
      size: '密度',
      sizeOption: {
        large: '緩い',
        medium: 'デフォルト',
        small: '中ぐらい',
        mini: 'コンパクト'
      },
      columns: '列の設定',
      columnsOption: {
        columns: '列の展示',
        reset: 'リセット',
        index: '番号付け',
        selection: '列を選択',
        untitled: 'タイトルなし'
      },
      fullscreen: 'フルスクリーン',

    },
    fileList: {
      selectAll: 'すべて選択',
      selectTips: '選択されました {total} ファイル/フォルダ',
      fileName: '名前',
      fileSize: 'サイズ',
      fileTimestamp: '変更日'
    },
    cropper: {
      zoomIn: '拡大',
      zoomOut: '縮小',
      rotateLeft: '左に回る',
      rotateRight: '右に回転',
      moveLeft: '左に移動',
      moveRight: '右に移動',
      moveUp: '上へ移動',
      moveDown: '下に移動',
      flipX: '左右反転',
      flipY: '上下反転',
      reset: '新たに始める',
      upload: '画像を選択',
      ok: '確認',
      title: '画像を切り取り'
    },
    map: {
      title: '場所を選択',
      placeholder: 'キーワードを入力',
      message: 'リストの選択位置をクリックしてください',
      ok: '確認'
    }
  }
};
