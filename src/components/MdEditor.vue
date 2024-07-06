template
<template>
  <!-- 编辑器组件，通过:value绑定编辑器内容，:plugins绑定启用的插件列表，并监听change事件以处理内容变更 -->
  <Editor :value="value" :plugins="plugins" @change="handleChange" />
</template>

<script setup lang="ts">
// 导入GitHub风格的Markdown插件，支持任务列表、表格格式和删除线等功能
import gfm from "@bytemd/plugin-gfm";
// 导入代码高亮插件，用于增强代码块的显示效果
import highlight from "@bytemd/plugin-highlight";
// 导入Bytemd提供的Vue编辑器与查看器组件
import { Editor, Viewer } from "@bytemd/vue-next";
// 引入Vue的ref函数，用于创建响应式数据
import { ref } from "vue";

// 定义插件数组，当前包含GFM和代码高亮插件，可根据需要扩展更多插件
const plugins = [
  gfm(),
  highlight(),
  // 可在此处添加更多插件
];

// 使用ref创建一个响应式变量value，用来存储编辑器中的内容
const value = ref("");

// 定义一个方法handleChange，用于处理编辑器内容变化时的事件
// 参数v表示编辑器新的内容字符串
const handleChange = (v: string) => {
  // 将编辑器新内容赋值给value
  value.value = v;
};
</script>

<style scoped></style>
