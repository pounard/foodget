/**
 * Handler interface.
 */
export type Handler<T> = (source: T) => void;

/**
 * All signals, some might not be in use on your widgets.
 */
export enum Signal {
    Changed,
    Checked,
    Clicked,
    Disposed,
    Hidden,
    Repaint,
    Showed,
    Unchecked,
}

/**
 * Basic interface.
 */
export interface SignalEmitter {
    /**
     * Register handler for signal.
     */
    connect(signal: Signal, handler: Handler<this>): void;

    /**
     * Dispatcher signal.
     */
    dispatch(signal: Signal): void;
}

/**
 * Type alias.
 */
export type WidgetPosition = number;

/**
 * Alignement constants for when necessary.
 */
export enum CellAlignment {
    Left,
    Center,
    Right,
}

/**
 * Cell sizing.
 */
export enum CellSizing {
    Expand,
    Shrink,
}

/**
 * Shortcut for a few methods.
 */
export interface ContainerCellDisplay {
    alignment: CellAlignment,
    sizing: CellSizing,
}

/**
 * Containers always expand horizontally, you can only control their vertical
 * sizing.
 */
export enum ContainerSizing {
    /**
     * Will let the container expand outside of view port, thus will expand
     * the window it is contained in as well.
     */
    Expand,

    /**
     * Will force the container to adapt to the window size, and add a scrollbar
     * within.
     */
    Scroll,
}

/**
 * Because we need a bit more than just a Widget here.
 */
export interface ContainerCell<T extends Widget, H = any> extends ContainerCellDisplay {
    /**
     * Widget instance.
     */
    item: T,

    /**
     * Widget position.
     */
    position: WidgetPosition,

    /**
     * Handle, may be used or not, for example for Page header nav links.
     */
    handle?: H,
}

/**
 * Type alias for user CSS class list.
 */
export type Classes = null | string | string[];

/*
 * Sad and depressing, but working.
 */
let ID_COUNT = 0;

/**
 * Base widget interface.
 *
 * Because we use it in almost every component, we consider that all widgets
 * have a text/label to display, somewhere.
 */
export interface Widget extends SignalEmitter {
    /**
     * Unique randomly generated identifier.
     */
    getId(): string;

    /**
     * Set humain readable label.
     */
    setLabel(label: string): void;

    /**
     * Get humain readable label.
     */
    getLabel(): string | null;

    /**
     * Can user interact with this element.
     */
    isActive(): boolean;

    /**
     * Can not this user interact with this element.
     */
    isDisabled(): boolean;

    /**
     * Disable user interactions with this element.
     */
    deactivate(): void;

    /**
     * Enable user interactions with this element.
     */
    activate(): void;

    /**
     * Has structure of this object changed since last repaint.
     */
    hasChanged(): boolean;

    /**
     * Is this component displayed.
     */
    isDisplayed(): boolean;

    /**
     * Is this component not displayed.
     */
    isHidden(): boolean;

    /**
     * Force component display.
     */
    show(): void;

    /**
     * Hide component.
     */
    hide(): void;

    /**
     * Get HTML element this widget is based upon.
     *
     * @internal
     *   You should not use this as an API user, it is here for internal use.
     */
    getElement(): HTMLElement;

    /**
     * Dispose this object, free all other components and memory.
     *
     * @internal
     *   You should not use this as an API user, it is here for internal use.
     */
    dispose(): void;

    /**
     * For compoent repaint.
     *
     * @internal
     *   You should not use this as an API user, it is here for internal use.
     */
    repaint(): void;
}

/**
 * Base widget that contains other widgets interface.
 *
 * Usually containers do not provide user interaction other than showing or
 * hiding sub-elements on demand.
 */
export interface Container<T extends Widget, H = any> extends Widget {
    /**
     * Set container sizing behaviour.
     */
    setContainerSizing(sizing: ContainerSizing): void;

    /**
     * Get container sizing behaviour.
     */
    getContainerSizing(): ContainerSizing;

    /**
     * Set container cell alignment.
     */
    setCellAlignment(alignment: CellAlignment): void;

    /**
     * Get container cell alignment.
     */
    getCellAlignment(): CellAlignment;

    /**
     * Add child.
     */
    addChild(child: T, sizing?: CellSizing, alignment?: CellAlignment, position?: WidgetPosition): void;

    /**
     * Remove child.
     */
    removeChild(child: string | WidgetPosition | T): void;

    /**
     * Find child matching id (if string) or at position (if number).
     */
    findChild(offset: string | WidgetPosition | T): ContainerCell<T, H> | null;

    /**
     * Get children.
     *
     * @internal
     *   You should not use this as an API user, it is here for internal use.
     */
    getChildren(): ContainerCell<T, H>[];
}

/**
 * Abstract widget class.
 *
 * Whereas it is possible to fully implement the Widget interface by yourself
 * it is stronly advised to extend this instead.
 */
export abstract class AbstractWidget implements Widget {
    /**
     * Unique randomly generated identifier.
     */
    private id: string | null = null;

    /**
     * Human readable label.
     */
    private label: string | null = null;

    /**
     * Can user interact with this element. 
     */
    private activated: boolean = true;

    /**
     * Is this component displayed. 
     */
    private displayed: boolean = true;

    /**
     * HTML element this widget is based upon. 
     */
    private element: HTMLElement | null = null;

    /**
     * At init, style "display" value is copied here. 
     */
    private elementDisplayValue: string = "";

    /**
     * All connected handlers.
     */
    private connectedHandlers = new Map<Signal, Handler<this>[]>();

    /**
     * Has this element changed
     */
    private changed: boolean = false;

    /**
     * Default constructor.
     */
    constructor(label?: string) {
        if (label) {
            this.setLabel(label);
        }
        this.configure();
    }

    /**
     * Create and return the HTML element.
     *
     * This method will be lazyly called at rendering, you should the instance
     * internals to fully build the HTML markup.
     */
    protected abstract createElement(): HTMLElement;

    /**
     * Act upon object deactivation, if your widget is complex, this where you
     * would, for example, set the disabled="disabled" attribute onto your HTML
     * elements.
     */
    protected onDeactivate(): void {}

    /**
     * Act upon object activation, if your widget is complex, this where you
     * would, for example, remove the disabled="disabled" attribute onto your
     * HTML elements.
     */
    protected onActivate(): void {}

    /**
     * Called at constructor.
     */
    protected configure(): void {};

    /**
     * @inheritdoc
     */
    connect(signal: Signal, handler: Handler<this>) {
        let registered = this.connectedHandlers.get(signal);
        if (!registered) {
            registered = [];
            this.connectedHandlers.set(signal, registered);
        }
        if (-1 === registered.indexOf(handler)) {
            registered.push(handler);
        }
    }

    /**
     * @inheritdoc
     */
    dispatch(signal: Signal) {
        const registered = this.connectedHandlers.get(signal);
        if (registered) {
            for (const handler of registered) {
                handler(this);
            }
        }
    }

    /**
     * Notify this widget structure has changed.
     */
    protected markHasChanged(): void {
        this.changed = true;
    }

    /**
     * Implementation of show().
     */
    protected doShow() {
        if (this.element) {
            this.element.style.display = this.elementDisplayValue;
        }
    }

    /**
     * Implementation of hide().
     */
    protected doHide() {
        if (this.element) {
            this.element.style.display = "none";
        }
    }

    protected doApplyClasses(element: HTMLElement, className?: Classes): void {
        if (className) {
            if (typeof className === "string") {
                element.classList.add(className as string);
            } else {
                for (const classItem of className) {
                    element.classList.add(classItem as string);
                }
            }
        }
    }

    /**
     * Use this instead of document.createElement().
     */
    protected doCreateElement(tagName: string, className?: Classes, withId: boolean = false): HTMLElement {
        const element = document.createElement(tagName);
        this.doApplyClasses(element, className);
        if (withId) {
            element.setAttribute("id", this.getId());
        }
        return element;
    }

    /**
     * @inheritdoc
     */
    getId(): string {
        if (!this.id) {
            this.id = 'fg-' + ID_COUNT++;
        }
        return this.id;
    }

    /**
     * @inheritdoc
     */
    hasChanged(): boolean {
        return this.changed;
    }

    /**
     * @inheritdoc
     */
    setLabel(label: string) {
        this.label = label;
    }

    /**
     * @inheritdoc
     */
    getLabel() {
        return this.label;
    }

    /**
     * @inheritdoc
     */
    isDisplayed() {
        return this.displayed;
    }

    /**
     * @inheritdoc
     */
    isHidden() {
        return !this.displayed;
    }

    /**
     * @inheritdoc
     */
    show() {
        this.displayed = true;
        this.doShow();
    }

    /**
     * @inheritdoc
     */
    hide() {
        this.displayed = false;
        this.doHide();
    }

    /**
     * @inheritdoc
     */
    isActive() {
        return this.activated;
    }

    /**
     * @inheritdoc
     */
    isDisabled() {
        return !this.activated;
    }

    /**
     * @inheritdoc
     */
    activate() {
        this.activated = true;
        this.onActivate();
    }

    /**
     * @inheritdoc
     */
    deactivate() {
        this.activated = false;
        this.onDeactivate();
    }

    /**
     * @inheritdoc
     */
    dispose() {
        if (this.element) {
            this.element.remove();
        }
        this.element = null;
        this.connectedHandlers = new Map<Signal, Handler<this>[]>();
    }

    /**
     * @inheritdoc
     */
    getElement() {
        if (!this.element || this.changed) {
            this.element = this.createElement();
            this.elementDisplayValue = this.element.style.display;
            this.changed = false;
        }

        if (this.displayed) {
            this.doShow();
        } else {
            this.doHide();
        }

        return this.element;
    }

    /**
     * @inheritdoc
     */
    repaint() {
        if (this.changed) {
            const previousElement = this.element;
            this.element = null;
            this.element = this.getElement();
            if (previousElement) {
                previousElement.replaceWith(this.element);
            }
        }
    }
}

/**
 * Abstract widget class.
 *
 * Whereas it is possible to fully implement the Widget interface by yourself
 * it is stronly advised to extend this instead.
 */
export abstract class AbstractContainer<T extends Widget = Widget, H = any> extends AbstractWidget implements Container<T, H> {
    /**
     * Container widget children.
     */
    private children: ContainerCell<T, H>[] = [];

    /**
     * Container cell alignment.
     */
    private cellAlignment: CellAlignment = CellAlignment.Left;

    /**
     * Current container sizing mode.
     */
    private containerSizing: ContainerSizing = ContainerSizing.Scroll;

    /**
     * Default constructor.
     */
    constructor(label?: string) {
        super(label);
        // OK Sad stuff there, this class default properties are set after
        // the parent class constructor is called, which means that if
        // configure() sets a value, it will be overriden. We do need to
        // re-call this here (sorry).
        this.configure();
    }

    /**
     * Apply cell sizing and alignment on the given HTML element.
     */
    protected applyCellSizing(element: HTMLElement, display: ContainerCellDisplay): void {
        switch (display.sizing) {
            case CellSizing.Expand:
                element.classList.add('fg-w-e');
                break;
            case CellSizing.Shrink:
                element.classList.add('fg-w-s');
                break;
        }
        switch (display.alignment) {
            case CellAlignment.Left:
                element.classList.add('fg-w-l');
                break;
            case CellAlignment.Center:
                element.classList.add('fg-w-c');
                break;
            case CellAlignment.Right:
                element.classList.add('fg-w-r');
                break;
        }
    }

    /**
     * Apply container sizing on the given HTML  element.
     */
    protected applyContainerSizing(element: HTMLElement, sizing: ContainerSizing): void {
        switch (sizing) {
            case ContainerSizing.Expand:
                element.classList.add('fg-c-e');
                break;
            case ContainerSizing.Scroll:
                element.classList.add('fg-c-s');
                break;
        }
    }

    /**
     * Use this instead of document.createElement().
     */
    protected createContainer(className?: Classes, tagName: string = "div"): HTMLElement {
        const element = document.createElement(tagName);
        this.doApplyClasses(element, className);
        element.setAttribute("id", this.getId());
        return element;
    }

    /**
     * Use this instead of document.createElement().
     *
     * If null is passed instead of the tagName parameter, child element will
     * not be wrapped into another container, and rendered directly. Rule of
     * thumb being that if your cell is a container, don't add an extra div.
     */
    protected createCell(child: ContainerCell<T>, className?: Classes, tagName: string | null = "div"): HTMLElement {
        if (tagName) {
            const element = document.createElement(tagName);
            this.doApplyClasses(element, className);
            this.applyCellSizing(element, child);
            element.setAttribute("id", child.item.getId());
            element.appendChild(child.item.getElement());
            return element;
        }
        const element = child.item.getElement();
        this.doApplyClasses(element, className);
        this.applyCellSizing(element, child);
        element.setAttribute("id", child.item.getId());
        return element;
    }

    /**
     * Use this instead of document.createElement().
     */
    protected createAlignedContainer(className?: Classes, tagName: string = "div"): HTMLElement {
        const element = this.createContainer(className, tagName);
        element.classList.add('fg-c');
        switch (this.cellAlignment) {
            case CellAlignment.Left:
                element.classList.add('fg-c-l');
                break;
            case CellAlignment.Center:
                element.classList.add('fg-c-c');
                break;
            case CellAlignment.Right:
                element.classList.add('fg-c-r');
                break;
        }
        return element;
    }

    /**
     * Use this instead of document.createElement().
     */
    protected createAlignedElement(className?: Classes, tagName: string = "div"): HTMLElement {
        const element = this.doCreateElement(tagName, className);
        element.classList.add('fg-c');
        switch (this.cellAlignment) {
            case CellAlignment.Left:
                element.classList.add('fg-c-l');
                break;
            case CellAlignment.Center:
                element.classList.add('fg-c-c');
                break;
            case CellAlignment.Right:
                element.classList.add('fg-c-r');
                break;
        }
        return element;
    }

    /**
     * Use this instead of document.createElement().
     */
    protected createAlignedCell(child: ContainerCell<T>, className?: Classes, tagName: string | null = "div"): HTMLElement {
        const element = this.createCell(child, className, tagName);
        element.classList.add('fg-w');
        return element;
    }

    /**
     * When you bring modifications to the array, you need to recompute each
     * item position.
     */
    protected recomputeChildrenPositions(): void {
        for (let i = 0; i < this.children.length; ++i) {
            this.children[i].position = i as WidgetPosition;
        }
    }

    /**
     * @inheritdoc
     */
    setContainerSizing(sizing: ContainerSizing): void {
        this.containerSizing = sizing;
    }

    /**
     * @inheritdoc
     */
    getContainerSizing(): ContainerSizing {
        return this.containerSizing;
    }

    /**
     * @inheritdoc
     */
    setCellAlignment(alignment: CellAlignment): void {
        this.cellAlignment = alignment;
    }

    /**
     * @inheritdoc
     */
    getCellAlignment(): CellAlignment {
        return this.cellAlignment;
    }

    /**
     * @inheritdoc
     */
    addChild(child: T, sizing?: CellSizing, alignment?: CellAlignment, position?: WidgetPosition): void {
        if (position) {
            throw "addChild() with explicit position is not implemented yet.";
        }

        this.children.push({
            alignment: alignment ?? CellAlignment.Left,
            item: child,
            position: this.children.length as WidgetPosition,
            sizing: sizing ?? CellSizing.Shrink
        });

        this.markHasChanged();
    }

    /**
     * @inheritdoc
     */
    removeChild(child: string | WidgetPosition | T): void {
        const target = this.findChild(child);
        if (target) {
            target.item.dispose();
            this.children.splice(target.position, 1);
            this.recomputeChildrenPositions();
            this.repaint();
        }
    }

    /**
     * Remove all children of this container.
     */
    protected removeAllChildren(repaint: boolean = true): void {
        const children = this.children;
        this.children = [];
        for (const child of children) {
            child.item.dispose();
        }
        if (repaint) {
            this.repaint();
        }
    }

    /**
     * @inheritdoc
     */
    findChild(offset: string | WidgetPosition | T): ContainerCell<T> | null {
        if (typeof offset === "string") {
            for (const child of this.children) {
                if (child.item.getId() === offset) {
                    return child;
                }
            }
        } else if (typeof offset === "number") {
            if (offset < 0 ?? offset >= this.children.length) {
                return null;
            }
            for (const child of this.children) {
                if (child.position === offset) {
                    return child;
                }
            }
        } else {
            for (const child of this.children) {
                if (child.item === offset) {
                    return child;
                }
            }
        }
        return null;
    }

    /**
     * @inheritdoc
     */
    getChildren() {
        return this.children;
    }

    /**
     * @inheritdoc
     */
    dispose() {
        for (const child of this.children) {
            child.item.dispose();
        }
        this.children = [];
        super.dispose();
    }

    /**
     * @inheritdoc
     */
    repaint() {
        for (const child of this.children) {
            if (child.item.hasChanged()) {
                child.item.repaint();
            }
        }
        super.repaint();
    }
}
