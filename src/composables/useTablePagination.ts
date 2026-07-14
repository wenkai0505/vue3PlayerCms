import { computed, type Ref } from "vue";

export type PageItem = number | "ellipsis";

export const useTablePagination = (
    page: Ref<number> | (() => number),
    pageSize: Ref<number> | (() => number),
    total: Ref<number> | (() => number),
) => {
    const resolve = <T>(source: Ref<T> | (() => T)): T =>
        typeof source === "function" ? source() : source.value;

    const totalPages = computed(() => {
        const size = resolve(pageSize);
        const count = resolve(total);
        if (count <= 0 || size <= 0) return 1;
        return Math.max(1, Math.ceil(count / size));
    });

    const pageItems = computed((): PageItem[] => {
        const current = resolve(page);
        const last = totalPages.value;
        const items: PageItem[] = [];

        if (last <= 9) {
            return Array.from({ length: last }, (_, index) => index + 1);
        }

        const pages = new Set<number>([1, last]);
        for (let i = current - 2; i <= current + 2; i += 1) {
            if (i >= 1 && i <= last) pages.add(i);
        }

        const sorted = [...pages].sort((a, b) => a - b);
        sorted.forEach((pageNum, index) => {
            const prevPage = sorted[index - 1];
            if (index > 0 && prevPage !== undefined && pageNum - prevPage > 1) {
                items.push("ellipsis");
            }
            items.push(pageNum);
        });

        return items;
    });

    return {
        totalPages,
        pageItems,
    };
};
