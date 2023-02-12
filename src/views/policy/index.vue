<template>
  <div class="table">
    <el-form :inline="true">
      <el-form-item label="园区查询" style="width: 300px">
        <el-input placeholder="请输入园区名称" v-model="parkName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="policyList">
      <el-table-column
        v-for="item in policyLabelData"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? item.width : 120"
        show-overflow-tooltip="true"
        header-align="center"
      />
      <el-table-column fixed="right" label="操作" width="100">
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
      title="政策修改"
    >
      <el-form :model="policyUpdateFrom">
        <el-form-item
          label="编号"
          prop="id"
          :rules="[{ required: true, message: '编号必填' }]"
        >
          <input type="text" v-model="policyUpdateFrom.id" />
        </el-form-item>
        <el-form-item
          label="名称"
          prop="title"
          :rules="[{ required: true, message: '名称必填' }]"
        >
          <textarea class="nameTextarea" v-model="policyUpdateFrom.title" />
        </el-form-item>
        <el-form-item
          label="时间"
          prop="time"
          :rules="[{ required: true, message: '时间必填' }]"
        >
          <input type="text" v-model="policyUpdateFrom.time" />
        </el-form-item>
        <el-form-item
          label="内容"
          prop="content"
          :rules="[{ required: true, message: '内容必填' }]"
        >
          <textarea
            class="contentTextarea"
            v-model="policyUpdateFrom.content"
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
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmUpdate">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, ref, reactive } from "vue";
import { getPolicyInfo, searchByName, update } from "../../api/policy";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  setup() {
    // 政策每列名称
    const policyLabelData = [
      {
        prop: "id",
        label: "编号",
        width: 80
      },
      {
        prop: "title",
        label: "名称",
        width: 500
      },
      {
        prop: "time",
        label: "时间"
      },
      {
        prop: "content",
        label: "内容",
        width: 800
      },
      {
        prop: "contentPlain",
        label: "内容(样式)",
        width: 800
      }
    ];
    // 政策列表
    const policyList = ref([]);
    // 获取政策列表
    const getPolicyList = async () => {
      const res = await getPolicyInfo({ timeout: 50000 });
      policyList.value = policyList.value = res;
    };
    // 园区查询
    const handleSearch = async () => {
      const res = await searchByName(parkName.value);
      const park = res.show[0];
      ElMessageBox.alert(
        `经度:${park.longitude},纬度:${park.latitude}`,
        "查询结果",
        {
          confirmButtonText: "确定"
        }
      ).then(() => (parkName.value = ""));
    };
    //政策修改对话框
    const policyUpdateFrom = reactive({
      id: "",
      title: "",
      time: "",
      content: ""
    });
    // 政策修改
    const handleEdit = row => {
      dialogVisiable.value = true;
      // 浅拷贝
      Object.assign(policyUpdateFrom, row);
    };
    //园区名称
    const parkName = ref("");
    // 政策修改对话框是否课件
    const dialogVisiable = ref(false);
    //对话框关闭
    const handleClose = () => {
      dialogVisiable.value = false;
    };
    // 修改确定
    const confirmUpdate = async () => {
      const res = await update(policyUpdateFrom);
      console.log(res);
      if (res.code == 0) {
        ElMessage({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
        getPolicyList();
        dialogVisiable.value = false;
      }
    };
    // 页面挂载时
    onMounted(() => {
      getPolicyList();
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
      confirmUpdate
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
</style>
