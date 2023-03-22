import {ref, reactive, onMounted} from 'vue'
// import {message} from "ant-design-vue";
// import {AccountService} from "@/views/erp/system/account/accountService";
// import {VXETable} from 'vxe-table'
// import validate from "ele-admin-pro/packages/validate";

export default function AccountMapMannage(props) {
  let id = 0;
  //vxeTable的映射对象
  const accountTable = ref({})

  let isDetail = ref(props.isDetail);

  //编辑组件的映射的映射对象
  const editTable = ref({})
  //需要传递给编辑组件的类信息
  let accountEntityData = reactive({name: '', entityName: '', businessId: null, bank: '', bankAccount: ''});

  //管理列表展示
  let accountList = ref([]);


  let business = reactive({businessId: props.businessId, entityName: props.entity})

  let accountsTemp = ref(props.accounts);

  const validAccounts = async () => {
    const $table = accountTable.value
    console.log("accountMap", accountMap)

    accountMap = reactive({})

    const errMap = await $table.validate(true).catch(errMap => errMap)
    console.log("errorMap", errMap)
    if (errMap) {
      // VXETable.modal.message({status: 'error', content: '账户校验不通过！'})
      return false
    } else {
      // VXETable.modal.message({status: 'success', content: '账户校验成功！'})
      return true
    }
  }

  const tableConfig = {
    border: true,
    showHeaderOverflow: true,
    showOverflow: true,
    resizeable: true,
    keepSource: true,
    highlightHoverRow: true,
    align: "center",


    columns: [
      {
        field: 'name',
        title: '账户名',
        minWidth: "20%",
        fixed: "left",
        editRender: {name: 'input', attrs: {type: 'text'},placeholder: '请点击输入账户名'},

      },
      {
        field: 'bankAccount',
        title: '银行账号',
        minWidth: "30%",
        editRender: {name: 'input', attrs: {type: 'text'},placeholder: '请点击输入银行账号'},
      },
      {
        field: 'bank',
        title: '开户银行',
        minWidth: "20%",
        editRender: {
          name: 'input',
          attrs: {type: 'text'},
          placeholder: '请点击输入开户银行',
          events: {blur:()=>{console.log("ii")}},
        },
      },
      {
        title: "状态",
        minWidth: "10%",
        slots: {default: 'status'},
        fixed: 'right'
      },

    ],

    keyboardConfig: {
      isArrow: true,
      isDel: true,
      isEnter: true,
      isTab: true,
      isEdit: true,
      editMethod({row, column}) {
        const $table = accountTable.value
        accountMap[row.bankAccount] = undefined

        // 重写默认的覆盖式，改为追加式
        if (row.status !== "停用" && !isDetail.value) {
          $table.setActiveCell(row, column)
        }
      }

    },

    // validConfig:{
    //   autoPos:false
    // },


    //表格编辑设置
    editConfig: {
      trigger: 'dblclick',
      mode: 'cell',
      showStatus: true,
      icon: "fa fa-edit",
      showIcon: true,
      activeMethod({row}) {
        accountMap[row.bankAccount] = undefined
        return row.status !== "停用" && !isDetail.value;
      }
    },
    mouseConfig: {
      selected: true
    },
    //todo :表格内容注释设置

    tooltipConfig: {
      showAll: true,
      enterable: true,
    },

    //todo 工具栏
    toolbarConfig: {
      className: 'vxe-toolbar-mt',
      slots: {buttons: 'component_title', tools: 'tool_button'},
      refresh: false,
      import: false,
      export: false,
      print: false,
      zoom: true,
      custom: false
    },

    editRules: {
      name: [
        {
          required: true,
          type: "string",
          message: '账户名称必须输入',
          trigger: 'blur',
          // trigger: "onSubmit"
        },
      ],
      bank: [
        {
          required: true,
          type: "string",
          message: "银行名称必须输入",
          trigger: 'blur',
        }
      ],
      bankAccount: [{
        required: true,
        type: "string",
        message: '银行账号必须填写',
        validator({cellValue}) {
          // let message = validate.bankAccountValid(cellValue)
          console.log("map", accountMap);

          if (accountMap[cellValue]) {
            return new Error("同一个业务存在相同银行账号")
          } else {
            accountMap[cellValue] = cellValue
          }
          // if (message !== "账户校验成功") {
          //   return new Error(message)
          // }
        },
        trigger: "blur",
      },],
    },


  }

  //为只读状态下隐藏操作按钮
  if (!isDetail.value) {
    tableConfig.columns.push({
      title: '操作',
      minWidth: "12%",
      slots: {default: 'operate'},
      fixed: 'right'
    })
  }


  const changeHeight = (tableHeight) => {
    if (tableHeight) {
      tableConfig.height = tableHeight;
    }
  }

  changeHeight(props.height);

  //渲染表格
  onMounted(() => {
    if (accountsTemp.value) {
      accountChange(accountsTemp.value)
    } else {
      reload(business);
    }
  })

  //页面的重载
  let reload = (business) => {
    console.log(business)
    const conditions = {
      entityName: business.entityName,
      businessId: business.businessId,
      status: "启用$|$停用"
    }

    const queryParams = {}
    //获取筛选结果（无懒加载）
    queryParams.filters = conditions

    //该方法所有语句结束后执行
    // AccountService.findAccounts(queryParams).then((res) => {
    //   console.log("findAccounts", res)
    //   res.data.datas.forEach((item) => {
    //     accountMap[item.bankAccount] = item.bankAccount;
    //   })
    //   accountChange(res.data.datas)
    //
    //   //vxetable的data改变，但未渲染到对应的表格中
    //   // accountList.value.push({})
    //   // accountChange(accountList.value)
    // }).catch((error) => {
    //   message.error(error.message);
    // })

  }

  //合并新数组到旧数组，新数组全部保留，旧数组只保留新增的部分,即eid为空的对象
  let accountChange = (accounts) => {
    for (let i = 0; i < accounts.length; i++) {
      accounts[i].id = id++;
      accounts[i] = reactive(accounts[i])
    }

    let list = accounts;
    console.log("当前数组为", accountList.value)
    for (let i = 0; i < accountList.value.length; i++) {
      let item = reactive(accountList.value[i])
      // console.log("item", item)
      if ((item.eid === undefined || item.eid === null) && item.bankAccount !== undefined) {
        item.id = id++
        list.push(item);
      }
    }

    accountList.value = list;

    console.log("accountList", list);

  }

  //新增
  const insertEvent = async (row) => {
    accountEntityData = reactive({
      name: '',
      entityName: business.entityName,
      businessId: business.businessId,
      bank: '',
      bankAccount: ''
    })
    const $table = accountTable.value
    const {row: newRow} = await $table.insertAt(accountEntityData, row)
    await $table.setActiveCell(newRow, 'name')

    //新增数据无法动态添加进代理对象，
    // 需要之后获取对象时通过$table.getInsertRecords()获取所有新增后的对象
    console.log(accountList.value)

  }

  //移除数据
  const removeEvent = (row) => {

    if (row.eid) {
      // AccountService.deleteAccount(row.eid).then((res) => {
      //   console.log("删除的对象为", res);
      // }).catch((error) => {
      //   message.error(error.message);
      // })
    }
    for (let i = 0; i < accountList.value.length; i++) {
      if (accountList.value[i].id === row.id) {
        accountList.value.splice(i, 1);
        break;
      }
    }

    const $table = accountTable.value
    // console.log($table)
    $table.remove(row)
    console.log("删除后的数组", accountList.value)

  }

  //修改状态
  const changeStatus = (row) => {
    if (row.status === "启用") {
      row.status = "停用"
    } else {
      row.status = "启用"
    }
  }


  var accountMap = reactive({});


  //获取当前列表中的数据，结果为null说明验证失败
  //Todo :表单验证
  const getAccountList = async () => {
    const $table = accountTable.value

    accountMap = reactive({})

    const errMap = await $table.validate(true).catch(errMap => errMap)
    console.log("errorMap", errMap)
    if (errMap) {
      // VXETable.modal.message({status: 'error', content: '账户校验不通过！'})
      return null
    } else {
      let list = accountTable.value.getInsertRecords();

      accountList.value.forEach((account) => {
        list.push(account)
      })
      console.log("accountList", list);
      // VXETable.modal.message({status: 'success', content: '账户校验成功！'})
      return list
    }
    // let list = accountTable.value.getInsertRecords();
    //
    // accountList.value.forEach((account) => {
    //   list.push(account)
    // })
    // console.log("accountList", list);
    // return list
  }


  return {
    tableConfig,
    validAccounts,
    getAccountList,
    changeStatus,
    editTable,
    accountTable,
    accountList,
    business,
    reload,
    accountChange,
    insertEvent,
    removeEvent,
  }

}

