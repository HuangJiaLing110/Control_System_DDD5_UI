<template>
  <a-page-header :ghost="false" title="复杂表单">
    <div class="ele-text-secondary">复杂表单常见于一次性输入和提交大批量数据的场景。</div>
  </a-page-header>
  <div class="ele-body ele-body-card" style="padding-bottom: 48px;">
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{md: {span: 6}, sm: {span: 24}}"
      :wrapper-col="{md: {span: 18}, sm: {span: 24}}">
      <a-card :bordered="false" title="仓库信息">
        <a-row :gutter="16">
          <a-col :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="仓库名:" name="name">
              <a-input
                v-model:value="form.name"
                placeholder="请输入仓库名"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="仓库域名:" name="url">
              <a-input
                v-model:value="form.url"
                placeholder="请输入"
                allow-clear
                addon-before="http://"
                addon-after=".com"/>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="仓库管理员:" name="administrator">
              <a-select
                v-model:value="form.administrator"
                placeholder="请选择仓库管理员"
                allow-clear>
                <a-select-option value="1">SunSmile</a-select-option>
                <a-select-option value="2">Jasmine</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="审批人:" name="approver">
              <a-select
                v-model:value="form.approver"
                placeholder="请选择审批人"
                allow-clear>
                <a-select-option value="1">SunSmile</a-select-option>
                <a-select-option value="2">Jasmine</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="生效日期:" name="datetime">
              <a-range-picker
                v-model:value="form.datetime"
                class="ele-fluid">
                <template #suffixIcon>
                  <calendar-outlined/>
                </template>
              </a-range-picker>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="仓库类型:" name="type">
              <a-select
                v-model:value="form.type"
                placeholder="请选择仓库类型"
                allow-clear>
                <a-select-option value="private">私密</a-select-option>
                <a-select-option value="public">公开</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card :bordered="false" title="任务信息">
        <a-row :gutter="16">
          <a-col :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="任务名:" name="task">
              <a-input
                v-model:value="form.task"
                placeholder="请输入任务名"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="任务表述:" name="description">
              <a-input
                v-model:value="form.description"
                placeholder="请输入任务表述"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="执行人:" name="executor">
              <a-select
                v-model:value="form.executor"
                placeholder="请选择执行人"
                allow-clear>
                <a-select-option value="1">SunSmile</a-select-option>
                <a-select-option value="2">Jasmine</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="责任人:" name="officer">
              <a-select
                v-model:value="form.officer"
                placeholder="请选择责任人"
                allow-clear>
                <a-select-option value="1">SunSmile</a-select-option>
                <a-select-option value="2">Jasmine</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="提醒时间:" name="reminder">
              <a-time-picker
                v-model:value="form.reminder"
                placeholder="请选择提醒时间"
                value-format="hh:mm:ss"
                class="ele-fluid"/>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="任务类型:" name="taskType">
              <a-select
                v-model:value="form.taskType"
                placeholder="请选择任务类型"
                allow-clear>
                <a-select-option value="1">私密</a-select-option>
                <a-select-option value="2">公开</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card :bordered="false" title="选择成员">
        <!-- 数据表格 -->
        <a-table
          :data-source="users"
          row-key="__index"
          size="middle"
          :pagination="false"
          :scroll="{x: 'max-content'}">
          <a-table-column
            data-index="__index"
            align="center"
            :width="58"/>
          <a-table-column
            title="用户名"
            data-index="name">
            <template #default="{text,index}">
              <a-input
                v-if="index===editIndex"
                v-model:value="editRow.name"
                placeholder="请输入用户名"/>
              <span v-else>{{ text }}</span>
            </template>
          </a-table-column>
          <a-table-column
            title="工号"
            data-index="number">
            <template #default="{text,index}">
              <a-input
                v-if="index===editIndex"
                v-model:value="editRow.number"
                placeholder="请输入工号"/>
              <span v-else>{{ text }}</span>
            </template>
          </a-table-column>
          <a-table-column
            title="所属部门"
            data-index="department">
            <template #default="{text,index}">
              <a-select
                v-if="index===editIndex"
                v-model:value="editRow.department"
                placeholder="请选择部门">
                <a-select-option value="研发部">研发部</a-select-option>
                <a-select-option value="测试部">测试部</a-select-option>
                <a-select-option value="产品部">产品部</a-select-option>
              </a-select>
              <span v-else>{{ text }}</span>
            </template>
          </a-table-column>
          <a-table-column
            title="操作"
            key="action"
            align="center"
            :width="160">
            <template #default="{index,record}">
              <a-space v-if="index===editIndex">
                <a @click="onSave(record, index)">保存</a>
                <a-divider type="vertical"/>
                <a @click="onCancel(record, index)">取消</a>
              </a-space>
              <a-space v-else>
                <a @click="onEdit(record, index)">修改</a>
                <a-divider type="vertical"/>
                <a-popconfirm
                  title="确定要删除此用户吗？"
                  @confirm="onRemove(record,index)">
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table-column>
        </a-table>
        <a-button
          block
          type="dashed"
          style="margin-top: 16px;"
          @click="addRow">
          <template #icon>
            <plus-outlined/>
          </template>
          <span>新增成员</span>
        </a-button>
      </a-card>
      <!-- 底部工具栏 -->
      <div class="ele-bottom-tool">
        <div v-if="validMsg" class="ele-text-danger">
          <close-circle-outlined/>
          <span>{{ validMsg }}</span>
        </div>
        <div class="ele-bottom-tool-actions">
          <a-button
            type="primary"
            :loading="loading"
            @click="submit">提交
          </a-button>
        </div>
      </div>
    </a-form>
  </div>
</template>

<script>
import {
  CalendarOutlined,
  PlusOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'FormAdvanced',
  components: {
    CalendarOutlined,
    PlusOutlined,
    CloseCircleOutlined
  },
  data() {
    return {
      // 加载状态
      loading: false,
      // 表单数据
      form: {
        name: '',
        url: '',
        datetime: [],
        task: '',
        description: '',
        reminder: ''
      },
      // 表单验证规则
      rules: {
        name: [
          {required: true, message: '请输入仓库名', type: 'string', trigger: 'blur'}
        ],
        url: [
          {required: true, message: '请输入仓库域名', type: 'string', trigger: 'blur'}
        ],
        administrator: [
          {required: true, message: '请选择仓库管理员', type: 'string', trigger: 'blur'}
        ],
        approver: [
          {required: true, message: '请选择审批人', type: 'string', trigger: 'blur'}
        ],
        datetime: [
          {required: true, message: '请选择生效日期', type: 'array', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择仓库类型', type: 'string', trigger: 'blur'}
        ],
        task: [
          {required: true, message: '请输入任务名', type: 'string', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入任务表述', type: 'string', trigger: 'blur'}
        ],
        executor: [
          {required: true, message: '请选择执行人', type: 'string', trigger: 'blur'}
        ],
        officer: [
          {required: true, message: '请选择责任人', type: 'string', trigger: 'blur'}
        ],
        reminder: [
          {required: true, message: '请选择提醒时间', type: 'string', trigger: 'blur'}
        ],
        taskType: [
          {required: true, message: '请选择任务类型', type: 'string', trigger: 'blur'}
        ]
      },
      // 用户列表
      users: [
        {__index: 1, name: 'John Brown', number: '00001', department: '研发部'},
        {__index: 2, name: 'Jim Green', number: '00002', department: '产品部'},
        {__index: 3, name: 'Joe Black', number: '00003', department: '产品部'}
      ],
      // 表单验证失败提示信息
      validMsg: '',
      // 表格编辑行索引
      editIndex: null,
      // 表格编辑行数据
      editRow: {}
    };
  },
  methods: {
    /* 表单提交 */
    submit() {
      this.$refs.form.validate().then(() => {
        this.validMsg = '';
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.$message.success('提交成功');
        }, 1500);
      }).catch((e) => {
        this.validMsg = ` 共有 ${e.errorFields.length} 项校验不通过`;
      });
    },
    /* 添加一行 */
    addRow() {
      if (this.users.length && this.users[this.users.length - 1].__is_add) {
        return;
      }
      this.editRow = {
        __is_add: true,  // 此字段标识为添加状态
        __index: this.users.length + 1  // 此字段标识索引
      };
      this.editIndex = this.users.length;
      this.users.push(this.editRow);
    },
    /* 修改行 */
    onEdit(row, index) {
      this.editIndex = index;
      this.editRow = Object.assign({}, row);
    },
    /* 删除行 */
    onRemove(row, index) {
      this.users.splice(index, 1);  // 删除数据
      // 重置__index
      this.users = this.users.map((d, index) => {
        return Object.assign({}, d, {
          __index: index + 1
        });
      })
      // 如果需要请求接口删除可以在这里写
    },
    /* 保存编辑 */
    onSave(row, index) {
      if (!this.editRow.name) {
        this.$message.error('请输入用户');
        return;
      }
      if (!this.editRow.number) {
        this.$message.error('请输入工号');
        return;
      }
      if (!this.editRow.department) {
        this.$message.error('请选择部门');
        return;
      }
      this.users[index] = Object.assign({}, this.editRow, {
        __is_add: null
      });
      this.editIndex = null;
      this.editRow = {};
      // 如果需要请求接口保存可以在这里写
    },
    /* 取消编辑 */
    onCancel(row, index) {
      if (row.__is_add) {
        this.users.splice(index, 1);
      }
      this.editIndex = null;
      this.editRow = {};
    }
  }
}
</script>

<style scoped>
</style>
