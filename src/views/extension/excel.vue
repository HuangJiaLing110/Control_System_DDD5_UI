<template>
  <div class="ele-body ele-body-card">
    <a-card title="导出excel" :bordered="false">
      <!-- 表格 -->
      <ele-pro-table
        bordered
        row-key="key"
        :datasource="data"
        :columns="columns"
        :need-page="false"
        tools-theme="default"
        v-model:selection="selection"
        :toolkit="['size', 'columns', 'fullscreen']"
        :scroll="{x: 'max-content'}">
        <template #toolbar>
          <a-space>
            <a-button
              type="primary"
              @click="exportBas">导出excel
            </a-button>
            <a-button
              type="primary"
              @click="exportAdv">导出带合并
            </a-button>
            <a-button
              type="primary"
              @click="exportSel">导出选中
            </a-button>
          </a-space>
        </template>
      </ele-pro-table>
    </a-card>
    <a-card title="导入excel" :bordered="false">
      <!-- 操作按钮 -->
      <ele-toolbar :tools="[]">
        <a-space>
          <a-upload
            :before-upload="importFile"
            :show-upload-list="false"
            accept=".xls,.xlsx,.csv">
            <a-button type="primary">导入excel</a-button>
          </a-upload>
          <a-upload
            :before-upload="importFile2"
            :show-upload-list="false"
            accept=".xls,.xlsx,.csv">
            <a-button type="primary">导入拆分合并</a-button>
          </a-upload>
          <a-upload
            :before-upload="importFile3"
            :show-upload-list="false"
            accept=".xls,.xlsx,.csv">
            <a-button type="primary">导入保持合并</a-button>
          </a-upload>
        </a-space>
      </ele-toolbar>
      <div class="ant-table ant-table-middle ant-table-bordered">
        <div class="ant-table-content">
          <div class="ant-table-body">
            <table>
              <thead class="ant-table-thead">
              <tr>
                <th></th>
                <th
                  v-for="item in importTitle"
                  :key="item"
                  style="text-align: center;">
                  {{ item }}
                </th>
              </tr>
              </thead>
              <tbody class="ant-table-tbody">
              <tr v-for="(item,index) in importData" :key="index">
                <td style="text-align: center;">{{ index + 1 }}</td>
                <template v-for="key in importTitle">
                  <td
                    v-if="item['__colspan__'+key]!==0&&item['__rowspan__'+key]!==0"
                    :key="key"
                    :colspan="item['__colspan__'+key]"
                    :rowspan="item['__rowspan__'+key]"
                    style="text-align: center;">
                    {{ item[key] }}
                  </td>
                </template>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <a-row :gutter="32">
        <a-col :md="12" :xs="24">
          <div style="margin:16px 0;">二维数组格式数据：</div>
          <pre
            style="max-height: 300px;padding: 16px;overflow: auto;"
            class="ele-bg-base">{{ JSON.stringify(importDataAoa, null, 4) }}
          </pre>
        </a-col>
        <a-col :md="12" :xs="24">
          <div style="margin: 16px 0;">JSON格式数据：</div>
          <pre
            style="max-height: 300px;padding: 16px;overflow: auto;"
            class="ele-bg-base">{{ JSON.stringify(importData, null, 4) }}
          </pre>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import XLSX from 'xlsx';

export default {
  name: 'ExtensionExcel',
  data() {
    return {
      // 表格数据
      data: [
        {
          key: 1,
          username: '张小三',
          amount: 18,
          province: '浙江',
          city: '杭州',
          zone: '西湖区',
          street: '西溪街道',
          address: '西溪花园30栋1单元',
        },
        {
          key: 2,
          username: '李小四',
          amount: 39,
          province: '江苏',
          city: '苏州',
          zone: '姑苏区',
          street: '丝绸路',
          address: '天墅之城9幢2单元',
        },
        {
          key: 3,
          username: '王小五',
          amount: 8,
          province: '江西',
          city: '南昌',
          zone: '青山湖区',
          street: '艾溪湖办事处',
          address: '中兴和园1幢3单元',
        },
        {
          key: 4,
          username: '赵小六',
          amount: 16,
          province: '福建',
          city: '泉州',
          zone: '丰泽区',
          street: '南洋街道',
          address: '南洋村6幢1单元',
        },
        {
          key: 5,
          username: '孙小七',
          amount: 12,
          province: '湖北',
          city: '武汉',
          zone: '武昌区',
          street: '武昌大道',
          address: '两湖花园16幢2单元',
        },
        {
          key: 6,
          username: '周小八',
          amount: 11,
          province: '安徽',
          city: '黄山',
          zone: '黄山区',
          street: '汤口镇',
          address: '温泉村21号',
        }
      ],
      // 表格列配置
      columns: [
        {
          key: 'index',
          customRender: ({index}) => `${index + 1}`,
          align: 'center'
        },
        {
          title: '用户名',
          dataIndex: 'username',
          align: 'center'
        },
        {
          title: '地址',
          key: 'cityAddress',
          children: [
            {
              title: '省',
              dataIndex: 'province',
              align: 'center'
            },
            {
              title: '市',
              dataIndex: 'city',
              align: 'center'
            },
            {
              title: '区',
              dataIndex: 'zone',
              align: 'center'
            },
            {
              title: '街道',
              dataIndex: 'street',
              align: 'center'
            },
            {
              title: '详细地址',
              dataIndex: 'address',
              align: 'center'
            }
          ]
        },
        {
          title: '金额',
          dataIndex: 'amount',
          align: 'center'
        }
      ],
      // 选中数据
      selection: [],
      // 导入的数据
      importData: [],
      // 导入数据的列
      importTitle: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      // 导入数据二维数组形式
      importDataAoa: []
    };
  },
  methods: {
    /* 导出excel */
    exportBas() {
      let array = [['用户名', '省', '市', '区', '街道', '详细地址', '金额']];
      this.data.forEach(d => {
        array.push([d.username, d.province, d.city, d.zone, d.street, d.address, d.amount]);
      });
      this.$util.exportSheet(XLSX, array, '用户数据');
    },
    /* 导出带单元格合并 */
    exportAdv() {
      let array = [
        ['用户名', '地址', null, null, null, null, '金额'],
        [null, '省', '市', '区', '街道', '详细地址', null]
      ];
      this.data.forEach(d => {
        array.push([d.username, d.province, d.city, d.zone, d.street, d.address, d.amount]);
      });
      let sheet = XLSX.utils.aoa_to_sheet(array);
      sheet['!merges'] = [
        {s: {r: 0, c: 1}, e: {r: 0, c: 5}},  // 合并第0行第1列到第0行第5列
        {s: {r: 0, c: 0}, e: {r: 1, c: 0}},  // 合并第0行第0列到第1行第0列
        {s: {r: 0, c: 6}, e: {r: 1, c: 6}}  // 合并第0行第6列到第1行第6列
      ];
      this.$util.exportSheet(XLSX, sheet, '用户数据');
    },
    /* 导出选中数据 */
    exportSel() {
      if (this.selection.length === 0) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      let array = [['用户名', '省', '市', '区', '街道', '详细地址', '金额']];
      this.selection.forEach(d => {
        array.push([d.username, d.province, d.city, d.zone, d.street, d.address, d.amount]);
      });
      this.$util.exportSheet(XLSX, array, '用户数据');
    },
    /* 导入本地excel文件 */
    importFile(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, {type: 'array'});
        let sheetNames = workbook.SheetNames;
        let worksheet = workbook.Sheets[sheetNames[0]];
        // 解析成二维数组
        let aoa = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        // 生成表格需要的数据
        let list = [], maxCols = 0, title = [];
        aoa.forEach(d => {
          if (d.length > maxCols) {
            maxCols = d.length;
          }
          let row = {};
          for (let i = 0; i < d.length; i++) {
            let key = this.getCharByIndex(i);
            row[key] = d[i];
            row['__colspan__' + key] = 1;
            row['__rowspan__' + key] = 1;
          }
          list.push(row);
        });
        for (let i = 0; i < maxCols; i++) {
          title.push(this.getCharByIndex(i));
        }
        this.importTitle = title;
        this.importData = list;
        this.importDataAoa = aoa;
      };
      reader.readAsArrayBuffer(file);
      return false;
    },
    /* 导入excel拆分合并单元格 */
    importFile2(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, {type: 'array'});
        let sheetNames = workbook.SheetNames;
        let worksheet = workbook.Sheets[sheetNames[0]];
        // 解析成二维数组
        let aoa = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        // 拆分合并单元格
        if (worksheet['!merges']) {
          worksheet['!merges'].forEach(m => {
            for (let r = m.s.r; r <= m.e.r; r++) {
              for (let c = m.s.c; c <= m.e.c; c++) {
                aoa[r][c] = aoa[m.s.r][m.s.c];
              }
            }
          });
        }
        // 生成表格需要的数据
        let list = [], maxCols = 0, title = [];
        aoa.forEach(d => {
          if (d.length > maxCols) {
            maxCols = d.length;
          }
          let row = {};
          for (let i = 0; i < d.length; i++) {
            row[this.getCharByIndex(i)] = d[i];
          }
          list.push(row);
        });
        for (let i = 0; i < maxCols; i++) {
          title.push(this.getCharByIndex(i));
        }
        this.importTitle = title;
        this.importData = list;
        this.importDataAoa = aoa;
      };
      reader.readAsArrayBuffer(file);
      return false;
    },
    /* 导入excel读取合并信息 */
    importFile3(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, {type: 'array'});
        let sheetNames = workbook.SheetNames;
        let worksheet = workbook.Sheets[sheetNames[0]];
        // 解析成二维数组
        let aoa = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        // 生成表格需要的数据
        let list = [], maxCols = 0, title = [];
        aoa.forEach(d => {
          if (d.length > maxCols) {
            maxCols = d.length;
          }
          let row = {};
          for (let i = 0; i < d.length; i++) {
            row[this.getCharByIndex(i)] = d[i];
          }
          list.push(row);
        });
        for (let i = 0; i < maxCols; i++) {
          title.push(this.getCharByIndex(i));
        }
        // 记录合并单元格
        if (worksheet['!merges']) {
          worksheet['!merges'].forEach(m => {
            for (let r = m.s.r; r <= m.e.r; r++) {
              for (let c = m.s.c; c <= m.e.c; c++) {
                let cc = this.getCharByIndex(c);
                list[r]['__colspan__' + cc] = 0;
                list[r]['__rowspan__' + cc] = 0;
              }
            }
            let char = this.getCharByIndex(m.s.c);
            list[m.s.r]['__colspan__' + char] = m.e.c - m.s.c + 1;
            list[m.s.r]['__rowspan__' + char] = m.e.r - m.s.r + 1;
          });
        }
        this.importTitle = title;
        this.importData = list;
        this.importDataAoa = aoa;
      };
      reader.readAsArrayBuffer(file);
      return false;
    },
    /* 生成Excel列字母序号 */
    getCharByIndex(index) {
      let chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      if (index < chars.length) {
        return chars[index];
      }
      let n = parseInt(index / chars.length),
        m = index % chars.length;
      return chars[n] + chars[m];
    }
  }
}
</script>

<style scoped>
</style>
