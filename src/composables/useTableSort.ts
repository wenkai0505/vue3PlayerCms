import type { SortOrder } from "@/types/table";

export const getNextSortState = <T extends string>(
    currentSortBy: T | undefined,
    currentSortOrder: SortOrder | undefined,
    nextKey: T,
): { sortBy: T; sortOrder: SortOrder } => {
    if (currentSortBy === nextKey) {
        return {
            sortBy: nextKey,
            sortOrder: currentSortOrder === "asc" ? "desc" : "asc",
        };
    }

    return {
        sortBy: nextKey,
        sortOrder: "asc",
    };
};
