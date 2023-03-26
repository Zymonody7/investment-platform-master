<template>
  <el-card style="height: 80vh" class="table">
    <el-row>
      <el-form :inline="true">
        <el-form-item label="园区查询" style="width: 400px">
          <el-input placeholder="请输入园区名称" v-model="parkName">
            <template #append>
              <el-button @click="handleSearch">
                <IconifyIconOnline
                  icon="material-symbols:search-rounded"
                  width="20px"
                  height="20px"
              /></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleCreate"> 新增 </el-button>
        </el-form-item>
        <el-form-item>
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
        </el-form-item>

        <!-- <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item> -->
      </el-form>
      <el-table
        v-loading="loading"
        :data="policyList"
        @row-click="showContent"
        :stripe="true"
        style="height: 60vh"
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
          v-for="item in policyLabelData"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :show-overflow-tooltip="true"
          :min-width="item.prop == 'title' ? 600 : auto"
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
        v-model="dialogVisiable"
        :before-close="handleClose"
        class="dialog"
        :title="isEdit ? '政策修改' : '政策新增'"
      >
        <el-form :model="policyUpdateFrom">
          <el-form-item
            label="编号"
            prop="id"
            :rules="[{ required: true, message: '编号必填' }]"
          >
            <input
              type="text"
              v-model="policyUpdateFrom.id"
              placeholder="请输入编号"
            />
          </el-form-item>
          <el-form-item
            label="名称"
            prop="title"
            :rules="[{ required: true, message: '名称必填' }]"
          >
            <textarea
              class="nameTextarea"
              v-model="policyUpdateFrom.title"
              placeholder="请输入名称"
            />
          </el-form-item>
          <el-form-item
            label="时间"
            prop="time"
            :rules="[{ required: true, message: '时间必填' }]"
          >
            <input
              type="text"
              v-model="policyUpdateFrom.time"
              placeholder="请输入时间"
            />
          </el-form-item>
          <el-form-item
            label="内容"
            prop="content"
            :rules="[{ required: true, message: '内容必填' }]"
          >
            <textarea
              class="contentTextarea"
              v-model="policyUpdateFrom.content"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item
            label="内容(样式)"
            prop="contentPlain"
            :rules="[{ required: true, message: '内容(样式)必填' }]"
          >
            <textarea
              class="contentTextarea"
              v-model="policyUpdateFrom.contentPlain"
              placeholder="请输入内容样式"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="confirmUpdate">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <div
        id="policyPage"
        v-html="str"
        v-show="contentDialogVisiable"
        @click="closePage"
      />
      <div class="example-pagination-block" style="height: 10vh">
        <el-pagination
          background
          @current-change="changePage"
          layout="prev, pager, next"
          :total="30"
          :page-size="pageInfo.pageSize"
        />
      </div>
    </el-row>
  </el-card>
</template>
<script lang="ts">
import { onMounted, ref, reactive } from "vue";
import {
  getPolicyInfo,
  searchByName,
  update,
  create,
  deletePolicy
} from "../../api/policy";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  setup() {
    // 政策每列名称
    const policyLabelData = [
      {
        prop: "id",
        label: "编号"
      },
      {
        prop: "title",
        label: "名称"
      },
      {
        prop: "time",
        label: "时间"
      }
      /*       {
        prop: "content",
        label: "内容",
        width: 800
      } */
    ];
    // 政策列表
    const policyList = ref([]);
    // 获取政策列表
    // const getPolicyList = async () => {
    //   const res = await getPolicyInfo({ timeout: 50000 },page,limit);
    //   policyList.value = policyList.value = res;
    // };
    // 园区查询
    const handleSearch = async () => {
      if (parkName.value == "") {
        return ElMessageBox.alert("请输入园区").then();
      } else {
        const res = await searchByName(parkName.value);
        const park = res.show[0];
        ElMessageBox.alert(
          `经度:${park.longitude},纬度:${park.latitude}`,
          "查询结果",
          {
            confirmButtonText: "确定"
          }
        ).then(() => (parkName.value = ""));
      }
    };
    //政策修改对话框
    const policyUpdateFrom = reactive({
      id: "",
      title: "",
      time: "",
      content: ""
    });
    // 点击编辑并不跳转政策页的控制量
    const editBtn = ref("false");
    // 政策修改
    const handleEdit = row => {
      editBtn.value = "true";
      dialogVisiable.value = true;
      // 浅拷贝
      Object.assign(policyUpdateFrom, row);
    };
    //园区名称
    const parkName = ref("");
    // 政策修改对话框是否课件
    const dialogVisiable = ref(false);
    //政策修改对话框
    const policyUpdateFromReset = {
      id: "",
      title: "",
      time: "",
      content: "",
      contentPlain: ""
    };
    // 编辑对话框关闭
    const handleClose = (done: () => void) => {
      ElMessageBox.confirm("确定关闭对话框吗?")
        .then(() => {
          Object.assign(policyUpdateFrom, policyUpdateFromReset);
          dialogVisiable.value = false;
          editBtn.value = "false";
          // 恢复默认
          isEdit.value = true;
          done();
        })
        .catch(() => {
          // catch error
        });
    };
    // 判断新增还是编辑
    const isEdit = ref(true);
    // 修改确定
    const confirmUpdate = async () => {
      // console.log(res);
      if (isEdit.value == true) {
        const res = await update(policyUpdateFrom);
        if (res.code == 0) {
          console.log(res);
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
        const res = await create(policyUpdateFrom);
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
      }
      Object.assign(policyUpdateFrom, policyUpdateFromReset);
      // 恢复默认编辑状态
      isEdit.value = true;
      dialogVisiable.value = false;
      changePage(pageInfo.curPage);
    };
    // 点击某一行时展示政策完整内容
    const showContent = row => {
      console.log(editBtn.value);
      if (editBtn.value == "true") {
        return;
      }
      // 打开新页面
      const newPage = window.open("about:blank", "_blank");
      newPage.document.write(row.contentPlain);
      // if (!(editBtn.value)) {
      //   // 打开新页面
      //   var newPage = window.open("about:blank", "_blank");
      //   newPage.document.write(row.contentPlain);
      // }
    };
    const pageInfo = reactive({
      curPage: 1,
      totalItem: 1,
      pageSize: 10,
      totalPage: 1
    });
    // 改变页数
    const changePage = async n => {
      pageInfo.curPage = n;
      const res = await getPolicyInfo({ timeout: 50000 }, pageInfo.curPage, 10);
      if (res.code == 0) {
        pageInfo.totalItem = res.page.totalCount;
        pageInfo.pageSize = res.page.pageSize;
        pageInfo.totalPage = res.page.totalPage;
        policyList.value = res.page.list;
      }
    };

    // 新增
    const handleCreate = () => {
      isEdit.value = false;
      dialogVisiable.value = true;
    };
    // 批量删除按钮动态变化
    const multipleSelection = ref(false);
    // 获得删除行

    // 批量删除
    const handleDelete = async id => {
      let delRequest = [];
      if (typeof id === "string") {
        delRequest.push(id);
      } else {
        delRequest = Array.from(id);
      }
      delRequest = delRequest.map(item => parseInt(item));
      const isSuccess = await deletePolicy(delRequest);
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
      changePage(pageInfo.curPage);
    };
    // 删除行列表
    const deleteList = reactive(new Set<string>());
    const getSelectionRows = selection => {
      deleteList.clear();
      selection.forEach(item => {
        deleteList.add(item.id);
      });
    };

    // 页面挂载时
    onMounted(() => {
      changePage(1);
    });
    // 数据返回
    return {
      policyLabelData,
      policyList,
      handleSearch,
      handleEdit,
      parkName,
      dialogVisiable,
      policyUpdateFrom,
      handleClose,
      confirmUpdate,
      showContent,
      changePage,
      handleCreate,
      isEdit,
      pageInfo,
      multipleSelection,
      handleDelete,
      getSelectionRows,
      deleteList
    };
  }
};
</script>

<style>
.nameTextarea,
.contentTextarea {
  width: 100%;
  overflow-y: scroll;
}

.example-pagination-block + .example-pagination-block {
  margin-top: 15px;
}

.example-pagination-block .example-demonstration {
  margin-bottom: 16px;
}

.table {
  position: relative;
}

.example-pagination-block {
  position: absolute;
  top: 72vh;
  right: 5vw;
}
</style>
