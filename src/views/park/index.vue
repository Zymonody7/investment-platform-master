<script setup lang="ts">
import Motion from "./utils/motion";
import { ParkCreateRequest, ParkType } from "@/api/park";
import { ElButton, ElTable, ElTableColumn, ElTag } from "element-plus";
import { onMounted, ref } from "vue";
import dayjs from "dayjs/esm";
import { useEditDialog } from "@/hooks/useEditDialog";
import editDialog from "./editDialog.vue";
import parkApi from "@/api/park";
import { initMap } from "@/utils/map/utils";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ri/search-2-line";

defineOptions({
  name: "Park"
});
const parkTable = ref([]);
onMounted(async () => {
  const data = await parkApi.getList();
  data.page.list.forEach(item => {
    item.createTime = dayjs(item.createTime).format("YYYY年MM月DD日");
    item.updateTime = dayjs(item.updateTime).format("YYYY年MM月DD日");
    item.id = item.parkId;
    if (item.img) {
      item.img = JSON.parse(item.img);
    }
  });
  parkTable.value = data.page.list;
  console.log(data.page.list);
});

const searchByName = ref("");

// const handleEdit = (index: number, item: string) => {
//   console.log(index, item);
// };
const handleDelete = (index: number, item: string) => {
  console.log(index, item);
};
const {
  showDialog,
  editData,
  handleCreate,
  handleEdit,
  onDialogClose,
  handleConfirm
} = useEditDialog<ParkType, ParkCreateRequest>(parkApi, "角色");
// 下拉表格
const expands = ref([]);
const handleExpand = (row, expandedRows) => {
  expands.value = [];

  if (expandedRows.length > 0) {
    row ? expands.value.push(row.id) : "";
  }
  if (expandedRows.length && row.longitude) {
    initMap("map", row.longitude, row.latitude);
  }
  console.log(expandedRows, row);
};
</script>

<template>
  <el-card class="relative pb-12">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchByName"
            placeholder="Please Input"
            :suffix-icon="useRenderIcon(Search)"
          />
        </el-col>
        <el-col :span="3"
          ><el-button @click="handleCreate"> 新增 </el-button></el-col
        >
      </el-row>
    </el-card>
    <el-table
      :data="parkTable"
      row-key="id"
      stripe
      border
      resizable
      highlight-current-row
      fit
      style="width: 100%"
      @expand-change="handleExpand"
      :expand-row-keys="expands"
    >
      <el-table-column label="#" type="expand">
        <template #default="props">
          <Motion>
            <div class="flex flex-col items-center">
              <h1 class="mb-8">{{ props.row.parkName }}</h1>
              <div class="flex justify-center gap-8 w-9/12 flex-wrap">
                <div
                  class="h-40 bg-white"
                  v-for="item in props.row.img.img"
                  :key="item"
                >
                  <img :src="item" class="h-40 object-cover" />
                </div>
                <div class="max-w-lg">
                  <div>{{ props.row.description }}</div>
                </div>
                <div id="map" class="mt-6 h-96 w-7/12" />
              </div>
            </div>
          </Motion>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="id"
        label="园区ID"
        width="80"
        size="large"
      />
      <el-table-column prop="parkName" min-width="160" label="园区名称" />
      <el-table-column prop="area" label="园区建筑面积" />
      <el-table-column prop="capacity" label="园区容量" />
      <el-table-column
        prop="parkType"
        label="园区类型"
        width="100"
        :filters="[
          { text: '厂房', value: '厂房' },
          { text: '其他', value: '其他' }
        ]"
        filter-placement="bottom-end"
      >
        <template #default="scope">
          <el-tag
            :type="scope.row.tag === '厂房' ? '' : 'success'"
            disable-transitions
            >{{ scope.row.parkType }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <edit-dialog
      v-if="showDialog"
      :show="showDialog"
      :data="editData"
      @close="onDialogClose"
      @confirm="handleConfirm"
    />
    <el-pagination
      small
      background
      layout="prev, pager, next"
      :total="50"
      class="absolute right-10 bottom-4"
    />
  </el-card>
</template>
