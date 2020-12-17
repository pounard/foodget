import { AbstractContainer, ContainerCell, Widget } from "./core";

// @todo header bar
// @todo sidebar
// @todo popover

export enum PageSizing {
    Auto,
    Scroll,
}

/**
 * Page is a simple widget container with a name.
 */
export class Page extends AbstractContainer<Widget> {
    /**
     * Current page sizing mode.
     */
    private sizing: PageSizing = PageSizing.Auto;

    setPageSizing(sizing: PageSizing): void {
        this.sizing = sizing;
    }

    getSizing(): PageSizing {
        return this.sizing;
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createContainer("fg-page", "section");
        if (this.sizing === PageSizing.Scroll) {
            element.classList.add("fg-v-scroll");
        }
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
 * Window is top-level element for anything.
 *
 * Window instances should not be created outside for App.createWindow()
 * because the App component will handle open/close for you.
 */
export class Window extends Page {
    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createContainer("fg-window", "section");

        const labelElement = this.doCreateElement("div", "fg-window-label");
        const labelTextElement = this.doCreateElement("h1");
        labelTextElement.innerText = this.getLabel() ?? '';
        labelElement.appendChild(labelTextElement);
        element.appendChild(labelElement);

        const wrapperElement = this.doCreateElement("div", "fg-window-in");
        element.appendChild(wrapperElement);

        for (const child of this.getChildren()) {
            wrapperElement.appendChild(this.createCell(child, null, null));
        }
        return element;
    }
}

/**
 * Abstract page container, because we do not like to repeat ourselves.
 */
export abstract class AbstractPageContainer extends AbstractContainer<Page> {
    /**
     * Create new page instance and attach it as a child of this instance.
     */
    createPage(label?: string): Page {
        const page = new Page(label);
        this.addChild(page);
        return page;
    }
}

/**
 * Main application.
 *
 * Handles a main window, and is able to change and get back to previous.
 *
 * @todo Implement origin element copy outside of the DOM in order to be able
 *   to give it back once application is destroyed/disposed.
 */
export class App extends AbstractContainer<Window> {
    /**
     * Currently displayed page (per default the first one).
     */
    private currentId: string | null = null;

    /**
     * HTML Element from the outside where this App is being attached to.
     */
    private origin: HTMLElement | null = null;

    /**
     * Browsing history.
     */
    private history: Window[] = [];

    /**
     * Get last history item.
     */
    protected getLastHistoryItem(): Window | null {
        return this.history[this.history.length - 1];
    }

    protected doOpen(target: ContainerCell<Window>): void {
        for (const child of this.getChildren()) {
            if (child !== target) {
                child.item.hide();
            }
        }
        if (target) {
            this.currentId = target.item.getId();
            target.item.show();
            if (this.getLastHistoryItem() !== target.item) {
                this.history.push(target.item);
            }
        }
    }

    /**
     * Open window and hide others.
     */
    open(window: string | number | Window): void {
        const target = this.findChild(window);
        if (target) {
            if (this.hasChanged()) {
                this.repaint();
            }
            this.doOpen(target);
        }
    }

    /**
     * Close current window.
     */
    closeCurrent() {
        if (2 > this.history.length) {
            throw "Cannot close last window";
        }
        const current = this.history.pop() as Window;
        current.hide();
        const previous = this.getLastHistoryItem();
        if (previous) {
            this.open(previous.getId());
        }
    }

    /**
     * Close and dispose current window.
     */
    disposeCurrent() {
        if (2 > this.history.length) {
            throw "Cannot close last window";
        }
        const current = this.history.pop() as Window;
        const previous = this.getLastHistoryItem();
        this.removeChild(current);
        if (previous) {
            this.open(previous.getId());
        }
    }

    /**
     * Create new window.
     */
    createWindow(label?: string): Window {
        const window = new Window(label);
        this.addChild(window);
        window.hide();
        return window;
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createContainer("fg-app", "section");
        let first = null;
        for (const child of this.getChildren()) {
            element.appendChild(child.item.getElement());
            // Per default, always open the first, but if a selection was
            // already recorded, restore this one instead, and avoir user
            // confusion on repaint.
            if (!first || child.item.getId() === this.currentId) {
                first = child;
            }
        }
        if (first) {
            this.doOpen(first);
        }
        return element;
    }

    /**
     * Start application, when running this, you must be sure that all your
     * UI was built and is ready to run.
     */
    start(element: HTMLElement) {
        this.origin = element;
        this.origin.classList.add("fg-bootstrap");
        if (!this.origin) {
            throw "App must be instanciated calling start() method.";
        }
        this.origin.innerHTML = "";
        this.origin.appendChild(this.getElement());
    }
}
