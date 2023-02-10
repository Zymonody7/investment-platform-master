<script setup lang="ts">
import Motion from "./utils/motion";
import { ParkCreateRequest, ParkType } from "@/api/park";
import { ElButton, ElTable, ElTableColumn, ElTag } from "element-plus";
import { onMounted, ref } from "vue";
import dayjs from "dayjs/esm";
import { useEditDialog } from "@/hooks/useEditDialog";
import parkApi from "@/api/park";
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
    item.img = JSON.parse(item.img);
  });
  parkTable.value = data.page.list;
  console.log(data.page.list);
});

// const handleEdit = (index: number, item: string) => {
//   console.log(index, item);
// };
const handleDelete = (index: number, item: string) => {
  console.log(index, item);
};
const { handleEdit } = useEditDialog<ParkType, ParkCreateRequest>(
  parkApi,
  "角色"
);
</script>

<template>
  <el-table
    :data="parkTable"
    row-key="id"
    stripe
    border
    resizable
    highlight-current-row
    fit
    style="width: 98%"
  >
    <el-table-column label="#" type="expand">
      <template #default="props">
        <Motion>
          <div class="flex flex-col items-center">
            <h1 class="mb-8">{{ props.row.parkName }}</h1>
            <div class="flex justify-center gap-8 w-full flex-wrap">
              <div
                class="h-40 bg-white"
                v-for="item in props.row.img.img"
                :key="item"
              >
                <img :src="item" class="h-40 object-cover" />
              </div>
              <div class="max-w-md">
                <div>{{ props.row.description }}</div>
              </div>
            </div>
            <!-- <el-amap :center="12" :zoom="[123,43.2]" @init="init" /> -->

            <p m="t-0 b-2">Zip:</p>
            <h3>Family</h3>
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
        <el-button size="small" @click="handleEdit(scope.$index)"
          >编辑</el-button
        >
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>
