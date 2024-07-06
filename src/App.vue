<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { useLoginUserStore } from "@/store/userStore";

const route = useRoute();

/**
 * 全局初始化函数，有全局单次调用的代码，都可以写到这里
 */
const doInit = () => {
  console.log("hello 欢迎来到我的项目");
};

/**
 * 使用GET方法获取登录用户的信息。
 *
 * 该注释描述了以下异步操作的意图：通过发送一个GET请求来获取当前登录用户的详细信息。
 * 这是一个重要的操作，因为它可能影响到用户界面的显示，例如，基于用户权限的界面元素的可见性。
 *
 * @returns {Promise} 返回一个Promise对象，该对象在请求成功时解析为响应数据。
 */
// getLoginUserUsingGet().then((res) => {
//   console.log(res);
// });

onMounted(() => {
  doInit();
});
</script>

<style scoped></style>
