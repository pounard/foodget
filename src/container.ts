import { AbstractContainer, CellAlignment, ContainerCell, Widget, WidgetPosition } from "./core";

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
export class NoteBook extends AbstractContainer<NoteBookPage, HTMLElement> {
    /**
     * Current tab being displayed, help for repaint.
     */
    private currentId: string | null = null;

    /**
     * Create new page instance and attach it as a child of this instance.
     */
    createPage(label?: string): NoteBookPage {
        const page = new NoteBookPage(label);
        this.addChild(page);
        return page;
    }

    /**
     * Select page.
     */
    displayPage(page: string | WidgetPosition | NoteBookPage): void {
        const target = this.findChild(page);
        if (!target) {
            throw "Could not find target";
        }
        if (this.hasChanged()) {
            this.currentId = target.item.getId();
            this.repaint();
        } else {
            // Repaint will display tab.
            this.displayTab(target);
        }
    }

    /**
     * Display tab.
     */
    protected displayTab(target: ContainerCell<NoteBookPage, HTMLElement>): void {
        for (const candidate of this.getChildren()) {
            if (target !== candidate) {
                candidate.item.hide();
                if (candidate.handle) {
                    candidate.handle.classList.remove("active");
                }
            }
        }
        this.currentId = target.item.getId();
        target.item.show();
        if (target.handle) {
            target.handle.classList.add("active");
        }
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createContainer("fg-notebook");
        const navElement = this.doCreateElement("ul", "fg-notebook-nav");
        const pagesElement = this.doCreateElement("div", "fg-notebook-in");
        let activePage = null;

        for (const child of this.getChildren()) {
            const page = child.item;

            const titleLink = this.doCreateElement("a");
            const currentPageId = page.getId();
            titleLink.setAttribute("href", '#');
            titleLink.innerText = page.getLabel() ?? "Page";
            titleLink.addEventListener("click", () => this.displayPage(currentPageId));

            const titleElement = this.doCreateElement("li", "fg-notebook-tab");
            titleElement.appendChild(titleLink);
            navElement.appendChild(titleElement);

            // Affect the title element as being the cell handle.
            child.handle = titleElement;

            pagesElement.appendChild(this.createCell(child, "fg-notebook-item", null));

            // Per default, always open the first, but if a selection was
            // already recorded, restore this one instead, and avoir user
            // confusion on repaint.
            if (!activePage || page.getId() === this.currentId) {
                activePage = child;
            }
        }

        element.appendChild(navElement);
        element.appendChild(pagesElement);

        if (activePage) {
            this.displayTab(activePage);
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
