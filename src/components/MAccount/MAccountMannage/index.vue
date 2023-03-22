<template>

  <!--  <vxe-table-->
  <!--    border-->
  <!--    show-header-overflow-->
  <!--    show-overflow-->
  <!--    resizable-->
  <!--    keep-source-->
  <!--    highlight-hover-row-->
  <!--    id="accountTable"-->
  <!--    ref="accountTable"-->
  <!--    align="center"-->
  <!--    :tooltip-config="tableConfig.tableTooltipConfig"-->
  <!--    :keyboard-config="tableConfig.tableKeyboardConfig"-->
  <!--    :data="accountList"-->
  <!--    :mouse-config="{selected: true}"-->
  <!--    :checkbox-config="{range: true}"-->
  <!--    :edit-config="tableConfig.tableEditConfig"-->
  <!--    :edit-rules="tableConfig.validRules"-->

  <!--  >-->

  <!--    <vxe-table-column field="bankAccount" title="银行账号" min-width="400"-->
  <!--                      :edit-render="{name: 'input', attrs: {type: 'text'}}"-->
  <!--                      fixed="left"></vxe-table-column>-->
  <!--    <vxe-table-column field="name" title="账号名" min-width="250"-->
  <!--                      :edit-render="{name: 'input', attrs: {type: 'text'}}"></vxe-table-column>-->
  <!--    <vxe-table-column field="bank" title="开户银行" min-width="400"-->
  <!--                      :edit-render="{name: 'input', attrs: {type: 'text'}}"></vxe-table-column>-->

  <!--    <vxe-table-column title="状态" show-overflow min-width="90" fixed="right">-->
  <!--      <template #default="{row}" v-if="isDetail">-->
  <!--        {{row.status}}-->
  <!--      </template>-->
  <!--      <template #default="{row}" v-else>-->
  <!--        <vxe-button type="button"-->
  <!--                    status="danger"-->
  <!--                    style="height: 28px;padding-bottom: 3px;"-->
  <!--                    v-if="row.status==='停用'"-->
  <!--                    @click="changeStatus(row)">停用-->
  <!--        </vxe-button>-->
  <!--        <vxe-button type="button"-->
  <!--                    status="success"-->
  <!--                    style="height: 28px;-->
  <!--    padding-bottom: 3px;-->
  <!--}"-->
  <!--                    v-if="row.status==='启用'"-->
  <!--                    @click="changeStatus(row)">启用-->
  <!--        </vxe-button>-->
  <!--      </template>-->
  <!--    </vxe-table-column>-->

  <!--    <vxe-column title="操作" show-overflow fixed="right" min-width="110" v-if="!isDetail">-->
  <!--      <template #header>-->
  <!--        <vxe-button icon="fa fa-plus" @click="insertEvent()">      <span style="-->
  <!--    position: relative;-->
  <!--    bottom: 1px;">-->
  <!--        新增-->
  <!--      </span></vxe-button>-->
  <!--      </template>-->
  <!--      <template #default="{ row }">-->
  <!--        <a-popconfirm-->
  <!--          title="确定要删除此账户吗？"-->
  <!--          @confirm="removeEvent(row)">-->
  <!--          <vxe-button icon="fa fa-trash" title="删除" circle ></vxe-button>-->
  <!--        </a-popconfirm>-->

  <!--      </template>-->
  <!--    </vxe-column>-->

  <!--  </vxe-table>-->

  <vxe-grid
    id="accountTable"
    ref="accountTable"
    v-bind="tableConfig"
    :edit-rules="tableConfig.editRules"
    :data="accountList"
  >
    <template #component_title >
        <span style="color: black;font-size: 15px;font-weight: bolder !important;">
          <i class="fa fa-pencil-square-o" aria-hidden="true">&nbsp;
          </i>账户管理</span>
    </template>
    <template #tool_button>
      <vxe-button
        title="新增账户"
        style="padding-top: 3px;padding-left: 7px;margin-right:10px "
        icon="fa fa-plus"
        name="新增账户"
        @click="insertEvent(-1)"
        circle v-if="!isDetail">
      </vxe-button>
    </template>

    <template #status="{row}">
      <div v-if="isDetail">
        <a-tag v-if="row.status==='启用'" color="green">{{row.status}}</a-tag>
        <a-tag v-if="row.status==='停用'" color="red">{{row.status}}</a-tag>
      </div>
      <div v-else>
        <vxe-button type="button"
                    status="danger"
                    style="height: 28px;padding-bottom: 3px;"
                    v-if="row.status==='停用'"
                    @click="changeStatus(row)">停用
        </vxe-button>
        <vxe-button type="button"
                    status="success"
                    style="height: 28px;padding-bottom: 3px;"
                    v-if="row.status==='启用'"
                    @click="changeStatus(row)">启用
        </vxe-button>
      </div>
    </template>

    <template #operate="{ row }">
      <a-space>
        <a-popconfirm
          title="确定要删除此账户吗？"
          @confirm="removeEvent(row)">
          <vxe-button icon="fa fa-trash" title="删除" circle></vxe-button>
        </a-popconfirm>
      </a-space>
    </template>
  </vxe-grid>

</template>

<script>
import {defineComponent} from 'vue'
import AccountMapMannage from './js/index.js'

export default defineComponent({
  name: "MAccountMannage",
  props: {
    entity: String,
    businessId: String,
    isDetail: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    accounts: Array,
    height:String,
  },
  components: {},
  setup(props, context) {
    const {
      changeStatus,
      accountTable,
      accountList,
      reload,
      accountChange,
      insertEvent,
      removeEvent,
      getAccountList,
      tableConfig,
      validAccounts,
    } = AccountMapMannage(props, context)



    return {
      validAccounts,
      changeStatus,
      tableConfig,
      accountTable,
      accountList,
      reload,
      accountChange,
      insertEvent,
      removeEvent,
      getAccountList,

    }

  },

})
</script>

<style>
.vxe-toolbar-mt {
  padding: 0 10px;
  background-color: #f6f6f6 !important;
}
</style>
