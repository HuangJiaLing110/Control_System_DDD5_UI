<template>
  <div class="ele-body">
    <a-card title="批量生成实体">
      <a-form :model="modelConfig"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              ref="modelConfigForm"
              :rules="rules"
      >
        <a-row :gutter="[16,16]">
          <a-col :span="24">
            <a-alert message="输入实体定义" description="请输入实体定义文件路径。如果不是生成全部实体，只是部分，则可以把其他的实体表格删除。注意：文档中的示例部分的表格需要保留. " type="info" show-icon/>
          </a-col>
        </a-row>
        <a-row :gutter="[16,16]">
          <a-col :span="24">
            <a-textarea v-model:value="modelConfig.filename" placeholder="textarea with clear icon" allow-clear
                        auto-size/>
          </a-col>
        </a-row>

        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="generateBatchModels" :loading="loading">批量生成实体</a-button>

        </a-form-item>
      </a-form>
    </a-card>
    <a-card title="生成实体">
      <a-form :model="modelConfig"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              ref="modelConfigForm"
              :rules="rules"
      >
        <a-row :gutter="[16,16]">
          <a-col :span="24">
            <a-alert message="输入实体定义" description="请从实体定义表格中复制实体定义粘贴到下面的窗体中" type="info" show-icon/>
          </a-col>
        </a-row>
        <a-row :gutter="[16,16]">
          <a-col :span="24">
            <a-textarea v-model:value="modelConfig.modelDefinition" placeholder="textarea with clear icon" allow-clear
                        auto-size/>
          </a-col>
        </a-row>


        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="generateModel" :loading="loading">生成实体</a-button>

        </a-form-item>
      </a-form>
    </a-card>

    <a-card title="生成前后台">
      <a-form :model="baseCodeConfig"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              ref="baseCodeConfigForm"
              :rules="rules"
      >
        <a-row :gutter="[16,16]">
          <a-col :span="24">
            <a-alert message="输入实体名称"
                     description="请下面的文本框中输入需要生成代码的实体名称，包含包名和类名，例如：com.mt.erp.entity.test.Demo1,如果一次生成多个，可以换行"
                     type="info" show-icon/>
          </a-col>
        </a-row>
        <a-row :gutter="[16,16]">
          <a-col :span="24">
            <a-textarea v-model:value="baseCodeConfig.className" placeholder="textarea with clear icon" allow-clear
                        auto-size/>
          </a-col>
        </a-row>


        <a-form-item
          :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="generateBaseCode" :loading="loading">生成代码</a-button>

          <a-popconfirm
            title="是否执行类所对应的SQL?"
            ok-text="是"
            cancel-text="否"
            @confirm="excuteSql"
          >
            <a-button type="primary" style="margin-left: 15px" :loading="loading">执行SQL</a-button>

          </a-popconfirm>

          <a-popconfirm
            title="是否执行所有类的SQL?"
            ok-text="是"
            cancel-text="否"
            @confirm="excuteAllSql"
          >
            <a-button type="primary" style="margin-left: 15px" :loading="loading">执行所有类的SQL</a-button>

          </a-popconfirm>

        </a-form-item>


      </a-form>
    </a-card>


    <a-card title="生成前后台接口方法">
      <a-form
        :model="methodConfig"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        ref="methodConfigForm"
        :rules="rules"
      >
        <a-row :gutter="[16,16]">
          <a-col :span="24">
            <a-alert message="为前后台的生成相关的接口方法" description=" 输入控制器包名#方法名称 例如：com.mt.erp.controller.student.Demo#test"
                     type="info" show-icon/>
          </a-col>
        </a-row>
        <a-row :gutter="[16,16]">
          <a-col :span="24">
            <a-textarea v-model:value="methodConfig.controllerMethodName" placeholder="textarea with clear icon"
                        allow-clear
                        auto-size/>
          </a-col>
        </a-row>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-popconfirm
            title="是否生成接口方法?"
            ok-text="是"
            cancel-text="否"
            @confirm="generateMethod"
          >
            <a-button type="primary" style="margin-left: 15px" :loading="loading">生成接口方法</a-button>

          </a-popconfirm>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card title="生成实体LIS">
      <a-form :model="limsModelConfig"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              ref="limsModelConfigForm"
              :rules="rules"
      >
        <a-row :gutter="[16,16]">
          <a-col :span="24">
            <a-alert message="输入实体定义" description="请输入从word表格转换为HTML的模板完整路径" type="info" show-icon/>
          </a-col>
        </a-row>
        <a-row :gutter="[16,16]">
          <a-col :span="24">
            <a-textarea v-model:value="limsModelConfig.filename" placeholder="请输入HTML模板完整路径" allow-clear
                        auto-size/>
          </a-col>
        </a-row>


        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="generateLimsModel" :loading="loading">生成实体</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card title="编译功能配置">

        <a-row :gutter="[16,16]">
          <a-col :span="12">
            <a-button type="primary" @click="setJpa" style="margin-left: 15px" :loading="loading">设置JPA配置</a-button>
          </a-col>
          <a-col :span="12">
            <a-button type="primary"  @click="cleanJpa" style="margin-left: 15px" :loading="loading">清除JPA配置</a-button>
          </a-col>
          <a-col :span="12">
            <a-button type="primary" @click="setJimureport" style="margin-left: 15px" :loading="loading">设置Jimureport配置</a-button>
          </a-col>
          <a-col :span="12">
            <a-button type="primary"  @click="cleanJimureport" style="margin-left: 15px" :loading="loading">清除Jimureport配置</a-button>
          </a-col>

        </a-row>
    </a-card>

    <a-card title="生成错误">

        <a-row :gutter="[16,16]">
          <a-col :span="24">
            <a-alert message="生成错误" description=" 生成错误"
                     type="info" show-icon/>
          </a-col>
        </a-row>
        <a-row :gutter="[16,16]">
          <a-col :span="24">
            <a-textarea v-model:value="errors" placeholder="textarea with clear icon" style="color: red"
                        allow-clear
                        auto-size/>
          </a-col>
        </a-row>

    </a-card>
  </div>
</template>

<script>
export default {
  name: "Generator",
  components: {},
  data() {
    return {

      // 加载状态
      loading: false,
      errors:'',
      // 表单数据
      modelConfig: {
        modelDefinition: '',
        filename:'C:\\Users\\23197\\Desktop\\实验板块实体设计V0.2 喻超圣.doc',
        // filename:'D:\\workspace\\erp\\erp-docs\\ERP实体设计V0.58.doc',
      },
      baseCodeConfig: {
        // className: 'com.mt.erp.entity.student.Demo',
        className: 'com.mt.lis.entity.modelDesign.',
      },
      methodConfig: {
        controllerMethodName: 'com.mt.erp.controller.student.Demo#test',
      },
      limsModelConfig: {
        modelDefinition: '',
        filename:'C:\\Users\\23197\\Desktop\\新建 DOCX 文档.html',
      },
      // 表单验证规则
      rules: {
        modelConfig: [
          {required: true, message: '模型的定义', type: 'string', trigger: 'blur'}
        ],

      },

    };
  },
  mounted() {

  },
  methods: {

    generateBatchModels() {

      this.$refs.modelConfigForm.validate().then(() => {
        this.loading = true;
        let params = {params:{filename:this.modelConfig.filename} };

        this.$http.get('/generate/generator/generateBatchModels', params).then(() => {
          // debugger
          this.loading = false;
          this.$message.success('生成成功');

        }).catch((error) => {

          this.loading = false;
          this.errors = "生成出错，原因是：" + error.message;
          this.$message.error(this.errors);
        });
      }).catch((error) => {
        // debugger
        this.loading = false;
        this.$message.error(error.errorFields[0].errors);
      });
    },

    generateLimsModel() {

      this.$refs.limsModelConfigForm.validate().then(() => {
        this.loading = true;
        let params = {params:{filename:this.limsModelConfig.filename} };

        this.$http.get('/generate/generator/generateLimsModel', params).then(() => {
          // debugger
          this.loading = false;
          this.$message.success('生成成功');

        }).catch((error) => {

          this.loading = false;
          this.errors = "生成出错，原因是：" + error.message;
          this.$message.error(this.errors);
        });
      }).catch((error) => {
        // debugger
        this.loading = false;
        this.$message.error(error.errorFields[0].errors);
      });
    },


    generateModel() {

      this.$refs.modelConfigForm.validate().then(() => {
        this.loading = true;
        let params = {params:{modelDefinition:this.modelConfig.modelDefinition} };

        this.$http.get('/generate/generator/generateModel', params).then(() => {
          // debugger
          this.loading = false;
          this.$message.success('生成成功');

        }).catch((error) => {

          this.loading = false;
          this.errors = "生成出错，原因是：" + error.message;
          this.$message.error(this.errors);
        });
      }).catch((error) => {
        // debugger
        this.loading = false;
        this.$message.error(error.errorFields[0].errors);
      });
    },

    generateBaseCode() {

      this.$refs.baseCodeConfigForm.validate().then(() => {
        this.loading = true;
        let params = {params: this.baseCodeConfig};

        this.$http.get('/generate/generator/generateBaseCode', params).then(() => {
          // debugger
          this.loading = false;
          this.$message.success('生成成功');

        }).catch((error) => {

          this.loading = false;
          this.errors = "生成出错，原因是：" + error.message;
          this.$message.error(this.errors);
        });
      }).catch((error) => {
        // debugger
        this.loading = false;
        this.$message.error(error.errorFields[0].errors);
      });
    },
    excuteSql() {

      this.$refs.baseCodeConfigForm.validate().then(() => {
        this.loading = true;
        let params = {params: this.baseCodeConfig};

        this.$http.get('/generate/generator/excuteSql', params).then(() => {
          // debugger
          this.loading = false;
          this.$message.success('执行成功');

        }).catch((error) => {

          this.loading = false;
          this.errors = "执行出错，原因是：" + error.message;
          this.$message.error(this.errors);
        });
      }).catch((error) => {
        // debugger
        this.loading = false;
        this.$message.error(error.errorFields[0].errors);
      });
    },
    excuteAllSql() {

      this.$refs.baseCodeConfigForm.validate().then(() => {
        this.loading = true;

        this.$http.get('/generate/generator/excuteAllSql').then(() => {
          // debugger
          this.loading = false;
          this.$message.success('执行成功');

        }).catch((error) => {

          this.loading = false;
          this.errors = "生成出错，原因是：" + error.message;
          this.$message.error(this.errors);
        });
      }).catch((error) => {
        // debugger
        this.loading = false;
        this.$message.error(error.errorFields[0].errors);
      });
    },
    generateMethod() {
      this.$refs.methodConfigForm.validate().then(() => {
        this.loading = true;
        let params = {params: this.methodConfig};

        this.$http.get('/generate/generator/generateMethod', params).then(() => {
          // debugger
          this.loading = false;
          this.$message.success('生成成功');

        }).catch((error) => {

          this.loading = false;
          this.errors = "生成出错，原因是：" + error.message;
          this.$message.error(this.errors);
        });
      }).catch((error) => {
        // debugger
        this.loading = false;
        this.$message.error(error.errorFields[0].errors);
      });
    },
    cleanJpa() {
        this.loading = true;
        let params = {};

        this.$http.get('/generate/generator/cleanJpa', params).then(() => {
          // debugger
          this.loading = false;
          this.$message.success('成功');

        }).catch((error) => {

          this.loading = false;
          this.errors = "出错，原因是：" + error.message;
          this.$message.error(this.errors);
        });
    },
    setJpa() {
      this.loading = true;
      let params = {};

      this.$http.get('/generate/generator/setJpa', params).then(() => {
        // debugger
        this.loading = false;
        this.$message.success('成功');

      }).catch((error) => {

        this.loading = false;
        this.errors = "出错，原因是：" + error.message;
        this.$message.error(this.errors);
      });
    },
    cleanJimureport() {
      this.loading = true;
      let params = {};

      this.$http.get('/generate/generator/cleanJimureport', params).then(() => {
        // debugger
        this.loading = false;
        this.$message.success('成功');

      }).catch((error) => {

        this.loading = false;
        this.errors = "出错，原因是：" + error.message;
        this.$message.error(this.errors);
      });
    },
    setJimureport() {
      this.loading = true;
      let params = {};

      this.$http.get('/generate/generator/setJimureport', params).then(() => {
        // debugger
        this.loading = false;
        this.$message.success('成功');

      }).catch((error) => {

        this.loading = false;
        this.errors = "出错，原因是：" + error.message;
        this.$message.error(this.errors);
      });
    },
  }
}
</script>

<style scoped>

</style>
