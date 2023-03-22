<template>
  <a-page-header :ghost="false" title="分步表单">
    <div class="ele-text-secondary">将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。</div>
  </a-page-header>
  <div class="ele-body">
    <a-card :bordered="false">
      <div style="max-width: 800px;margin: 0 auto;">
        <a-steps :current="active" style="margin: 10px 0 30px 0;">
          <a-step title="第一步" description="填写转账信息"/>
          <a-step title="第二步" description="确认转账信息"/>
          <a-step title="第三步" description="转账成功"/>
        </a-steps>
        <!-- 第一步 -->
        <a-form
          v-if="active===0"
          ref="form1"
          :model="form1"
          :rules="rules1"
          :label-col="{md: {span: 6}, sm: {span: 24}}"
          :wrapper-col="{md: {span: 16}, sm: {span: 24}}">
          <a-form-item label="付款账户:" name="account">
            <a-select
              v-model:value="form1.account"
              placeholder="请选择付款账户"
              allow-clear>
              <a-select-option value="eleadmin@eclouds.com">eleadmin@eclouds.com</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="收款账户:" name="receiver">
            <a-input
              v-model:value="form1.receiver"
              placeholder="请输入收款账户"
              allow-clear>
              <template #addonBefore>
                <a-select
                  v-model:value="form1.pay"
                  style="width: 100px;margin: -5px -12px;">
                  <a-select-option value="alipay">支付宝</a-select-option>
                  <a-select-option value="wxpay">微信</a-select-option>
                </a-select>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item label="收款人姓名:" name="name">
            <a-input
              v-model:value="form1.name"
              placeholder="请输入收款人姓名"
              allow-clear/>
          </a-form-item>
          <a-form-item label="转账金额:" name="amount">
            <a-input
              v-model:value.number="form1.amount"
              placeholder="请输入转账金额"
              prefix="￥"
              allow-clear/>
          </a-form-item>
          <a-form-item :wrapper-col="{sm: {offset: 6}}">
            <a-button
              type="primary"
              @click="submit1"
              :loading="loading1">下一步
            </a-button>
          </a-form-item>
        </a-form>
        <!-- 第二步 -->
        <a-form
          v-if="active===1"
          ref="form2"
          :model="form2"
          :rules="rules2"
          :label-col="{md: {span: 6}, sm: {span: 24}}"
          :wrapper-col="{md: {span: 16}, sm: {span: 24}}"
          class="ele-form-detail">
          <a-alert
            message="确认转账后，资金将直接打入对方账户，无法退回。"
            type="info"
            show-icon
            closable/>
          <a-form-item
            label="付款账户:"
            style="margin-top: 24px;">{{ form1.account }}
          </a-form-item>
          <a-form-item label="收款账户:">{{ form1.receiver }}</a-form-item>
          <a-form-item label="收款人姓名:">{{ form1.name }}</a-form-item>
          <a-form-item label="转账金额:">
            <span style="font-size: 24px;line-height: 1;">{{ form1.amount }}</span> 元
          </a-form-item>
          <a-divider style="margin: 20px 0 30px 0;"/>
          <a-form-item label="支付密码:" name="password">
            <a-input-password
              v-model:value="form2.password"
              placeholder="请输入支付密码"/>
          </a-form-item>
          <a-form-item
            :wrapper-col="{sm: {offset: 6}}"
            style="margin-top: 24px;">
            <a-space size="middle">
              <a-button
                type="primary"
                @click="submit2"
                :loading="loading2">下一步
              </a-button>
              <a-button @click="active=0">上一步</a-button>
            </a-space>
          </a-form-item>
        </a-form>
        <!-- 第三步 -->
        <div v-if="active===2">
          <a-result
            status="success"
            title="操作成功"
            sub-title="预计两小时内到账">
            <a-form
              :label-col="{md: {span: 6}, sm: {span: 24}}"
              :wrapper-col="{md: {span: 16}, sm: {span: 24}}"
              class="ele-form-detail">
              <a-form-item label="付款账户:">{{ form1.account }}</a-form-item>
              <a-form-item label="收款账户:">{{ form1.receiver }}</a-form-item>
              <a-form-item label="收款人姓名:">{{ form1.name }}</a-form-item>
              <a-form-item label="转账金额:">
                <span style="font-size: 24px;line-height: 1;">{{ form1.amount }}</span> 元
              </a-form-item>
            </a-form>
            <template #extra>
              <a-space size="middle">
                <a-button
                  type="primary"
                  @click="active=0">再转一笔
                </a-button>
                <a-button>查看账单</a-button>
              </a-space>
            </template>
          </a-result>
        </div>
      </div>
      <div v-if="active===0">
        <a-divider style="margin: 35px 0 25px 0;"/>
        <a-alert type="info">
          <template #description>
            <h6 style="margin: 5px 0 15px 0;">说明</h6>
            <h6 style="margin-bottom: 10px;">转账到支付宝</h6>
            <p style="margin-bottom: 15px;">如果需要，这里可以放一些关于产品的常见问题说明。如果需要，
              这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
            <h6 style="margin-bottom: 10px;">转账到微信</h6>
            <p style="margin-bottom: 15px;">如果需要，这里可以放一些关于产品的常见问题说明。如果需要，
              这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
          </template>
        </a-alert>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'FormStep',
  data() {
    return {
      // 选中步骤
      active: 0,
      // 表单一数据
      form1: {
        account: 'eleadmin@eclouds.com',
        receiver: 'test@example.com',
        pay: 'alipay',
        name: 'Alex',
        amount: 500
      },
      // 表单一验证规则
      rules1: {
        account: [
          {required: true, message: '请选择付款账户', type: 'string', trigger: 'blur'}
        ],
        receiver: [
          {required: true, message: '请输入收款账户', type: 'string', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入收款人姓名', type: 'string', trigger: 'blur'}
        ],
        amount: [
          {required: true, message: '请输入合法金额数字', type: 'number', trigger: 'blur'}
        ]
      },
      // 步骤一提交状态
      loading1: false,
      // 表单二数据
      form2: {
        password: '123456',
      },
      // 表单二验证规则
      rules2: {
        password: [
          {required: true, message: '请输入支付密码', trigger: 'blur'}
        ]
      },
      // 步骤二提交状态
      loading2: false
    };
  },
  methods: {
    /* 步骤一提交 */
    submit1() {
      this.$refs.form1.validate().then(() => {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          this.active = 1;
        }, 300);
      }).catch(() => {
      });
    },
    /* 步骤二提交 */
    submit2() {
      this.$refs.form2.validate().then(() => {
        this.loading2 = true;
        setTimeout(() => {
          this.loading2 = false;
          this.active = 2;
        }, 300);
      }).catch(() => {
      });
    }
  }
}
</script>

<style scoped>
</style>
