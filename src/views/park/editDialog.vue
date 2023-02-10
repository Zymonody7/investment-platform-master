<template>
  <el-dialog
    ref="dialog"
    width="40%"
    v-model="visible"
    draggable
    :title="park.id ? '编辑园区' : '创建园区'"
    @close="$emit('close')"
    destroy-on-close
  >
    <el-form
      ref="form"
      class="flex flex-col justify-center"
      :data="park"
      :rules="rules"
      style="padding: 0 30px"
    >
      <el-form-item label="园区名称" name="parkname">
        <el-input placeholder="请输入园区名称" v-model="park.parkName" />
      </el-form-item>
      <el-form-item label="园区容量" name="capacity">
        <el-input placeholder="请输入园区容量" v-model="park.capacity" />
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
        <el-date-picker v-model="park.createTime" type="date" />
      </el-form-item>
      <el-form-item label="更新时间" name="updateTime">
        <el-date-picker v-model="park.updateTime" type="date" />
      </el-form-item>
      <el-form-item label="详细信息" name="updateTime">
        <el-input type="textarea" autosize v-model="park.description" />
      </el-form-item>
      <el-form-item label="园区照片" name="img">
        <el-upload
          v-model:file-list="fileList"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
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
          :width="800"
        >
          <div id="formMap" class="w-full h-80 bg-slate-600" />
          <div style="text-align: right; margin: 0">
            <el-button size="small" text @click="popoverVisible = false"
              >cancel</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="popoverVisible = false"
              >confirm</el-button
            >
          </div>
          <template #reference>
            <el-button @click="showMap" class="w-full">点击选择位置</el-button>
          </template>
        </el-popover>
      </el-form-item>
      <!-- <el-form-item label="角色" name="roles">
        <el-select v-model="user.roles" :options="options" clearable multiple />
      </el-form-item> -->
      <el-form-item>
        <el-button plain class="w-full" @click="handleConfirm">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

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
import dialog from "element-plus/es/components/dialog";
import { initMap } from "@/utils/map/utils";
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

const defaultData: ParkType = {
  id: "",
  parkName: "",
  parkType: "",
  capacity: "",
  area: "",
  description: ""
};

const park: Ref<ParkType> = ref(props.data || defaultData);

watch(props, newValue => {
  park.value = newValue.data || defaultData;
});

const emit = defineEmits(["close", "confirm"]);

const visible = computed(() => props.show);

// todo
const form = ref(null);
const popoverVisible = ref(false);
const fileList = ref<UploadUserFile[]>();
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
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
  console.log(park.value);
  // fileList.value = park.value.img;
});
const handleConfirm = () => {
  emit("confirm", park.value);
};
</script>

<style scoped></style>
