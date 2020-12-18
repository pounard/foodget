import { Container } from "./core";

/**
 * Column position (number, starts with 0).
 */
export type ColumnPosition = number;

/**
 * Column technical name.
 */
export type ColumnName = string;

/**
 * Filter query hashmap type definition.
 */
export interface FilterQuery {
    [details: string]: string;
}

/**
 * Sort order.
 */
export enum SortOrder {
    /**
     * Ascending.
     */
    Asc = "asc",

    /**
     * Descending.
     */
    Desc = "desc",
}

/**
 * Column specification.
 */
export interface DataColumnSpec<T> {
    /**
     * Technical column name for external software exchange.
     */
    readonly field: ColumnName;

    /**
     * Column label (displayed in table).
     */
    readonly label?: string;

    /**
     * Column position in display (unused for now).
     */
    readonly position?: ColumnPosition;

    /**
     * Is this column sortable, undefined means false.
     */
    readonly sortable?: boolean;
}

/**
 * Data query for data source/provider.
 */
export interface DataQuery<T> {
    /**
     * Page number, starts at 1, undefined is one.
     */
    readonly page?: number,

    /**
     * Items per page, if 0 or undefined, let the data provider decide.
     */
    readonly limit?: number,

    /**
     * Sort column name.
     */
    readonly sortColumn?: ColumnName;

    /**
     * Sort column order.
     */
    readonly sortOrder?: SortOrder,

    /**
     * Query filters, arbitrary set of strings.
     */
    readonly query?: FilterQuery,
}

/**
 * Row item initializer.
 */
export type DataRowInitializer<T> = (row: Container, item: T) => void;

/**
 * We need a response, because provider might change the query details.
 */
export interface DataResponse<T> {
    /**
     * Page number, starts at 1, undefined is one.
     */
    readonly page?: number,

    /**
     * Items per page, if 0 or undefined, let the data provider decide.
     */
    readonly limit?: number,

    /**
     * Total number of items.
     */
    readonly total?: number;

    /**
     * Current item count.
     */
    readonly count: number;

    /**
     * Sort column name.
     */
    readonly sortColumn?: ColumnName;

    /**
     * Sort column order.
     */
    readonly sortOrder?: SortOrder,

    /**
     * Response items.
     */
    readonly items: T[];
}

/**
 * Implement this for plugging in your data onto a table.
 */
export interface TableDataProvider<T> {
    /**
     * Row initializer, from the given data item, populate the table row.
     */
    readonly initializer: DataRowInitializer<T>;

    /**
     * Query data source.
     */
    query(query: DataQuery<T>): Promise<DataResponse<T>>;

    /**
     * Get column specification.
     */
    getColumnSpec(): DataColumnSpec<T>[];
}
