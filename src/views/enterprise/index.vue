<template>
  <div class="enterprise-table">
    <div class="enterprise-header">
      <el-form :inline="true" :model="formInline">
        <div class="left">
          <el-form-item>
            <el-select
              v-model="searchType"
              class="m-2"
              placeholder="搜索类型"
              size="small"
              style="width: 100px"
            >
              <el-option
                v-for="item in selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.id" placeholder="请输入id" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </el-form-item>
        </div>
        <div class="right">
          <el-form-item>
            <el-button type="primary" @click="handleOccupancy"
              >入驻查询</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-table :data="enterpriseList" style="width: 1200px" height="600px">
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
      class="occupancy-table"
      v-model="dialogVisiable"
      title="入驻规模"
    >
      <el-table :data="occupancyList">
        <el-table-column
          v-for="item in occupancyLabelData"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :before-close="handleClose"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import {
  getList,
  getInfoByEnterpriseId,
  findEnterprise,
  getOccupancySize
} from "../../api/enterprise";

export default {
  setup() {
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
    // 入驻表单是否可见
    const dialogVisiable = ref(false);
    // 入驻列表
    const occupancyList = ref([]);
    // 入驻表单每列名称
    const occupancyLabelData = [
      {
        prop: "rules",
        label: "rules"
      },
      {
        prop: "normals",
        label: "normals"
      },
      {
        prop: "time",
        label: "time"
      }
    ];
    // 入驻查询
    const handleOccupancy = async () => {
      dialogVisiable.value = true;
      const res = await getOccupancySize();
      occupancyList.value = res.count;
    };
    // 入驻对话框关闭
    const handleClose = () => {
      dialogVisiable.value = false;
    };
    // 页面挂载时
    onMounted(() => {
      getEnterpriseAll();
    });
    // 数据返回
    return {
      enterpriseLabelData,
      enterpriseList,
      formInline,
      handleSearch,
      selectOptions,
      searchType,
      handleOccupancy,
      occupancyLabelData,
      occupancyList,
      dialogVisiable,
      handleClose
    };
  }
};
</script>

<style scoped>
.table {
  width: 90%;
  overflow: hidden;
  margin: 0 20px;
}

.el-form {
  display: flex;
  justify-content: space-between;
}

.left {
  width: 700px;
}

.right {
  width: 90px;
  margin-top: 5px;
}
</style>
