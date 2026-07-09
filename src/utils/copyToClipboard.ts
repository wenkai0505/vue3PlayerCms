import { ElMessage } from "element-plus";

export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        ElMessage({
            message: "已複製",
            type: "success",
        });
        return true;
    } catch {
        ElMessage({
            message: "複製失敗",
            type: "error",
        });
        return false;
    }
};
