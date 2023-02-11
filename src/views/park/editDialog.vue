<script lang="ts" setup>
import { computed, ref, watch, onMounted } from "vue";
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
  UploadProps,
  UploadUserFile
} from "element-plus";
import { initMap } from "@/utils/map/utils";
import { ParkCreateRequest } from "../../api/park";
interface Props {
  show: boolean;
  data: ParkType | null;
}

const props = withDefaults(defineProps<Props>(), {
  show: false
});

const rules = {
  parkName: [{ required: true, message: "厂房名称不能为空", trigger: "blur" }],
  description: [
    { required: true, message: "用户昵称不能为空", trigger: "blur" }
  ]
};
const typeOptions = computed(() => {
  return [
    { label: "厂房", value: "厂房" },
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
const form = ref(null);
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
const showMap = () => {
  popoverVisible.value = true;
  if (popoverVisible.value) {
    initMap(
      "formMap",
      parseInt(park.value.longitude),
      parseInt(park.value.latitude)
    );
  }
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
const handleConfirm = () => {
  emit("confirm", park.value);
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
      ref="form"
      class="flex flex-col justify-center"
      :data="park"
      :rules="rules"
      style="padding: 0 20px"
      :label-width="100"
    >
      <el-form-item label="园区ID" name="parkname">
        <el-input placeholder="请输入园区ID" v-model="park.parkId" />
      </el-form-item>
      <el-form-item label="园区名称" name="parkname">
        <el-input placeholder="请输入园区名称" v-model="park.parkName" />
      </el-form-item>
      <el-form-item label="园区容量" name="capacity">
        <el-input placeholder="请输入园区容量" v-model="park.capacity" />
      </el-form-item>
      <el-form-item label="园区建筑面积" name="capacity">
        <el-input placeholder="请输入园区建筑面积" v-model="park.area" />
      </el-form-item>
      <el-form-item label="园区类型" name="parktype">
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
      <el-form-item label="创建时间" name="createTime">
        <el-date-picker
          value-format="YYYY-MM-DD hh:mm:ss"
          format="YYYY-MM-DD hh:mm:ss"
          v-model="park.createTime"
          type="datetime"
        />
      </el-form-item>
      <el-form-item label="更新时间" name="updateTime">
        <el-date-picker
          value-format="YYYY-MM-DD hh:mm:ss"
          format="YYYY-MM-DD hh:mm:ss"
          v-model="park.updateTime"
          type="datetime"
        />
      </el-form-item>
      <el-form-item label="详细信息" name="updateTime">
        <el-input type="textarea" autosize v-model="park.description" />
      </el-form-item>
      <el-form-item label="园区照片" name="img">
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
      <el-form-item label="园区地址" name="nickname">
        <el-popover
          :visible="popoverVisible"
          class="flex flex-col justify-center"
          placement="top"
          :width="750"
        >
          <div id="formMap" class="w-full h-80 bg-slate-600 mb-2" />
          <div style="text-align: right; margin: 0">
            <el-button size="small" text @click="popoverVisible = false"
              >取消</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="popoverVisible = false"
              >确定</el-button
            >
          </div>
          <template #reference>
            <el-button @click="showMap" class="w-full">点击选择位置</el-button>
          </template>
        </el-popover>
      </el-form-item>
      <el-form-item>
        <el-button plain class="w-full" @click="handleConfirm">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped></style>
