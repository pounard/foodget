import { AbstractContainer, CellAlignment } from "./core";

// @todo flowbox
// @todo listbox
// @todo treeview

/**
 * FlowBox displays item the same way as CSS flexbox would. 
 */
export class FlowBox extends AbstractContainer {
    /**
     * @inheritdoc
     */
    configure() {
        this.setCellAlignment(CellAlignment.Center);
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createAlignedContainer("fg-flowbox");
        for (const child of this.getChildren()) {
            element.appendChild(this.createAlignedCell(child, "fg-flowbox-item"));
        }
        return element;
    }
}

/**
 * ListBox initializer callback.
 */
type ListBoxRowInitializer = (row: ListBoxRow) => void;

/**
 * ListBox row.
 */
export class ListBoxRow extends AbstractContainer {
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
        const element = this.createContainer("fg-listbox-row");
        for (const child of this.getChildren()) {
            element.appendChild(this.createCell(child, "fg-listbox-row-item"));
        }
        return element;
    }
}

/**
 * ListBox displays rows.
 */
export class ListBox extends AbstractContainer<ListBoxRow> {
    /**
     * Add row.
     */
    addRow(init: ListBoxRowInitializer): void {
        const row = new ListBoxRow();
        init(row);
        this.addChild(row);
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createContainer("fg-listbox");
        for (const child of this.getChildren()) {
            // Render directly the children items.
            element.appendChild(child.item.getElement());
        }
        return element;
    }
}
