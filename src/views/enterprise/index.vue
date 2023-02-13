<template>
  <div class="enterprise-table">
    <el-row :gutter="24" class="enterprise-header">
      <el-col :span="2.5">
        <el-select
          v-model="searchType"
          placeholder="搜索类型"
          style="width: 100px"
        >
          <el-option
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input
          v-model="formInline.id"
          placeholder="请输入id"
          style="padding-right: 0; padding-left: 0"
        />
      </el-col>
      <el-col :span="4">
        <el-input
          v-model="formInline.name"
          placeholder="请输入名称"
          style="padding-right: 0; padding-left: 0"
        />
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-col>
      <el-col :span="8" />
      <el-col :span="1.5">
        <el-button @click="exportToExcel"> 导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button @click="handleUpload">上传</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="enterpriseList"
      style="width: 1200px"
      height="600px"
      id="oIncomTable"
    >
      <el-table-column
        v-for="item in enterpriseLabelData"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? item.width : 120"
      />

      <!--       <el-table-column fixed="right" label="Operations" width="120">
        <template #default>
          <el-button link type="primary" size="small" @click="handleClick"
            >删除</el-button
          >
          <el-button link type="primary" size="small">编辑</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-dialog
      v-model="uploadDialogVisiable"
      title="上传文件"
      :before-close="handleClose"
    >
      <el-upload
        class="upload-demo"
        drag
        action="http://42.192.172.214:8484/api/file/upLoadEnterprise"
        multiple
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :limit="3"
        :on-exceed="handleExceed"
        :on-success="handleSuccess"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            jpg/png files with a size less than 500kb
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  onMounted,
  reactive,
  ref,
  getCurrentInstance,
  defineComponent
} from "vue";
import {
  getList,
  getInfoByEnterpriseId,
  findEnterprise
} from "../../api/enterprise";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { ElMessage, ElMessageBox } from "element-plus";
import type { UploadProps } from "element-plus";

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
    // 企业列表
    const enterpriseList = ref([]);
    // 企业表单每列名称
    const enterpriseLabelData = reactive([
      {
        prop: "enterpriseId",
        label: "企业代码"
      },
      {
        prop: "enterpriseName",
        label: "企业名称"
      },
      {
        prop: "industry",
        label: "产业"
      },
      {
        prop: "registeredCapital",
        label: "注册资本"
      },
      {
        prop: "outputValue",
        label: "产值"
      },
      {
        prop: "enterpriseType",
        label: "企业类型"
      },
      {
        prop: "score",
        label: "评分"
      },
      {
        prop: "url",
        label: "网址"
      },
      {
        prop: "parkId",
        label: "园区代码"
      },
      {
        prop: "createTime",
        label: "创建时间"
      },
      {
        prop: "updateTime",
        label: "更新时间"
      },
      {
        prop: "description",
        label: "描述",
        width: 300
      }
    ]);
    // 获取所有企业信息
    const getEnterpriseAll = async () => {
      const res = await getList();
      // console.log(res);
      timeHandler(res);
      enterpriseList.value = res;
    };
    // 搜索框内容
    const formInline = ref({
      id: "",
      name: ""
    });
    // 搜索类型
    const selectOptions = [
      {
        value: "企业",
        label: "企业"
      },
      {
        value: "园区",
        label: "园区"
      }
    ];
    const searchType = ref("");
    //搜索功能
    const handleSearch = async () => {
      if (searchType.value === "企业") {
        const res = await getInfoByEnterpriseId(formInline.value);
        // console.log(res);
        timeHandler(res.data.EnterpriseEntity);
        enterpriseList.value = res.data.EnterpriseEntity;
      } else if (searchType.value === "园区") {
        const res = await findEnterprise(formInline.value);
        // console.log(res);
        timeHandler(res.data.data);
        enterpriseList.value = res.data.data;
      }
    };
    // 时间正则
    const timeFormat = time => {
      // 创建给定时间的对象
      const time2 = new Date(time);
      const year = time2.getFullYear();
      // month从0开始
      const month = time2.getMonth() + 1;
      const date = time2.getDate();
      // 如果小于10 将数字补齐2位
      function add(m) {
        return m < 10 ? "0" + m : m;
      }
      // 以yyyy-mm-dd形式返回time
      return year + "-" + add(month) + "-" + add(date);
    };
    // 对时间做正则处理
    const timeHandler = arr => {
      arr.map(item => {
        item.createTime = timeFormat(item.createTime);
        item.updateTime = timeFormat(item.updateTime);
        return item;
      });
    };

    // 入驻对话框关闭
    const handleClose = () => {
      uploadDialogVisiable.value = false;
    };
    // 页面挂载时
    onMounted(() => {
      getEnterpriseAll();
    });
    // 将el-table转excel下载至本地
    const exportToExcel = () => {
      // 检验是否导入成功
      // console.log('XLSX',XLSX,FileSaver)
      // 使用 this.$nextTick 是在dom元素都渲染完成之后再执行
      proxy.$nextTick(function () {
        // 设置导出的内容是否只做解析，不进行格式转换     false：要解析， true:不解析
        const xlsxParam = { raw: true };
        const wb = XLSX.utils.table_to_book(
          document.querySelector("#oIncomTable"),
          xlsxParam
        );
        // 导出excel文件名
        const fileName = "enterprise" + new Date().getTime() + ".xlsx";

        const wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          // 下载保存文件
          FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            fileName
          );
        } catch (e) {
          if (typeof console !== "undefined") {
            console.log(e, wbout);
          }
        }
        return wbout;
      });
    };
    // 上传文件的对话框是否可见
    const uploadDialogVisiable = ref(false);
    // 处理excel上传
    const handleUpload = () => {
      uploadDialogVisiable.value = true;
    };
    const handleRemove: UploadProps["onRemove"] = () => {
      ElMessage({
        message: "取消文件上传",
        type: "error"
      });
    };
    const handlePreview: UploadProps["onPreview"] = () => {
      ElMessage({
        message: "该文件已选择",
        type: "info"
      });
    };

    const handleExceed: UploadProps["onExceed"] = () => {
      ElMessage.warning("最多可上传三个文件！");
    };
    const beforeRemove: UploadProps["beforeRemove"] = () => {
      return ElMessageBox.confirm("确定取消该文件的上传吗").then(
        () => true,
        () => false
      );
    };
    const handleSuccess = () => {
      ElMessage({
        message: "文件上传成功",
        type: "success"
      });
    };
    // 数据返回
    return {
      enterpriseLabelData,
      enterpriseList,
      formInline,
      handleSearch,
      selectOptions,
      searchType,
      handleClose,
      exportToExcel,
      handleUpload,
      uploadDialogVisiable,
      handlePreview,
      handleRemove,
      handleExceed,
      beforeRemove,
      handleSuccess
    };
  }
});
</script>

<style scoped>
.enterprise-header {
  margin: 5px;
}

.table {
  width: 90%;
  overflow: hidden;
  margin: 0 20px;
}

.el-form {
  display: flex;
  justify-content: space-between;
}

/* .left {
  width: 700px;
}

.right {
  width: 180px;
  margin-top: 5px;
  display: flex;
} */
</style>
