import axios from "axios";
import { ElMessage } from "element-plus";

const request = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
});

// 請求攔截器
request.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

// 響應攔截器
request.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么

        const message =
            error?.response?.data?.message ??
            error?.message ??
            "請求失敗，請稍後再試";

        //統一錯誤處理
        ElMessage({
            message: message,
            type: "error",
        });
        return Promise.reject(error);
    },
);

export default request;
