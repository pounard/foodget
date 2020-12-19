import { AbstractContainer, AbstractContainerStack, WidgetPosition } from "./core";

// @todo header bar
// @todo popover

/**
 * Window is top-level element for anything.
 *
 * Window instances should not be created outside for App.createWindow()
 * because the App component will handle open/close for you.
 */
export class Window extends AbstractContainer {
    /**
     * Create and attach sidebar.
     */
    createSidebar(label?: string) {
        const sidebar = new SideBar(label);
        this.addChild(sidebar);
        return sidebar;
    }

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

        const sidebarElements: HTMLElement[] = [];

        const wrapperElement = this.doCreateElement("div", "fg-window-in");
        for (const child of this.getChildren()) {
            if (child.item instanceof SideBar) {
                sidebarElements.push(this.createCell(child, null, null));
            } else {
                wrapperElement.appendChild(this.createCell(child, null, null));
            }
        }

        if (sidebarElements.length) {
            const outerWrapperElement = this.doCreateElement("div", "fg-window-out");
            for (const sidebarElement of sidebarElements) {
                outerWrapperElement.appendChild(sidebarElement);
            }
            outerWrapperElement.appendChild(wrapperElement);
            element.appendChild(outerWrapperElement);
        } else {
            element.appendChild(wrapperElement);
        }

        return element;
    }
}

/**
 * SideBar is a component that should only attach to the Window container.
 *
 * It is meant to attach at the left side of the screen, and show/hide depending
 * on the screen size (for mobile, responsive version would collapse).
 *
 * Any usage outside of the Window element will make it behave as a simple
 * transparent container.
 */
export class SideBar extends AbstractContainer {
    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createContainer("fg-sidebar", "div");
        for (const child of this.getChildren()) {
            element.appendChild(this.createCell(child, "fg-sidebar-item"));
        }
        return element;
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
export class App extends AbstractContainerStack<Window> {
    /**
     * HTML Element from the outside where this App is being attached to.
     */
    private origin: HTMLElement | null = null;

    /**
     * Browsing history.
     */
    private history: string[] = [];

    /**
     * Get last history item.
     */
    protected getLastHistoryItem(): string | null {
        return this.history[this.history.length - 1];
    }

    /**
     * @inheritdoc
     */
    protected createNewStackedInstance(label?: string) {
        return new Window(label);
    }

    /**
     * @inheritdoc
     */
    display(stacked: string | WidgetPosition | Window): void {
        const target = this.findChild(stacked);
        if (target) {
            super.display(target.item);
            const targetId = target.item.getId();
            if (this.getLastHistoryItem() !== targetId) {
                this.history.push(targetId);
            }
        }
    }

    /**
     * Close current window.
     */
    closeCurrent() {
        if (2 > this.history.length) {
            throw "Cannot close last window";
        }
        this.history.pop();
        const previous = this.getLastHistoryItem() as string;
        this.display(previous);
    }

    /**
     * Close and dispose current window.
     */
    disposeCurrent() {
        if (2 > this.history.length) {
            throw "Cannot close last window";
        }
        const current = this.history.pop() as string;
        const currentChild = this.findChild(current);
        if (currentChild) {
            this.removeChild(currentChild.item);
            currentChild.item.dispose();
        }
        const previous = this.getLastHistoryItem() as string;
        this.display(previous);
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.createContainer("fg-app", "section");
        for (const child of this.getChildren()) {
            if (this.isDisplayedChild(child)) {
                child.item.show();
                element.appendChild(child.item.getElement());
            } else {
                child.item.hide();
            }
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
        // Find child to display.
        let first = true;
        for (const child of this.getChildren()) {
            if (first) {
                child.item.show();
                this.history.push(child.item.getId());
                first = false;
            } else {
                child.item.hide();
            }
        }
        this.origin.innerHTML = "";
        this.origin.appendChild(this.getElement());
    }
}
