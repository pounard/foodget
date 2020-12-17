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
     * Currently displayed page (per default the first one).
     */
    private displayedPageId: string | null = null;

    /**
     * Internal quick access to structures.
     */
    private tabIndex: NoteBookPage[] | null = null;

    /**
     * Select page.
     *
     * @param offset string | number
     *   Page element id, or page position.
     */
    displayPage(id: string): void {
        const position = this.findChildPosition(id);
        let toBeShown: NoteBookPage | null = null;

        for (let tab of this.tabIndex ?? []) {
            if (position === tab.position) {
                toBeShown = tab;
            } else {
                tab.page.hide();
                tab.nav.classList.remove("active");
            }
        }

        if (toBeShown) {
            toBeShown.page.show();
            toBeShown.nav.classList.add("active");
        }
    }

    /**
     * Get displayed page widget identifier.
     */
    getDisplayedPageId(): string {
        if (!this.displayedPageId) {
            const children = this.getChildren();
            if (!children.length) {
                throw "Notebook as no pages.";
            }
            children[0].item.show();
            this.displayedPageId = children[0].item.getId();
        }
        return this.displayedPageId as string;
    }

    /**
     * @inheritdoc
     */
    createElement() {
        this.tabIndex = [];

        const element = this.createContainer("fg-notebook");
        const navElement = this.doCreateElement("ul", "fg-notebook-nav");
        const pagesElement = this.doCreateElement("div", "fg-notebook-in");

        for (const child of this.getChildren()) {
            const page = child.item;

            const titleLink = this.doCreateElement("a");
            const currentPageId = page.getId();
            titleLink.setAttribute("href", '#');
            titleLink.innerText = page.getLabel() || "Page";
            titleLink.addEventListener("click", () => this.displayPage(currentPageId));

            const titleElement = this.doCreateElement("li", "fg-notebook-tab");
            titleElement.appendChild(titleLink);
            navElement.appendChild(titleElement);

            const pageWrapperElement = this.createCell(child, "fg-notebook-item");
            pagesElement.appendChild(pageWrapperElement);

            this.tabIndex.push({
                nav: titleElement,
                page: page,
                position: child.position,
            });
        }

        element.appendChild(navElement);
        element.appendChild(pagesElement);

        this.displayPage(this.getDisplayedPageId());

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
