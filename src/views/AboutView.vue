<template>
  <div class="about">
    <h1>This is an about page</h1>
    {{ JSON.stringify(loginUserStore.loginUser) }}
  </div>
  <PictureUploader biz="user_avatar"></PictureUploader>
</template>

<script setup lang="ts">
import { useLoginUserStore } from "@/store/userStore";
import PictureUploader from "@/components/PictureUploader.vue";

const loginUserStore = useLoginUserStore();
</script>
