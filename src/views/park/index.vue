<script setup lang="ts">
import Motion from "./utils/motion";
import { ParkCreateRequest, ParkType } from "@/api/park";
import { ElButton, ElTable, ElTableColumn, ElTag } from "element-plus";
import { onMounted, ref, reactive, getCurrentInstance } from "vue";
import { useEditDialog } from "@/hooks/useEditDialog";
import editDialog from "./editDialog.vue";
import parkApi from "@/api/park";
import { initMap, setNewMarker } from "@/utils/map/utils";
import { message } from "@/utils/message";
import { useParkStore } from "@/store/modules/park";
import { svg } from "./utils/loadingSvg";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { ElMessage, ElMessageBox } from "element-plus";
import type { UploadProps } from "element-plus";

defineOptions({
  name: "Park"
});
const { proxy } = getCurrentInstance();
const parkTable = ref([]);
onMounted(async () => {
  await renderParkTable(parkStore.currentPage);
});
const loading = ref(true);
const renderParkTable = async (page: number) => {
  loading.value = true;

  const data = await parkStore.fetchParkList(page);

  data.pageInfo.records.forEach(item => {
    item.id = item.parkId;
    if (item.img && !item.img.startsWith("http")) {
      item.imgList = JSON.parse(item.img).img;
    }
  });
  parkTable.value = data.pageInfo.records;
  loading.value = false;
};
const searchByName = ref("");
// 简单筛选
const handleFilter = (value: string, row) => {
  return row.parkType === value;
};
// 增加或修改
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
  } else {
    message(dbBack.msg, { type: "error" });
  }
  await renderParkTable(parkStore.currentPage);
};
// 下拉表格
const expands = ref([]);
const mapRef = ref();
let AMap: any;
const handleExpand = async (row, expandedRows) => {
  expands.value = [];
  if (expandedRows.length > 0) {
    row ? expands.value.push(row.id) : "";
  }
  if (expandedRows.length && row.longitude && row.latitude) {
    AMap = await initMap();
    if (isNaN(Number(row.longitude))) {
      mapRef.value.style.display = "none";
      return;
    }
    const map = new AMap.Map("map", {
      //设置地图容器id
      viewMode: "3D", //是否为3D地图模式
      zoom: 15, //初始化地图级别
      center: [row.longitude, row.latitude] //初始化地图中心点位置
    });
    setNewMarker(row.longitude, row.latitude, map);
  } else {
    mapRef.value.style.display = "none";
  }
};
// 分页
const parkStore = useParkStore();
// 上传文件的对话框是否可见
const uploadDialogVisiable = ref(false);
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
    const fileName = "park" + new Date().getTime() + ".xlsx";

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
  console.log("上传成功");
  ElMessage({
    message: "文件上传成功",
    type: "success"
  });
};
</script>

<template>
  <el-card
    class="relative pb-12 box-border"
    element-loading-svg-view-box="-10, -10, 50, 50"
    v-loading="loading"
    :element-loading-svg="svg"
    element-loading-background="rgba(0, 0, 0, 0.4)"
  >
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
        <el-col :span="4" />
        <el-col :span="2"
          ><el-button @click="exportToExcel">导出</el-button>
        </el-col>
        <el-col :span="2"
          ><el-button @click="handleUpload">上传</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-table
      id="oIncomTable"
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
                <div class="max-w-lg mb-6">
                  <div>{{ props.row.description }}</div>
                </div>
                <div ref="mapRef" id="map" class="my-6 h-96 w-7/12" />
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
        :filter-method="handleFilter"
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
      <el-table-column
        sortable
        prop="createTime"
        width="200"
        label="创建时间"
      />
      <el-table-column
        sortable
        prop="updateTime"
        width="200"
        label="更新时间"
      />
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
    <el-dialog
      v-model="uploadDialogVisiable"
      title="上传文件"
      :before-close="handleClose"
    >
      <el-upload
        class="upload-demo"
        drag
        action="http://42.192.172.214:8484/api/file/upLoadPark"
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
