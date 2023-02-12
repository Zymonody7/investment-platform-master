<script lang="ts" setup>
import { computed, ref, watch, onMounted, reactive } from "vue";
import type { ParkType } from "@/api/park";
import type { Ref } from "vue";
import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElOption,
  ElSelect,
  ElUpload,
  FormInstance,
  UploadProps,
  UploadUserFile
} from "element-plus";
import { ParkCreateRequest } from "@/api/park";
import { initMap, setNewMarker } from "@/utils/map/utils";
import { message } from "@/utils/message";
interface Props {
  show: boolean;
  data: ParkType | null;
}

const props = withDefaults(defineProps<Props>(), {
  show: false
});

const rules = reactive({
  parkId: [{ required: true, message: "厂房ID不能为空", trigger: "blur" }],
  parkName: [{ required: true, message: "厂房名称不能为空", trigger: "blur" }],
  description: [
    { required: true, message: "描述信息不能为空", trigger: "blur" }
  ],
  createTime: [
    { required: true, message: "创建时间不能为空", trigger: "blur" }
  ],
  updateTime: [
    { required: true, message: "更新时间不能为空", trigger: "blur" }
  ],
  parkType: [
    { required: true, message: "厂房类型不能为空", trigger: "change" }
  ],
  capacity: [{ required: true, message: "厂房容量不能为空", trigger: "blur" }],
  area: [{ required: true, message: "厂房占地面积不能为空", trigger: "blur" }]
});

const typeOptions = computed(() => {
  return [
    { label: "厂房", value: "厂房" },
    { label: "写字楼", value: "写字楼" },
    { label: "其他", value: "其他" }
  ];
});

const defaultData: ParkCreateRequest = {
  parkId: "",
  parkName: "",
  parkType: "",
  capacity: "",
  area: "",
  description: "",
  longitude: "",
  latitude: "",
  createTime: "",
  updateTime: "",
  img: "",
  imgList: []
};

const park: Ref<ParkCreateRequest> = ref(props.data || defaultData);

watch(props, newValue => {
  park.value = newValue.data || defaultData;
});

const emit = defineEmits(["close", "confirm"]);

const visible = computed(() => props.show);

// todo
const formRef = ref<FormInstance>();
const popoverVisible = ref(false);
const fileList = ref<UploadUserFile[]>([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};
const uploadImage = (file, filelist) => {
  console.log(file, filelist);
};
const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
let marker;
const showMap = async () => {
  popoverVisible.value = true;
  if (popoverVisible.value) {
    if (isNaN(Number(park.value.longitude))) {
      message("该厂房位置信息错误，请重新设置位置信息", { type: "error" });
      park.value.latitude = 111 + "";
      park.value.longitude = 45 + "";
    }
    const AMap = await initMap();
    const map = new AMap.Map("formMap", {
      //设置地图容器id
      viewMode: "3D", //是否为3D地图模式
      zoom: 15, //初始化地图级别
      center: [park.value.longitude, park.value.latitude] //初始化地图中心点位置
    });
    map.setDefaultCursor("pointer"); //使用CSS默认样式定义地图上的鼠标样式（default/pointer/move/crosshair）
    map.addControl(new AMap.Scale()); //异步同时加载多个插件
    map.addControl(new AMap.ToolBar());
    map.addControl(new AMap.Geolocation());
    marker = setNewMarker(park.value.longitude, park.value.latitude, map);
    map.on("click", (e: any) => {
      map.remove(marker);
      marker = setNewMarker(e.lnglat.lng, e.lnglat.lat, map);
      console.log(marker);
    });
  }
};
const confirmLngLat = () => {
  popoverVisible.value = false;
  park.value.longitude = marker._position[0];
  park.value.latitude = marker._position[1];
};
onMounted(() => {
  if (park.value.imgList) {
    park.value.imgList.forEach((item, index) => {
      fileList.value.push({
        name: index + "",
        url: item
      });
    });
  }
});
const handleConfirm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid, _) => {
    if (valid) {
      emit("confirm", park.value);
    } else {
      message("请确认表单信息无误后再提交", { type: "error" });
    }
  });
};
</script>
<template>
  <el-dialog
    ref="dialog"
    width="50%"
    v-model="visible"
    draggable
    :title="park.parkId ? '编辑园区' : '创建园区'"
    @close="$emit('close')"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      class="flex flex-col justify-center"
      :data="park"
      :rules="rules"
      style="padding: 0 20px"
      :label-width="100"
      :model="park"
    >
      <el-form-item label="园区ID" prop="parkId">
        <el-input placeholder="请输入园区ID" v-model="park.parkId" />
      </el-form-item>
      <el-form-item label="园区名称" prop="parkName">
        <el-input placeholder="请输入园区名称" v-model="park.parkName" />
      </el-form-item>
      <el-form-item label="园区容量" prop="capacity">
        <el-input
          type="number"
          placeholder="请输入园区容量"
          v-model="park.capacity"
        />
      </el-form-item>
      <el-form-item label="建筑面积" prop="capacity">
        <el-input
          type="number"
          placeholder="请输入园区建筑面积"
          v-model="park.area"
        />
      </el-form-item>
      <el-form-item label="园区类型" prop="parktype">
        <el-select
          class="w-full"
          v-model="park.parkType"
          placeholder="请选择园区类型"
          clearable
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          value-format="YYYY-MM-DD hh:mm:ss"
          format="YYYY-MM-DD hh:mm:ss"
          v-model="park.createTime"
          type="datetime"
        />
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime">
        <el-date-picker
          value-format="YYYY-MM-DD hh:mm:ss"
          format="YYYY-MM-DD hh:mm:ss"
          v-model="park.updateTime"
          type="datetime"
        />
      </el-form-item>
      <el-form-item label="详细信息" prop="description">
        <el-input type="textarea" autosize v-model="park.description" />
      </el-form-item>
      <el-form-item label="园区照片" prop="img">
        <el-upload
          v-model:file-list="fileList"
          accept=".jpg, .jpeg, .png"
          :on-change="uploadImage"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :auto-upload="false"
        >
          <IconifyIconOnline
            icon="material-symbols:add"
            width="60px"
            height="60px"
          />
          <template #tip>
            <div class="el-upload__tip">
              只能上传图片,且单张图片大小不能超过10MB,暂时无法上传
            </div>
          </template>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="预览图片" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="园区地址">
        <el-popover
          :visible="popoverVisible"
          class="flex flex-col justify-center"
          placement="top"
          :width="750"
        >
          <div id="formMap" class="w-full h-100 bg-slate-600 mb-2" />
          <div style="text-align: right; margin: 0">
            <el-button size="small" text @click="popoverVisible = false"
              >取消</el-button
            >
            <el-button size="small" type="primary" @click="confirmLngLat"
              >确定</el-button
            >
          </div>
          <template #reference>
            <el-button @click="showMap" class="w-full">点击选择位置</el-button>
          </template>
        </el-popover>
      </el-form-item>
      <el-form-item>
        <el-button plain class="w-full" @click="handleConfirm()"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped></style>
