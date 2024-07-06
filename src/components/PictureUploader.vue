template
<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <!-- 使用a-upload组件实现文件上传功能，通过customRequest自定义上传逻辑 -->
    <a-upload
      :fileList="file ? [file] : []"
      :show-file-list="false"
      :custom-request="customRequest"
    >
      <!-- 自定义上传按钮的样式和行为 -->
      <template #upload-button>
        <div
          :class="`arco-upload-list-item${
            file && file.status === 'error'
              ? ' arco-upload-list-item-error'
              : ''
          }`"
        >
          <!-- 当已上传文件时，显示文件内容和编辑按钮 -->
          <div
            class="arco-upload-list-picture custom-upload-avatar"
            v-if="file && file.url"
          >
            <img :src="file.url" />
            <div class="arco-upload-list-picture-mask">
              <IconEdit />
            </div>
            <!-- 当文件正在上传时，显示上传进度 -->
            <a-progress
              v-if="file.status === 'uploading' && file.percent < 100"
              :percent="file.percent"
              type="circle"
              size="mini"
              :style="{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              }"
            />
          </div>
          <!-- 当未上传文件时，显示上传按钮 -->
          <div class="arco-upload-picture-card" v-else>
            <div class="arco-upload-picture-card-text">
              <IconPlus />
              <div style="margin-top: 10px; font-weight: 600">上传</div>
            </div>
          </div>
        </div>
      </template>
    </a-upload>
  </a-space>
</template>

<script setup lang="ts">
import { IconEdit, IconPlus } from "@arco-design/web-vue/es/icon";
import { ref, withDefaults, defineProps } from "vue";
import { uploadFileUsingPost } from "@/api/fileController";
import { Message } from "@arco-design/web-vue";

/**
 * 定义组件的props类型
 * @property {string} biz 业务标识
 * @property {Function} onChange 文件上传后的回调函数
 * @property {string} value 已上传文件的URL
 */
interface Props {
  biz: string;
  onChange?: (url: string) => void;
  value?: string;
}

/**
 * 组件默认props值
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
});

/**
 * 用于存储已选择的文件信息
 */
const file = ref();

/**
 * 初始化文件信息
 */
if (props.value) {
  file.value = {
    url: props.value,
    percent: 100,
    status: "done",
  };
}

/**
 * 自定义文件上传请求
 * @param {object} option 上传选项
 * @param {Function} onError 上传错误的回调函数
 * @param {Function} onSuccess 上传成功的回调函数
 * @param {object} fileItem 上传的文件项
 */
// 自定义请求
const customRequest = async (option: any) => {
  const { onError, onSuccess, fileItem } = option;
  const res: any = await uploadFileUsingPost(
    { biz: props.biz },
    {},
    fileItem.file
  );
  /* 根据后端返回结果处理上传成功或失败的情况 */
  if (res.data.code === 0 && res.data.data) {
    const url = res.data.data;
    file.value = {
      name: fileItem.name,
      file: fileItem.file,
      url,
    };
    props.onChange?.(url);
    onSuccess();
  } else {
    Message.error("上传失败，" + res.data.message || "");
    onError(new Error(res.data.message));
  }
};
</script>
