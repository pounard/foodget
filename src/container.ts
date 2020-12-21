import { AbstractContainer, CellAlignment, Widget, AbstractContainerStack } from "./core";

// @todo centerbox
// @todo scrolled window
// @todo horizontal and vertical panes
// @todo frame
// @todo expander
// @todo infobar

/**
 * NoteBookPage widget, for NoteBook container.
 */
export class NoteBookPage extends AbstractContainer {
    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createContainer("fg-page", "section");
        // @todo Menu bar, if any
        // @todo Status message display, if any
        // @todo Intermediate div for content
        for (const child of this.getChildren()) {
            element.appendChild(this.createCell(child, "fg-page-item"));
        }
        // @todo Status bar, if any
        return element;
    }
}

/**
 * NoteBook container.
 */
export class NoteBook extends AbstractContainerStack<NoteBookPage, HTMLElement> {
    /**
     * @inheritdoc
     */
    createNewStackedInstance(label?: string) {
        return new NoteBookPage(label);
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createContainer("fg-notebook");
        const navElement = this.doCreateElement("ul", "fg-notebook-nav");
        const pagesElement = this.doCreateElement("div", "fg-notebook-in");

        for (const child of this.getChildren()) {
            const page = child.item;

            const titleLink = this.doCreateElement("a");
            titleLink.setAttribute("href", '#');
            titleLink.innerText = page.getLabel() ?? "Page";
            titleLink.addEventListener("click", () => this.display(page));

            const titleElement = this.doCreateElement("li", "fg-notebook-tab");
            titleElement.appendChild(titleLink);
            navElement.appendChild(titleElement);

            if (this.isDisplayedChild(child)) {
                titleElement.classList.add("active");
                page.show();
                pagesElement.appendChild(this.createCell(child, "fg-notebook-item", null));
            } else {
                page.hide();
            }
        }

        element.appendChild(navElement);
        element.appendChild(pagesElement);

        return element;
    }
}

/**
 * NoteBookPage widget, for NoteBook container.
 */
export class HorizontalPaneItem extends AbstractContainer {
    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createContainer("fg-pane-pane", "section");
        for (const child of this.getChildren()) {
            element.appendChild(this.createCell(child, "fg-pane-item"));
        }
        return element;
    }
}

/**
 * Horizontal pane container.
 */
export class HorizontalPane extends AbstractContainer<HorizontalPaneItem> {
    /**
     * Create and stack new child container.
     */
    stack(label?: string): HorizontalPaneItem {
        const stacked = new HorizontalPaneItem(label);
        this.addChild(stacked);
        return stacked;
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createContainer("fg-hpane");
        for (const child of this.getChildren()) {
            element.appendChild(this.createCell(child, null, null));
        }
        return element;
    }
}

/**
 * ActionBar is wide, displays inline, and aligns items at the right.
 */
export class ActionBar extends AbstractContainer {
    /**
     * @inheritdoc
     */
    configure() {
        this.setCellAlignment(CellAlignment.Right);
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createAlignedContainer("fg-actionbar");
        for (const child of this.getChildren()) {
            element.appendChild(this.createAlignedCell(child));
        }
        return element;
    }
}

/**
 * StatusBar is small, displays inline, and aligns items at the left.
 */
export class StatusBar extends AbstractContainer {
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
        const element = this.createAlignedContainer("fg-statusbar");
        for (const child of this.getChildren()) {
            element.appendChild(this.createAlignedCell(child));
        }
        return element;
    }
}

/**
 * Box is simply a box, it contains widgets.
 */
export class Box<T extends Widget> extends AbstractContainer<T> {
    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createAlignedContainer("fg-box");
        for (const child of this.getChildren()) {
            element.appendChild(this.createAlignedCell(child, "fg-box-item"));
        }
        return element;
    }
}

/**
 * Abstract box container, because we do not like to repeat ourselves.
 */
abstract class AbstractBoxContainer extends Box<Box<Widget>> {
    /**
     * Create new boc instance and attach it as a child of this instance.
     */
    createBox(): Box<Widget> {
        const box = new Box<Widget>();
        this.addChild(box);
        return box;
    }
}

/**
 * Display a set of box in columns.
 */
export class HorizontalBox extends AbstractBoxContainer {
    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createAlignedContainer("fg-hbox");
        for (const child of this.getChildren()) {
            element.appendChild(this.createAlignedCell(child, "fg-hbox-item"));
        }
        return element;
    }
}

/**
 * Display a set of boxes in rows.
 */
export class VerticalBox extends AbstractBoxContainer {
    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createAlignedContainer("fg-vbox");
        for (const child of this.getChildren()) {
            element.appendChild(this.createAlignedCell(child, "fg-vbox-item"));
        }
        return element;
    }
}
