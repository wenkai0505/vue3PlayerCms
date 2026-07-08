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

        const status = error?.response?.status;
        const rawMessage =
            error?.response?.data?.message ??
            error?.message ??
            "請求失敗，請稍後再試";

        // 某些頁面會自行處理業務錯誤訊息，避免重複彈窗
        const shouldSkipGlobalMessage =
            status === 409 && rawMessage === "Player tag already exists";

        const mappedMessage =
            rawMessage === "Player tag already exists"
                ? "此玩家已在標記列表中，請選擇其他玩家"
                : rawMessage;

        //統一錯誤處理
        if (!shouldSkipGlobalMessage) {
            ElMessage({
                message: mappedMessage,
                type: "error",
            });
        }
        return Promise.reject(error);
    },
);

export default request;
