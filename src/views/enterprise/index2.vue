<template>
  <el-card class="enterprise-table" style="height: 83vh">
    <el-card>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-input v-model="inputContent">
            <template #prepend>
              <el-select
                style="width: 100px"
                placeholder="搜索类型"
                v-model="searchType"
              >
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
            <template #append>
              <el-button @click="handleSearch">
                <IconifyIconOnline
                  icon="material-symbols:search-rounded"
                  width="20px"
                  height="20px"
              /></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="2"
          ><el-button type="success" @click="handleCreate"> 新增 </el-button>
        </el-col>
        <el-col :span="4">
          <el-button
            v-if="!multipleSelection"
            type="danger"
            @click="multipleSelection = true"
          >
            批量删除
          </el-button>
          <el-button-group v-if="multipleSelection">
            <el-button @click="multipleSelection = false">取消</el-button>
            <el-button type="danger" @click="handleDelete(deleteList)">
              确认删除
            </el-button>
          </el-button-group>
        </el-col>
        <el-col :span="6" />
        <el-col :span="2">
          <el-button @click="exportToExcel"> 导出</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="handleUpload">上传</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-table
      :data="enterpriseList"
      style="width: auto"
      height="65vh"
      id="oIncomTable"
      @selection-change="getSelectionRows"
    >
      <el-table-column
        align="center"
        v-if="multipleSelection"
        type="selection"
        width="55"
      />
      <el-table-column
        width="55"
        v-if="!multipleSelection"
        label="#"
        type="expand"
      />
      <el-table-column
        v-for="item in enterpriseLabelData"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? item.width : 120"
      />
      <el-table-column fixed="right" label="操作" width="70">
        <template #default="scope">
          <el-button link type="primary" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
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
    <el-dialog
      v-model="EditDialogVisiable"
      :before-close="handleClose"
      class="dialog"
      :title="isEdit ? '企业编辑' : '企业新增'"
    >
      <el-form
        :model="enterpriseEditFrom"
        :inline="true"
        class="enterpriseEditFrom"
        ref="clearFormContent"
        @validate="formValidate"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="企业代码"
              prop="enterpriseId"
              :rules="[{ required: true, message: '企业代码必填' }]"
            >
              <input
                type="text"
                v-model="enterpriseEditFrom.enterpriseId"
                placeholder="请输入企业代码"
              />
            </el-form-item>
            <el-form-item
              label="企业名称"
              prop="enterpriseName"
              :rules="[{ required: true, message: '企业名称必填' }]"
            >
              <input
                type="text"
                style="width: 280px"
                v-model="enterpriseEditFrom.enterpriseName"
                placeholder="请输入企业名称"
              />
            </el-form-item>
            <el-form-item
              label="产业"
              prop="industry"
              :rules="[{ required: true, message: '产业必填' }]"
            >
              <input
                type="text"
                v-model="enterpriseEditFrom.industry"
                placeholder="请输入产业"
              />
            </el-form-item>
            <el-form-item
              label="注册资本"
              prop="registeredCapital"
              :rules="[{ required: true, message: '注册资本必填' }]"
            >
              <input
                type="text"
                v-model="enterpriseEditFrom.registeredCapital"
                placeholder="请输入注册资本"
              />
            </el-form-item>
            <el-form-item
              label="产值"
              prop="outputValue"
              :rules="[{ required: true, message: '产值必填' }]"
            >
              <input
                type="text"
                v-model="enterpriseEditFrom.outputValue"
                placeholder="请输入产值"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="评分"
              prop="score"
              :rules="[{ required: true, message: '评分必填' }]"
            >
              <input
                type="text"
                v-model="enterpriseEditFrom.score"
                placeholder="请输入评分"
              />
            </el-form-item>

            <el-form-item label="网址" prop="url">
              <input
                type="text"
                v-model="enterpriseEditFrom.url"
                placeholder="请输入网址"
              />
            </el-form-item>
            <el-form-item
              label="园区代码"
              prop="parkId"
              :rules="[{ required: true, message: '园区代码必填' }]"
            >
              <input
                type="text"
                v-model="enterpriseEditFrom.parkId"
                placeholder="请输入园区代码"
              />
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime">
              <input
                type="text"
                v-model="enterpriseEditFrom.createTime"
                placeholder="请输入创建时间"
              />
            </el-form-item>
            <el-form-item label="更新时间" prop="updateTime">
              <input
                type="text"
                v-model="enterpriseEditFrom.updateTime"
                placeholder="请输入更新时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item
            label="企业类型"
            prop="enterpriseType"
            :rules="[{ required: true, message: '企业类型必填' }]"
          >
            <input
              type="text"
              style="width: 360px"
              v-model="enterpriseEditFrom.enterpriseType"
              placeholder="请输入企业类型"
            />
          </el-form-item>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item
              label="描述"
              prop="description"
              :rules="[{ required: true, message: '描述必填' }]"
            >
              <textarea
                type="text"
                style="width: 550px; height: 150px"
                v-model="enterpriseEditFrom.description"
                placeholder="请输入描述"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" />
          <el-col :span="3">
            <el-form-item>
              <el-button
                type="primary"
                @click="confirmUpdate"
                style="right: 20px"
                >确定</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <div class="example-pagination-block" style="height: 15vh">
      <el-pagination
        background
        @current-change="changePage"
        layout="prev, pager, next"
        :total="pageInfo.itemTotal + 1"
        :page-size="5"
      />
    </div>
  </el-card>
</template>

<script lang="ts">
import { EnterpriseType } from "../../api/enterprise";
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
  findEnterprise,
  update,
  createEnterprise,
  deleteEnterprise
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
    // const getEnterpriseAll = async () => {
    //   const res = await getList();
    //   console.log(res);
    //   timeHandler(res);
    //   enterpriseList.value = res;
    // };
    // 搜索类型
    const selectOptions = [
      {
        value: "企业id",
        label: "企业id"
      },
      {
        value: "企业名称",
        label: "企业名称"
      },
      {
        value: "园区名称",
        label: "园区名称"
      }
    ];
    //企业编辑表单
    const enterpriseEditFrom = reactive({
      enterpriseId: "",
      enterpriseName: "",
      industry: "",
      registeredCapital: "",
      outputValue: "",
      enterpriseType: "",
      score: "",
      url: "",
      parkId: "",
      createTime: "",
      updateTime: "",
      description: ""
    });
    // 删除行列表
    const deleteList = reactive(new Set<string>());
    // 选择的搜索类型
    const searchType = ref("");
    //搜索数据对象
    const searchByTypeInput = ref({
      id: "",
      name: ""
    });
    // 存储文本框的值 根据搜索类型 赋给对象的不同属性
    const inputContent = ref("");
    //搜索功能
    const handleSearch = async () => {
      if (searchType.value === "") {
        return ElMessageBox.alert("请选择搜索类型").then();
      } else if (searchType.value === "企业id") {
        searchByTypeInput.value.id = inputContent.value;
        const res = await getInfoByEnterpriseId(searchByTypeInput.value);
        timeHandler(res.data.EnterpriseEntity);
        enterpriseList.value = res.data.EnterpriseEntity;
      } else if (searchType.value === "企业名称") {
        searchByTypeInput.value.name = inputContent.value;
        const res = await getInfoByEnterpriseId(searchByTypeInput.value);
        timeHandler(res.data.EnterpriseEntity);
        enterpriseList.value = res.data.EnterpriseEntity;
      } else if (searchType.value === "园区名称") {
        searchByTypeInput.value.name = inputContent.value;
        const res = await findEnterprise(searchByTypeInput.value);
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
    // 重置表单
    const enterpriseEditFromReset = {
      enterpriseId: "",
      enterpriseName: "",
      industry: "",
      registeredCapital: "",
      outputValue: "",
      enterpriseType: "",
      score: "",
      url: "",
      parkId: "",
      createTime: "",
      updateTime: "",
      description: ""
    };
    // 编辑对话框关闭
    const handleClose = (done: () => void) => {
      ElMessageBox.confirm("确定关闭对话框吗?")
        .then(() => {
          Object.assign(enterpriseEditFrom, enterpriseEditFromReset);
          done();
        })
        .catch(() => {
          // catch error
        });
    };
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
    // 记录当前页数
    // const pageNum = ref(1);
    const pageInfo = reactive({
      pageNum: 1,
      pageTotal: 1,
      itemTotal: 1
    });
    // 改变页数
    const changePage = async n => {
      pageInfo.pageNum = n;
      const res = await getList(n, 5);
      // console.log(res);
      pageInfo.itemTotal = res.page.totalCount;
      pageInfo.pageTotal = res.page.totalPage;
      pageInfo.pageNum = res.page.currPage;
      // console.log(res);
      timeHandler(res.page.list);
      enterpriseList.value = res.page.list;
    };
    // 判断是新增还是修改
    const isEdit = ref(true);
    // 新增企业表单可见
    const handleCreate = () => {
      isEdit.value = false;
      EditDialogVisiable.value = true;
    };
    // 编辑对话框可见
    const EditDialogVisiable = ref(false);
    // 编辑
    const handleEdit = row => {
      EditDialogVisiable.value = true;
      // 浅拷贝
      Object.assign(enterpriseEditFrom, row);
    };

    // 获取增加/编辑表单实例
    const clearFormContent = ref();
    // 确认更新或新增
    const confirmUpdate = async () => {
      if (isEdit.value == true) {
        const res = await update(enterpriseEditFrom);
        if (res.code == 0) {
          ElMessage({
            message: "编辑成功",
            type: "success"
          });
        } else {
          ElMessage({
            message: "编辑失败,请检查填写内容",
            type: "error"
          });
          return;
        }
      } else {
        const res = await createEnterprise(enterpriseEditFrom);
        if (res.code == 0) {
          ElMessage({
            message: "新增成功",
            type: "success"
          });
        } else {
          ElMessage({
            message: "新增失败,请检查填写内容",
            type: "error"
          });
          return;
        }
        // 恢复默认编辑状态
        isEdit.value = true;
      }
      Object.assign(enterpriseEditFrom, enterpriseEditFromReset);
      EditDialogVisiable.value = false;
      changePage(pageInfo.pageNum);
    };
    // 批量删除按钮动态变化
    const multipleSelection = ref(false);
    // 批量删除
    const handleDelete = async (id: string | Set<string>) => {
      let delRequest = [];
      if (typeof id === "string") {
        delRequest.push(id);
      } else {
        delRequest = Array.from(id);
      }
      delRequest = delRequest.map(item => parseInt(item));
      const isSuccess = await deleteEnterprise(delRequest);
      if (isSuccess.code == 0) {
        ElMessage({
          message: "删除成功",
          type: "success"
        });
      } else {
        ElMessage({
          message: "删除失败",
          type: "error"
        });
      }
      changePage(pageInfo.pageNum);
    };
    //   const dbBack = await parkApi.deletePark(delRequest);
    //   if (dbBack.code === 0) {
    //     message("删除成功", { type: "success" });
    //   } else {
    //     message(dbBack.msg, { type: "error" });
    //   }
    //   await renderParkTable(parkStore.currentPage);
    // };
    // 获得删除行
    const getSelectionRows = (selection: EnterpriseType[]) => {
      deleteList.clear();
      selection.forEach(item => {
        deleteList.add(item.enterpriseId);
      });
    };
    // 页面挂载时
    onMounted(() => {
      changePage(1);
    });
    // 数据返回
    return {
      enterpriseLabelData,
      enterpriseList,
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
      handleSuccess,
      searchByTypeInput,
      inputContent,
      changePage,
      handleCreate,
      handleEdit,
      enterpriseEditFrom,
      EditDialogVisiable,
      confirmUpdate,
      multipleSelection,
      handleDelete,
      getSelectionRows,
      deleteList,
      isEdit,
      pageInfo,
      clearFormContent
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

.example-pagination-block + .example-pagination-block {
  margin-top: 15px;
}

.example-pagination-block .example-demonstration {
  margin-bottom: 16px;
}

.enterprise-table {
  position: relative;
}

.example-pagination-block {
  position: absolute;
  right: 20px;
  top: 78vh;
}

.enterpriseEditFrom {
  display: flex;
  flex-direction: column;
}
</style>
