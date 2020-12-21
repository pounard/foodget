import { DataQuery, DataResponse, SortOrder, TableDataProvider } from "./data";
import { AbstractContainer, CellAlignment, Signal } from "./core";

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
    private dataProvider: TableDataProvider<T>;

    /**
     * Current data query.
     */
    private dataQuery?: DataQuery<T>;

    /**
     * Current data query response.
     */
    private dataReponse?: DataResponse<T>;

    /**
     * @inheritdoc
     */
    constructor(dataProvider: TableDataProvider<T>, query?: DataQuery<T>) {
        super();
        this.dataProvider = dataProvider;
        this.dataQuery = query;
    }

    /**
     * Allow users to fetch current query from signals.
     */
    getCurrentQuery(): DataQuery<T> {
        return this.dataQuery ?? {};
    }

    /**
     * Allow users to fetch current query response from signals.
     *
     * Warning here: the returned response will not have the items[] array
     * initialized, in order to avoid polluting memory with the response
     * data.
     */
    getCurrentResponse(): DataResponse<T> {
        return this.dataReponse ?? {
            count: 0,
            items: [],
        };
    }

    /**
     * Refresh table data. You can pass a new query here.
     *
     * If query is incomplete, it will be completed using previous query.
     */
    refresh(query?: DataQuery<T>): void {
        if (query) {
            this.dataQuery = query;
        }
        this.removeAllChildren();
        this.dataProvider.query(this.dataQuery ?? {}).then(response => {
            if (!this.dataQuery) {
                this.dataQuery = {};
            }
            this.dataReponse = {
                page: response.page,
                limit: response.limit,
                total: response.total,
                count: response.count,
                sortColumn: response.sortColumn,
                sortOrder: response.sortOrder,
                items: [],
            };
            try {
                for (const item of response.items) {
                    const row = new TableViewRow();
                    this.dataProvider.createRow(row, item);
                    this.addChildWithoutRepaint(row);
                }
            } finally {
                this.markAsChanged();
            }
            this.dispatch(Signal.TableDataRefreshed);
        });
    }

    /**
     * Create a new query by merging with existing one.
     */
    protected createQueryMerge(partialQuery: DataQuery<T>): DataQuery<T> {
        if (!this.dataQuery) {
            return partialQuery;
        } else {
            return {
                page: partialQuery.page ?? this.dataQuery.page,
                limit: partialQuery.limit ?? this.dataQuery.limit,
                sortColumn: partialQuery.sortColumn ?? this.dataQuery.sortColumn,
                sortOrder: partialQuery.sortOrder ?? this.dataQuery.sortOrder,
                query: partialQuery.query ?? this.dataQuery.query,
            };
        }
    }

    /**
     * Update query, then run refresh.
     */
    protected updateQueryAndRefresh(partialQuery: DataQuery<T>) {
        this.refresh(this.createQueryMerge(partialQuery));
        this.dispatch(Signal.TableColumnSorted);
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

            if (columnSpec.sortable) {
                const sortButton = this.doCreateElement("a");
                sortButton.setAttribute("href", "#");
                let currentSort = (this.dataReponse?.sortOrder ?? this.dataQuery?.sortOrder) === SortOrder.Desc ? SortOrder.Desc : SortOrder.Asc;
                sortButton.innerText = columnSpec.label ?? columnSpec.field;

                // Apply default sort class for theming on the button.
                switch (currentSort) {
                    case SortOrder.Asc:
                        sortButton.classList.add("fg-sort-asc");
                        sortButton.classList.remove("fg-sort-desc");
                        break;
                    case SortOrder.Desc:
                        sortButton.classList.add("fg-sort-desc");
                        sortButton.classList.remove("fg-sort-asc");
                        break;
                }

                // Onclick behavior.
                sortButton.addEventListener("click", (event) => {
                    event.preventDefault();

                    currentSort = currentSort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc;
                    this.updateQueryAndRefresh({
                        sortColumn: columnSpec.field,
                        sortOrder: currentSort ,
                    });

                    switch (currentSort) {
                        case SortOrder.Asc:
                            sortButton.classList.add("fg-sort-asc");
                            sortButton.classList.remove("fg-sort-desc");
                            break;
                        case SortOrder.Desc:
                            sortButton.classList.add("fg-sort-desc");
                            sortButton.classList.remove("fg-sort-asc");
                            break;
                    }
                });

                headerCell.appendChild(sortButton);
            } else {
                headerCell.innerText = columnSpec.label ?? columnSpec.field;
            }
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
