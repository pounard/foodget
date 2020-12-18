import { AbstractContainer, CellAlignment } from "./core";

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
    ASC = "asc",

    /**
     * Descending.
     */
    DESC = "desc",
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
export type TableViewRowInitializer<T> = (row: TableViewRow, item: T) => void;

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
    readonly initializer: TableViewRowInitializer<T>;

    /**
     * Query data source.
     */
    query(query: DataQuery<T>): Promise<DataResponse<T>>;

    /**
     * Get column specification.
     */
    getColumnSpec(): DataColumnSpec<T>[];
}

/**
 * ListBox row.
 */
export class TableViewRow extends AbstractContainer {
    /**
     * @inheritdoc
     */
    configure() {
        this.setCellAlignment(CellAlignment.Left);
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createContainer("fg-tableview-row", "tr");
        for (const child of this.getChildren()) {
            element.appendChild(this.createCell(child, "fg-tableview-cell", "td"));
        }
        return element;
    }
}

/**
 * ListBox displays rows.
 */
export class TableView<T> extends AbstractContainer<TableViewRow> {
    /**
     * This table data provider.
     */
    private dataProvider: TableDataProvider<T>

    /**
     * Current data query.
     */
    private dataQuery?: DataQuery<T>

    /**
     * @inheritdoc
     */
    constructor(dataProvider: TableDataProvider<T>, query?: DataQuery<T>) {
        super();
        this.dataProvider = dataProvider;
        this.dataQuery = query;
    }

    refresh(query?: DataQuery<T>): void {
        if (query) {
            this.dataQuery = query;
        }
        this.removeAllChildren(false);
        this.dataProvider.query(this.dataQuery ?? {}).then(response => {
            if (!this.dataQuery) {
                this.dataQuery = {};
            }
            for (const item of response.items) {
                const row = new TableViewRow();
                this.dataProvider.initializer(row, item);
                this.addChild(row);
            }
            this.repaint();
        });
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createContainer("fg-tableview", "table");
        const header = this.doCreateElement("thead");
        const headerRow = this.doCreateElement("tr");
        for (const columnSpec of this.dataProvider.getColumnSpec()) {
            const headerCell = this.doCreateElement("th");
            headerCell.innerText = columnSpec.label ?? columnSpec.field;
            headerRow.appendChild(headerCell);
        }
        header.appendChild(headerRow);
        element.appendChild(header);
        const body = this.doCreateElement("tbody");
        for (const child of this.getChildren()) {
            body.appendChild(child.item.getElement());
        }
        element.appendChild(body);
        return element;
    }
}
