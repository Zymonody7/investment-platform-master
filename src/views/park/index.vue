<script setup lang="ts">
import Motion from "./utils/motion";
import { ParkCreateRequest, ParkType } from "@/api/park";
import { ElButton, ElTable, ElTableColumn, ElTag } from "element-plus";
import { onMounted, ref, reactive } from "vue";
import { useEditDialog } from "@/hooks/useEditDialog";
import editDialog from "./editDialog.vue";
import parkApi from "@/api/park";
import { initMap } from "@/utils/map/utils";
import { message } from "@/utils/message";
import { useParkStore } from "@/store/modules/park";

defineOptions({
  name: "Park"
});
const parkTable = ref([]);
onMounted(async () => {
  await renderParkTable(parkStore.currentPage);
});
const renderParkTable = async (page: number) => {
  const data = await parkStore.fetchParkList(page);

  data.pageInfo.records.forEach(item => {
    item.id = item.parkId;
    if (item.img && !item.img.startsWith("http")) {
      item.imgList = JSON.parse(item.img).img;
    }
  });
  parkTable.value = data.pageInfo.records;
};
const searchByName = ref("");
const handleSearchByName = () => {};
const {
  showDialog,
  editData,
  handleCreate,
  handleEdit,
  onDialogClose,
  handleConfirm
} = useEditDialog<ParkType, ParkCreateRequest>(parkApi, "园区");
// 批量删除
const parkForm = ref();
const multipleSelection = ref(false);
const deleteList = reactive(new Set<string>());
const getSelectionRows = (selection: ParkType[]) => {
  deleteList.clear();
  selection.forEach(item => {
    deleteList.add(item.parkId);
  });
};
const handleDelete = async (id: string | Set<string>) => {
  let delRequest = [];
  if (typeof id === "string") {
    delRequest.push(id);
  } else {
    delRequest = Array.from(id);
  }
  delRequest = delRequest.map(item => parseInt(item));
  const dbBack = await parkApi.deletePark(delRequest);
  if (dbBack.code === 0) {
    message("删除成功", { type: "success" });
  }
  await renderParkTable(parkStore.currentPage);
};
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
// 分页
const parkStore = useParkStore();
</script>

<template>
  <el-card class="relative pb-12 box-border">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input v-model="searchByName">
            <template #prepend>
              <el-select style="width: 100px" placeholder="查询方式">
                <el-option label="园区名称" value="1" />
                <el-option label="园区ID" value="2" />
              </el-select>
            </template>
            <template #append>
              <el-button @click="handleSearchByName">
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
      @selection-change="getSelectionRows"
      ref="parkForm"
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
      >
        <template #default="props">
          <Motion>
            <div class="flex flex-col items-center">
              <h1 class="mb-8">{{ props.row.parkName }}</h1>
              <div class="flex justify-center gap-8 w-9/12 flex-wrap">
                <div
                  class="h-40 bg-white"
                  v-for="item in props.row.imgList"
                  :key="item"
                >
                  <img :src="item" class="h-40 object-cover" />
                </div>
                <div class="max-w-lg">
                  <div>{{ props.row.description }}</div>
                </div>
                <div id="map" class="my-6 h-96 w-7/12" />
              </div>
            </div>
          </Motion>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="id"
        label="园区ID"
        width="70"
        size="large"
      />
      <el-table-column prop="parkName" min-width="160" label="园区名称" />
      <el-table-column prop="area" label="园区建筑面积" />
      <el-table-column prop="capacity" label="园区容量" />
      <el-table-column
        prop="parkType"
        label="园区类型"
        width="90"
        :filters="[
          { text: '厂房', value: '厂房' },
          { text: '写字楼', value: '写字楼' },
          { text: '其他', value: '其他' }
        ]"
        filter-placement="bottom-end"
      >
        <template #default="scope">
          <el-tag
            round
            :type="scope.row.parkType === '厂房' ? 'warning' : 'success'"
            >{{ scope.row.parkType }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="createTime" width="200" label="创建时间" />
      <el-table-column prop="updateTime" width="200" label="更新时间" />
      <el-table-column width="140">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row.parkId)"
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
      :total="parkStore.total"
      v-model:current-page="parkStore.currentPage"
      @current-change="renderParkTable(parkStore.currentPage)"
      layout="prev, pager, next"
      class="absolute right-20 bottom-4"
    />
  </el-card>
</template>
