/** 韩语 */
import lang from 'ant-design-vue/es/locale/ko_KR';

export default {
  ...lang,
  ele: {
    tabs: {
      reload: '새로 고침',
      fullscreen: '전체 화면',
      fullscreenExit: '전체 화면',
      closeLeft: '왼쪽 닫 기',
      closeRight: '오른쪽 닫 기',
      closeOther: '기타 닫 기',
      closeAll: '모두 닫 기'
    },
    setting: {
      title: '테마 설정',
      sideStyles: {
        dark: '어두운 사이드 바',
        light: '밝은 사이드 바'
      },
      headStyles: {
        light: '밝은 상단 바',
        dark: '어두운 상단 막대',
        primary: '기본 헤더'
      },
      layoutStyles: {
        side: '왼쪽 메뉴 레이아웃',
        top: '상위 메뉴 레이아웃',
        mix: '혼합 메뉴 레이아웃'
      },
      colors: {
        default: '새벽의 푸른',
        dust: '황혼',
        sunset: '선셋 오렌지',
        volcano: '화산',
        purple: '골든 퍼플',
        cyan: '청록색',
        green: '폴라 그린',
        geekblue: '괴짜 블루'
      },
      darkMode: '다크 모드 켜기',
      layoutStyle: '탐색 모드',
      sideMenuStyle: '사이드 바 더블 메뉴',
      bodyFull: '콘텐츠 영역 전체 화면',
      other: '기타 구성',
      fixedHeader: '고정 상단 바 영역',
      fixedSidebar: '고정 사이드 바 영역',
      fixedBody: '고정 컨텐츠 영역',
      logoAutoSize: '자동 로고 너비',
      colorfulIcon: '사이드 바 색상 아이콘',
      sideUniqueOpen: '메뉴 독점 확장',
      weakMode: '색 약화 모드 켜기',
      showFooter: '글로벌 바닥 글 켜기',
      showTabs: '여러 탭 열기',
      tabStyle: '탭 표시 스타일',
      tabStyles: {
        default: '기본',
        dot: '도트',
        card: '카드'
      },
      tips: '수정 후에는 로컬로 캐시되며 다음에 열 때 테마 구성이 기억됩니다.'
    },
    tableTools: {
      refresh: '최신 정보',
      size: '밀도',
      sizeOption: {
        large: '느슨하게',
        medium: '기본',
        small: '매질',
        mini: '콤팩트'
      },
      columns: '열 설정',
      columnsOption: {
        columns: '열 설정',
        reset: '초기화',
        index: '일련 번호',
        selection: '列选择',
        untitled: '제목 없음'
      },
      fullscreen: '전체 화면',

    },
    fileList: {
      selectAll: '모두 선택',
      selectTips: '선택된 {total} 파일/폴더',
      fileName: '파일 이름',
      fileSize: '크기',
      fileTimestamp: '수정 날짜'
    },
    cropper: {
      zoomIn: '크게 하다',
      zoomOut: '축소',
      rotateLeft: '왼쪽으로 회전',
      rotateRight: '오른쪽으로 회전',
      moveLeft: '왼쪽으로 이동',
      moveRight: '오른쪽으로 이동',
      moveUp: '이동',
      moveDown: '아래로 이동',
      flipX: '좌우로 뒤집기',
      flipY: '거꾸로 뒤집기',
      reset: '재시작',
      upload: '이미지 선택',
      ok: '확인',
      title: '사진 자르기'
    },
    map: {
      title: '지역 선택',
      placeholder: '입력하세요',
      message: '위치를 선택하려면 목록을 클릭하십시오',
      ok: '확인'
    }
  }
};
