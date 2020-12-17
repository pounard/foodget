import { AbstractPageContainer, Page } from "./app";
import { AbstractContainer, CellAlignment, Widget } from "./core";

// @todo centerbox
// @todo scrolled window
// @todo horizontal and vertical panes
// @todo frame
// @todo expander
// @todo infobar

/**
 * Internal NoteBook container index structure.
 */
interface NoteBookPage {
    readonly nav: HTMLElement;
    readonly page: Page;
    readonly position: number;
}

/**
 * NoteBook container.
 */
export class NoteBook extends AbstractPageContainer {
    /**
     * Current tab being displayed, help for repaint.
     */
    private currentId: string | null = null;

    /**
     * Internal quick access to structures.
     */
    private tabIndex: NoteBookPage[] = [];

    /**
     * Select page.
     *
     * @param offset string | number
     *   Page element id, or page position.
     */
    displayPage(page: string | number | Page): void {
        const target = this.findChild(page);
        if (!target) {
            throw "Could not find target";
        }
        let found: NoteBookPage | null = null;
        for (let tab of this.tabIndex ?? []) {
            if (target.item === tab.page) {
                found = tab;
                break;
            }
        }
        if (this.hasChanged()) {
            this.currentId = target.item.getId();
            this.repaint();
        } else if (found) {
            this.displayTab(found);
        }
    }

    /**
     * Display tab.
     */
    protected displayTab(tab: NoteBookPage): void {
        for (let candidate of this.tabIndex ?? []) {
            if (tab !== candidate) {
                candidate.page.hide();
                candidate.nav.classList.remove("active");
            }
        }
        this.currentId = tab.page.getId();
        tab.page.show();
        tab.nav.classList.add("active");
    }

    /**
     * @inheritdoc
     */
    createElement() {
        this.tabIndex = [];

        const element = this.createContainer("fg-notebook");
        const navElement = this.doCreateElement("ul", "fg-notebook-nav");
        const pagesElement = this.doCreateElement("div", "fg-notebook-in");
        let first = null;

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

            const pageWrapperElement = this.createCell(child, "fg-notebook-item");
            pagesElement.appendChild(pageWrapperElement);

            const tab = {
                nav: titleElement,
                page: page,
                position: child.position,
            };
            // Per default, always open the first, but if a selection was
            // already recorded, restore this one instead, and avoir user
            // confusion on repaint.
            if (!first || page.getId() === this.currentId) {
                first = tab;
            }
            this.tabIndex.push(tab);
        }

        element.appendChild(navElement);
        element.appendChild(pagesElement);

        if (first) {
            this.displayTab(first);
        }

        return element;
    }
}

/**
 * ActionBar is wide, displays inline, and aligns items at the right.
 */
export class ActionBar extends AbstractContainer<Widget> {
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
export class StatusBar extends AbstractContainer<Widget> {
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
