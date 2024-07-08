<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="titleBar">
            <img class="logo" src="../assets/A-answer.jpg" />
            <div class="title">IQ博士</div>
          </div>
        </a-menu-item>
        <a-sub-menu v-for="subItem in childrenRoutes" :key="subItem.path">
          <template #icon>
            <icon-apps></icon-apps>
          </template>
          <template #title>{{ subItem.name }}</template>
          <a-menu-item v-for="child in subItem.children" :key="child.path">
            {{ child.name }}
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <!-- 当用户已登录时，显示用户头像和下拉菜单 -->
      <div v-if="loginUserStore.loginUser.id">
        <!-- 使用a-space组件为元素提供间距 -->
        <a-space>
          <!-- 创建一个悬停触发的下拉菜单 -->
          <a-dropdown trigger="hover">
            <!-- 显示用户的头像 -->
            <a-avatar>
              <img alt="avatar" :src="loginUserStore.loginUser.userAvatar" />
            </a-avatar>
            <!-- 下拉菜单的内容模板 -->
            <template #content>
              <!-- 显示用户的名字 -->
              <a-doption>
                {{ loginUserStore.loginUser.userName }}
              </a-doption>
              <!-- 提供一个退出登录的选项 -->
              <a-doption :onclick="logout">退出登录</a-doption>
            </template>
          </a-dropdown>
        </a-space>
      </div>
      <div v-else>
        <a-button type="primary" href="/user/login">登录</a-button>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useLoginUserStore } from "@/store/userStore";
import checkAccess from "@/access/checkAccess";
import { userLogoutUsingPost } from "@/api/userController";

const loginUserStore = useLoginUserStore();

const router = useRouter();
// 当前选中的菜单项
const selectedKeys = ref(["/"]);
// 路由跳转时，自动更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

// 计算属性：用于获取应在菜单中显示的路由列表
// 展示在菜单栏的路由数组
const visibleRoutes = computed(() => {
  // 过滤路由数组，只包含不应隐藏在菜单中且没有子路由的项
  return routes.filter((item) => {
    // 如果路由元数据中指定隐藏在菜单中，或用户无访问权限，则排除该路由
    if (
      item.meta?.hideInMenu ||
      !checkAccess(loginUserStore.loginUser, item.meta?.access as string)
    ) {
      return false;
    }
    // 如果路由没有子路由，则包括在可见路由列表中
    return !item.children;
  });
});

// 计算属性：用于获取应在菜单中显示的具有子路由的路由列表
const childrenRoutes = computed(() => {
  // 过滤路由数组，只包含不应隐藏在菜单中且具有子路由的项
  return routes.filter((item) => {
    // 如果路由元数据中指定隐藏在菜单中，或用户无访问权限，则排除该路由
    if (
      item.meta?.hideInMenu ||
      !checkAccess(loginUserStore.loginUser, item.meta?.access as string)
    ) {
      return false;
    }
    // 如果路由有子路由且子路由数量大于0，则包括在具有子路由的路由列表中
    return item.children && item.children.length > 0;
  });
});

// 点击菜单跳转到对应页面
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

/**
 * 用户登出函数
 *
 * 该函数用于实现用户登出功能。它首先调用用户登出接口，然后将用户重定向到登录页面。
 * 这样做是为了确保用户在登出后需要重新认证才能访问受保护的资源。
 *
 * @returns {void} 该函数没有返回值
 */
const logout = () => {
  userLogoutUsingPost(); // 调用登出接口，执
  const logout = () => {
    userLogoutUsingPost();
    router.push({
      path: `/user/login`,
    });
  };
};
</script>

<style scoped>
#globalHeader {
}

.titleBar {
  display: flex;
  align-items: center;
}

.title {
  margin-left: 16px;
  color: black;
}

.logo {
  height: 48px;
}
</style>
