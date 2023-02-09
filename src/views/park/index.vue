<script setup lang="ts">
import { getList } from "@/api/park";
import { ElTable } from "element-plus";
import { onMounted, ref } from "vue";
import dayjs from "dayjs/esm";
defineOptions({
  name: "Park"
});
const parkTable = ref([]);
onMounted(async () => {
  const data = await getList();
  data.page.list.forEach(item => {
    item.createTime = dayjs(item.createTime).format("YYYY年MM月DD日");
    item.updateTime = dayjs(item.updateTime).format("YYYY年MM月DD日");
  });
  parkTable.value = data.page.list;
  console.log(data.page.list);
});
</script>

<template>
  <el-table
    :data="parkTable"
    row-key="parkId"
    empty-text="暂无数据"
    stripe
    border
    height="250"
    fit
    style="width: 100%"
  >
    <el-table-column prop="parkId" label="园区ID" width="80" />
    <el-table-column prop="parkName" label="园区名称" />
    <el-table-column prop="area" label="园区建筑面积" />
    <el-table-column prop="capacity" label="园区容量" />
    <el-table-column prop="parkType" label="园区类型" />
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column prop="updateTime" label="更新时间" />
  </el-table>
</template>
