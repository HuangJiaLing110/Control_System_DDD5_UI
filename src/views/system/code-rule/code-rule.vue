<template>
  <div>
    <vxe-toolbar>
      <template #buttons>
        <vxe-button content="添加规则" style="margin-left: 20px" status="primary" @click="openAdd()"></vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-table border height="700" :data=tableData >
      <vxe-column type="checkbox" width="60" align="center"></vxe-column>
      <vxe-column field="id" title="ID" width="60" align="center"></vxe-column>
      <vxe-column field="name" title="规则名" width="120"></vxe-column>
      <vxe-column field="codeRule" title="编码规则"></vxe-column>
      <vxe-column field="createTime" title="创建时间"></vxe-column>
      <vxe-column title="操作">
        <template v-slot="{row}">
          <vxe-button @click="codeCreat(row)">生成编码测试</vxe-button>
          <vxe-button @click="deleteSure(row)">删除编码</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>

    <vxe-modal v-model="add" title="添加编码规则" width="700" height="720" show-zoom resize remember>
      <template #default>

        <vxe-form ref="xForm" :data="addForm" title-width="80" style="margin-left: 20px" :rules="addFormRule">

          <vxe-form-item title="基本信息" span="24"></vxe-form-item>
          <vxe-form-item title="编码名称" field="name" span="24" :itemprop="name"
                         :item-render="{name: 'input',  attrs: {placeholder: '请输入10位以内编码规则名称', maxlength:10}}"></vxe-form-item>
          <vxe-form-item title="预览规则" field="codeRule" span="24"
                         :item-render="{name: 'input', attrs: {placeholder: '请点击下方选项进行编码规则填充', readonly:true}}"></vxe-form-item>

          <vxe-form-item title="填充日期" align="left" span="24">
            <vxe-button content="年份" @click="addData('#{年}')" status="primary" round></vxe-button>
            <vxe-button content="月份" @click="addData('#{月}')" status="primary" round></vxe-button>
            <vxe-button content="日" @click="addData('#{日}')" status="primary" round></vxe-button>
            <vxe-button content="周数" @click="addData('#{周}')" status="primary" round></vxe-button>
            <vxe-button content="季度" @click="addData('#{季度}')" status="primary" round></vxe-button>
          </vxe-form-item>

          <vxe-form-item title="特殊信息" align="left" span="24">
            <vxe-button content="单位编码" @click="addData('#{单位编码}')" status="danger" round></vxe-button>
            <vxe-button content="操作人员" @click="addData('#{操作人员}')" status="danger" round></vxe-button>
          </vxe-form-item>

          <vxe-form-item title="连接符号" align="left" span="24">
            <vxe-button content="-" @click="addJoiner('-')" status="success" round></vxe-button>
            <vxe-button content="—" @click="addJoiner('—')" status="success" round></vxe-button>
            <vxe-button content="+" @click="addJoiner('+')" status="success" round></vxe-button>
            <vxe-button content="*" @click="addJoiner('*')" status="success" round></vxe-button>
            <vxe-button content="(" @click="addJoiner('(')" status="success" round></vxe-button>
            <vxe-button content=")" @click="addJoiner(')')" status="success" round></vxe-button>
            <vxe-button content=":" @click="addJoiner(':')" status="success" round></vxe-button>
            <vxe-button content="_" @click="addJoiner('_')" status="success" round></vxe-button>
          </vxe-form-item>
          <vxe-form-item title="头部标识" align="left" span="24" v-if="addForm.addStrIsShow">
            <vxe-input placeholder="请输入大写字母或数字进行填充，不接受汉字或特殊符号！" v-model="addForm.addStr" style="width: 380px"
                       maxlength="10"></vxe-input>
            <vxe-button content="添加字符" @click="addString()" status="primary" round></vxe-button>

          </vxe-form-item>

          <vxe-form-item title="编码序号" align="left" span="24">
            <vxe-button content="4位序号" @click="addNumber('#{序号}4')" status="warning" round></vxe-button>
            <vxe-button content="5位序号" @click="addNumber('#{序号}5')" status="warning" round></vxe-button>
            <vxe-button content="6位序号" @click="addNumber('#{序号}6')" status="warning" round></vxe-button>
            <vxe-button content="7位序号" @click="addNumber('#{序号}7')" status="warning" round></vxe-button>
          </vxe-form-item>
          <vxe-form-item title="温馨提示" span="22">
            <P class="red">1、编码规则中，日期、特殊信息和序号只能填充一次！</P>
            <p class="red">2、编码头部标识固定为一到十位大写字母和数字字符串,且必须以大写字母开头</p>
            <p class="red">3、编码尾部固定为四到七位编码序号，且为必选项！</p>
            <p class="red">4、编码中间为可选参数，至少含有一种，且每种参数默认只能填充一次，目前参数包括有｛年份、月份、日、周数、季度、单位编码、操作人员｝</p>
            <p class="red">5、各参数与头部标志和尾部序号之间可以填充零或一位连接符，不可连续填充，目前支持的连接符包括｛-、+、*、:、—、、(、)｝</p>
            <p class="red">6、当前编码规则长度最大为{{ this.addForm.maxCodeRuleLength }}位，最小为{{ this.addForm.minCodeRuleLength }}位！</p>
            <p class="red">7、编码规则示例：AAAA-#{年}+#{月}*#{日}#{周}(#{季度})#{序号}4</p>
          </vxe-form-item>
          <vxe-form-item align="right" span="24">
            <template #default>
              <vxe-button type="submit" @click="addCodeRule" status="primary">提交</vxe-button>
              <vxe-button @click="resetData">重置</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal>


  </div>
</template>

<script>

import {VXETable} from 'vxe-table'

export default {
  components: {},

  data() {


    return {
      //表格数据
      tableData: "",

      //添加规则弹窗显示绑定
      add: false,

      /**
       * 添加规则表单
       */
      addForm: {
        //规则名
        name: "",
        //编码规则
        codeRule: "",
        //编码规则填充字符串
        addStr: "",
        //编码规则长度
        codeRuleLength: 0,
        //最大编码规则长度
        maxCodeRuleLength: 45,
        //最小编码规则长度
        minCodeRuleLength: 10,
        //编码字符串显示
        addStrIsShow:true
      },

      /**
       * 添加规则弹窗表单规则
       */
      addFormRule: {
        name: [
          {required: true, message: '请输入活动名称！', trigger: 'change'},
        ]
      },
    }
  },
  created() {
    /**
     * 填充表格数据
     */
    this.getCodeRules();
  },

  methods: {

    /**
     * 编号生成
     */
    codeCreat(row) {

      // let reg22 = /^[A-Z0-9]{1,10}([-+*:—_()]?#\{[\u4e00-\u9fa5]{1,7}}){1,9}[-+*:—_()]?#\{序号}[4-7]$/
      // console.log(reg22.test("FSDF—#{季度}#{年}+#{月}#{日}(#{周})#{季度}#{序号}4"))
      let params = {};
      params["codeRuleName"] = row.name;
      params["id"] = row.id;
      params["unitCode"] = "222";
      params["operator"] = "operator";

      this.$http.post('/codeRule/codeCreat', params).then(res => {
        if (res.data.code === 0) {
          this.$message.success("操作成功！生成的" + params.codeRuleName + "为：" + res.data.data)
        } else {
          this.$message.error("操作失败！！")
        }
      })
    },

    /**
     * 删除规则
     * */
    deleteCode(row) {
      let codeRule = {};
      codeRule["name"] = row.name;
      console.log(codeRule);
      this.$http.post('/codeRule/deleteRule', codeRule).then(res => {
        if (res.data.code === 0) {
          this.$message.success("删除成功！")
          this.getCodeRules();
        } else {
          this.$message.error("删除失败！！！")
        }
      })
    },

    /**
     * 打开确认删除弹窗
     */
    deleteSure(row) {
      VXETable.modal.confirm('您确定要删除该数据?').then(type => {
        if (type === 'confirm') {
          this.deleteCode(row)
        }
      })
    },

    /**
     * 获取规则数据
     */
    getCodeRules() {
      this.$http.get('/codeRule/getCodeRuleList').then(res => {
        console.log(res.data.data)
        this.tableData = res.data.data;
      })
    },

    /**
     * 打开添加规则弹窗
     */
    openAdd() {
      this.add = true;
      this.addForm.codeRule = "";
      this.addForm.name = "";
      this.addForm.addStrIsShow= true;
    },

    /**
     * 添加规则
     */
    addCodeRule() {
      if (this.addForm.name !== '' && this.addForm.codeRule !== '') {
        this.getCodeRuleLength();
        if (this.addForm.codeRuleLength > this.addForm.minCodeRuleLength) {
          if (this.addForm.codeRule.indexOf("#{序号}") !== -1) {
            let codeRule = {};
            codeRule["name"] = this.addForm.name;
            codeRule["codeRule"] = this.addForm.codeRule;
            codeRule["remark"] = this.addForm.remark;

            let regTest = /^[A-Z0-9]{1,10}([-+*:—_()]?#\{[\u4e00-\u9fa5]{1,7}}){1,9}[-+*:—_()]?#\{序号}[4-7]$/
            if(!regTest.test(this.addForm.codeRule)){
              this.$message.error("编码规则不符合要求！");
              return ;
            }
            this.$http.post('/codeRule/addCodeRule', codeRule).then(res => {
              if (res.data.code === 0) {
                // eslint-disable-next-line no-empty
                switch (res.data.msg) {
                  case "添加失败":
                    this.$message.error("添加失败！！！");
                    break;
                  case "此规则名已存在,添加失败":
                    this.$message.error("此规则名已存在，添加失败！！！");
                    break;
                  case "添加成功":
                    this.$message.success("操作成功！添加的规则为" + codeRule.codeRule);
                    this.getCodeRules();
                    this.add = false;
                    break;
                  case "此编码规则已存在，请修改后重试！":
                    this.$message.error("此编码规则已存在，请修改后重试!");
                    break;
                  default:
                    this.$message.warning("返回code有误！！！");
                }
              } else {
                this.$message.error(res.data.data.message)
              }
            })
          } else {
            this.$message.warning("警告！！填充编码规则时，序号 为必填项，请根据需求选择！")
          }
        } else {
          this.$message.warning("编码规则过短，请继续填充编码规则，当前编码规则至少为：" + this.addForm.minCodeRuleLength + "位！")
        }
      } else {
        if (this.addForm.codeRule === '' && this.addForm.name !== '')
          this.$message.error("请填充编码规则后提交！");
      }

    },

    /**
     * 重置表单数据
     */
    resetData() {
      this.addForm.codeRule = "";
      this.addForm.name = "";
      this.addForm.codeRuleLength = 0;
      this.addForm.addStr = "";
      this.addForm.addStrIsShow=true;
    },

    /**
     * 添加编码可替换数据
     * @param str
     */
    addData(str) {
      this.getCodeRuleLength();
      if (this.addForm.codeRuleLength < this.addForm.maxCodeRuleLength) {
        if (this.addForm.codeRule.indexOf(str) !== -1) {
          this.$message.warning("编码属性：" + str.substring(str.indexOf("{") + 1, str.indexOf("}")) + " 只能填充一次！")
        } else {
          if (this.addForm.codeRule.indexOf("#{序号}") === -1) {
            this.addForm.codeRule += str;
          } else {
            let num = this.addForm.codeRule.slice(-6);
            let header = this.addForm.codeRule.slice(0, -6);
            this.addForm.codeRule = header + str + num;
          }
        }
      } else {
        this.$message.warning("编码规则超出长度限制!" + "当前限制长度为：" + this.addForm.maxCodeRuleLength + " 位！")
      }
    },

    /**
     * 添加编码连接符
     * @param str
     */
    addJoiner(str) {
      this.getCodeRuleLength();
      if (this.addForm.codeRuleLength < this.addForm.maxCodeRuleLength) {
        if (this.addForm.codeRule.indexOf("#{序号}") === -1) {
          this.addForm.codeRule += str
        } else {
          let num = this.addForm.codeRule.slice(-6);
          let header = this.addForm.codeRule.slice(0, -6);
          this.addForm.codeRule = header + str + num;
        }
      } else {
        this.$message.warning("编码规则超出长度限制!" + "当前限制长度为：" + this.addForm.maxCodeRuleLength + " 位！")

      }
    },

    /**
     * 添加编码字符串
     *
     */
    addString() {
      if (this.addForm.addStr !== '') {
        this.getCodeRuleLength();
        if (this.addForm.codeRuleLength < this.addForm.maxCodeRuleLength) {
          if (/[\W_a-z]/g.test(this.addForm.addStr)) {
            this.$message.warning("您只能填充数字或者大写字母！！")
            this.addForm.addStr = this.addForm.addStr.replace(/[\W_a-z]/g, '')
          } else {
              this.addForm.codeRule = this.addForm.addStr+this.addForm.codeRule
              this.addForm.addStr = "";
              this.addForm.addStrIsShow=false;
          }
        } else {
          this.$message.warning("编码规则超出长度限制!" + "当前限制长度为：" + this.addForm.maxCodeRuleLength + " 位！")
        }
      } else {
        this.$message.warning("请输入字符！！！")
      }

    },

    /**
     * 添加编码序号
     * @param str
     */
    addNumber(str) {
      this.getCodeRuleLength();
      if (this.addForm.codeRuleLength < this.addForm.maxCodeRuleLength) {
        if (this.addForm.codeRule.indexOf("#{序号}") !== -1) {
          this.$message.warning("序号 只能填充一次!")
        } else {
          this.addForm.codeRule += str;
        }
      } else {
        this.$message.warning("编码规则超出长度限制!" + "当前限制长度为：" + this.addForm.maxCodeRuleLength + "位！")
      }
    },

    /**
     *
     *获取编码规则当前长度
     */
    getCodeRuleLength() {
      let Str = this.addForm.codeRule;
      let length = 0;
      if (Str.indexOf("年") !== -1) {
        Str = Str.replace("#{年}", "")
        length += 4;
      }

      if (Str.indexOf("月") !== -1) {
        Str = Str.replace("#{月}", "")
        length += 2;
      }

      if (Str.indexOf("日") !== -1) {
        Str = Str.replace("#{日}", "")
        length += 2;
      }

      if (Str.indexOf("周") !== -1) {
        Str = Str.replace("#{周}", "")
        length += 2;
      }

      if (Str.indexOf("季度") !== -1) {
        Str = Str.replace("#{季度}", "")
        length += 2;
      }

      if (Str.indexOf("单位编码") !== -1) {
        Str = Str.replace("#{单位编码}", "")
        length += 5;
      }

      if (Str.indexOf("操作人员") !== -1) {
        Str = Str.replace("#{操作人员}", "")
        length += 8;
      }

      if (Str.indexOf("#{序号}4") !== -1) {
        Str = Str.replace("#{序号}4", "")
        length += 4;
      }

      if (Str.indexOf("#{序号}5") !== -1) {
        Str = Str.replace("#{序号}5", "")
        length += 5;
      }

      if (Str.indexOf("#{序号}6") !== -1) {
        Str = Str.replace("#{序号}6", "")
        length += 6;
      }

      if (Str.indexOf("#{序号}7") !== -1) {
        Str = Str.replace("#{序号}7", "")
        length += 7;
      }

      length += Str.length;
      this.addForm.codeRuleLength = length;
    },
    test(){

      // let str111 = "[^\\W_]{0-10}"
      // let str222 = "([-+*(]?[^\\W_]{0-10})?){0,2}"
      // let str333 ="#\\{[u4e00-u9fa5]{1-5}\\}"
      // let str444 = "#\\{序号\\}[4-7]"
      // let regex = /^[^\W_]{0,10}([-+*]?#\{[\u4e00-\u9fa5]{1,5}\}){1,9}#\{序号\}[4-7]$/
      // let regex = /[^\W_]{0-10}/
      // regex.test("AAA-#{年}+#{月}*#{日}#{周}#{季度}#{序号}4")
      // console.log(regex.test("AAA-#{年}+#{月}*#{日}#{周}#{季度}#{序号}4"))

      // let reg = /#\{序号\}[4-7]/
      // reg.test("#{序号}4")
      // console.log(reg.test("#{序号}4"))

      let reg22 = /^[A-Z0-9]{1,10}([-+*:—_()]?#\{[\u4e00-\u9fa5]{1,7}}){1,9}[-+*:—_()]?#\{序号}[4-7]$/
      console.log(reg22.test("FSDF—#{季度}#{年}+#{月}#{日}(#{周})#{季度}#{序号}4"))

    }

  },


};
</script>

<style>
 .red{
  margin: 0;
  color: red;
}

</style>
