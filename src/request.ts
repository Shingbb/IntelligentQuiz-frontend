import axios from "axios";
import { Message } from "@arco-design/web-vue";

const myAxios = axios.create({
  baseURL: "http://localhost:8101",
  timeout: 100000,
  // 跨域请求时是否携带cookie
  withCredentials: true,
});

// 全局请求拦截器
// 添加请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 在请求发送之前做些什么
    return config;
  },
  function (error) {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 全局响应拦截器
// 添加响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    console.log(response);
    // 任何2xx范围内的状态码都会触发这个函数
    // 处理响应数据
    const { data } = response;
    // 未登录
    if (data.code === 40100) {
      // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      if (
        !response.request.responseURL.includes("user/get/login") &&
        !window.location.pathname.includes("/user/login")
      ) {
        Message.warning("请先登录");
        window.location.href = `/user/login?redirect=${window.location.href}`;
      }
    }

    return response;
  },
  function (error) {
    // 任何非2xx范围的状态码都会触发这个函数
    // 处理响应错误
    return Promise.reject(error);
  }
);

export default myAxios;
