export type SortOrder = "asc" | "desc";

export interface DataTableColumn<T extends string = string> {
    key: T;
    label: string;
    sortable?: boolean;
    /** flex 比例或固定寬，例："26%" | "120px" */
    width?: string;
    className?: string;
}

export interface DataTableSortChangePayload<T extends string = string> {
    sortBy: T;
    sortOrder: SortOrder;
}
