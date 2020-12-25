/**
 * Handler interface for signal emitters.
 */
export type Handler<T> = (source: T) => void;

/**
 * Type alias for user CSS class list.
 */
export type Classes = null | string | string[];

/**
 * Container initializer.
 */
export type ContainerInitializer<T extends Container> = (source: T) => void;

/*
 * Sad and depressing, but working.
 */
let ID_COUNT = 0;

/**
 * All signals, some might not be in use on your widgets.
 */
export enum Signal {
    /**
     * For input elements, value has changed.
     */
    EntryChanged,

    /**
     * For checkbox input elements, checkbox was checked.
     */
    EntryChecked,

    /**
     * For checkbox input elements, checkbox was unchecked.
     */
    EntryUnchecked,

    /**
     * For all clickable elements, element was clicked.
     */
    Clicked,

    /**
     * Widget was disposed.
     */
    Disposed,

    /**
     * Widget was hidden.
     */
    Hidden,

    /**
     * Widget was repaint.
     */
    Repaint,

    /**
     * Widget was displayed.
     */
    Showed,

    /**
     * Stacked container in a container stack is being displayed.
     */
    StackDisplayed,

    /**
     * Table was sorted using a dedicated column.
     * This signal is called before repaint;
     */
    TableColumnSorted,

    /**
     * Table data was refreshed using the data provider.
     * This signal is called before repaint;
     */
    TableDataRefreshed,
}

/**
 * Emit signals.
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
    /**
     * Align cell to the left in container.
     */
    Left,

    /**
     * Align cell at the center in container.
     */
    Center,

    /**
     * Align cell to the right in container.
     */
    Right,
}

/**
 * Cell sizing.
 */
export enum CellSizing {
    /**
     * Expand cell to maximum width within container free space.
     */
    Expand,

    /**
     * Shrink cell to minimun width to fit its contents.
     */
    Shrink,
}

/**
 * Shortcut for a few methods.
 *
 * @todo Get rid of this interface?
 */
export interface ContainerCellDisplay {
    /**
     * Cell alignment.
     */
    alignment: CellAlignment,

    /**
     * Cell sizing.
     */
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
export interface ContainerCell<T extends Widget = Widget, H = any> extends ContainerCellDisplay {
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
     * Is this a container.
     */
    isContainer(): boolean;

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
export interface Container<T extends Widget = Widget, H = any> extends Widget {
    /**
     * Set initializer.
     */
    setInitializer(initializer: ContainerInitializer<this>): void;

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
     * Does this container contains only containers.
     */
    containsOnlyContainers(): boolean;

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

    /**
     * Force this container to call once initializer, and refresh all contents.
     *
     * This will only call repaint() if no initializer is set.
     */
    refresh(): void;
}

/**
 * A ContainerStack is a container that allows only one of its children to be
 * displayed at a time. App and NoteBook are both the most comprehensive
 * exemples.
 *
 * Container stack will use the ContainerCell.handle property to attach
 * triggering elements that displays its childs.
 */
export interface ContainerStack<T extends Container, H = any> extends Container<T, H> {
    /**
     * Create and stack new child container.
     */
    stack(label?: string): T;

    /**
     * Display stacked child container and hide others..
     */
    display(stacked: string | WidgetPosition | T): void;
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
        this.label = label ?? null;
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
     * Get associated widget, not children but components of this widget.
     *
     * It is imperative to implement if you use other components to build
     * a more complex widget, so that refresh(), repaint() and dispose()
     * will handle those correctly.
     */
    protected getNestedWidgets(): Widget[] | null {
        return null;
    };

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
    protected markAsChanged(): void {
        this.changed = true;
        if (this.element && this.displayed) {
            this.repaint();
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
    isContainer() {
        return false;
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
        this.markAsChanged();
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
        this.markAsChanged();
    }

    /**
     * @inheritdoc
     */
    hide() {
        this.displayed = false;
        this.markAsChanged();
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
        this.markAsChanged();
    }

    /**
     * @inheritdoc
     */
    deactivate() {
        this.activated = false;
        this.onDeactivate();
        this.markAsChanged();
    }

    /**
     * @inheritdoc
     */
    dispose() {
        this.changed = false;
        this.getNestedWidgets()?.forEach(widget => widget.dispose());
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
            this.changed = false;
        }

        if (this.displayed) {
            this.element.style.display = "";
        } else {
            this.element.style.display = "none";
        }

        return this.element;
    }

    /**
     * @inheritdoc
     */
    repaint() {
        if (this.changed) {
            // Repaint all nested widgets.
            this.getNestedWidgets()?.forEach(widget => widget.repaint());
            // Backup previous element first, then remove its reference from
            // the current instance to force repaint. Previous elmeent will
            // be really replaced in DOM only once the new element will be
            // fully renderered outside of the DOM, avoiding empty content
            // flashes that could happen.
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
     * All children are containers.
     */
    private containersOnly: boolean = true;

    /**
     * Container cell alignment.
     */
    private cellAlignment: CellAlignment = CellAlignment.Left;

    /**
     * Current container sizing mode.
     */
    private containerSizing: ContainerSizing = ContainerSizing.Scroll;

    /**
     * Was this container initalized at least once?
     */
    private initialized: boolean = false;

    /**
     * Container initalizer.
     */
    private initializer?: ContainerInitializer<this>;

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
    protected applyContainerSizing(element: HTMLElement, sizing: ContainerSizing, alignment: CellAlignment): void {
        switch (sizing) {
            case ContainerSizing.Expand:
                element.classList.add('fg-c-e');
                break;
            case ContainerSizing.Scroll:
                element.classList.add('fg-c-s');
                break;
        }
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
    }

    /**
     * Use this instead of document.createElement().
     */
    protected createContainer(className?: Classes, tagName: string = "div"): HTMLElement {
        const element = document.createElement(tagName);
        this.doApplyClasses(element, className);
        this.applyContainerSizing(element, this.containerSizing, this.cellAlignment);
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
     * When you bring modifications to the array, you need to recompute each
     * item position.
     */
    protected recomputeChildrenPositions(): void {
        this.containersOnly = true;
        for (let i = 0; i < this.children.length; ++i) {
            const child = this.children[i];
            child.position = i as WidgetPosition;
            this.containersOnly = this.containersOnly && child.item.isContainer();
        }
    }

    /**
     * @inheritdoc
     */
    isContainer() {
        return true;
    }

    /**
     * @inheritdoc
     */
    setInitializer(initializer: ContainerInitializer<this>): void {
        this.initializer = initializer;
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
    containsOnlyContainers() {
        return this.children.length > 0 && this.containersOnly;
    }

    /**
     * Get default child sizing mode.
     */
    protected defaultChildSizing(): CellSizing {
        return CellSizing.Shrink;
    }

    /**
     * Get default child alignment mode.
     */
    protected defaultChildAlignment(): CellAlignment {
        return CellAlignment.Left;
    }

    /**
     * Use this when you need to build a complex widget to delay repaint
     * at the end of your procedure. If you use this, you will need to
     * run markAsChanged() manually.
     */
    protected addChildWithoutRepaint(child: T, sizing?: CellSizing, alignment?: CellAlignment, position?: WidgetPosition): void {
        if (position) {
            throw "addChild() with explicit position is not implemented yet.";
        }

        this.containersOnly = this.containersOnly && child.isContainer();

        this.children.push({
            alignment: alignment ?? this.defaultChildAlignment(),
            item: child,
            position: this.children.length as WidgetPosition,
            sizing: sizing ?? this.defaultChildSizing(),
        });
    }

    /**
     * @inheritdoc
     */
    addChild(child: T, sizing?: CellSizing, alignment?: CellAlignment, position?: WidgetPosition): void {
        this.addChildWithoutRepaint(child, sizing, alignment, position);
        this.markAsChanged();
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
            this.markAsChanged();
        }
    }

    /**
     * Remove all children of this container.
     */
    protected removeAllChildrenWithoutRepaint(): void {
        const children = this.children;
        this.children = [];
        for (const child of children) {
            child.item.dispose();
        }
        this.markAsChanged();
    }

    /**
     * Remove all children of this container.
     */
    protected removeAllChildren(): void {
        this.removeAllChildrenWithoutRepaint();
        this.containersOnly = true;
        this.markAsChanged();
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
    getElement() {
        // Transparent initialization upon first paint.
        if (!this.initialized) {
            if (this.initializer) {
                this.initializer(this);
            }
            this.initialized = true;
        }
        return super.getElement();
    }

    /**
     * @inheritdoc
     */
    repaint() {
        // Even if we did not changed, attempt repaint upon children, those
        // who have changed will recursively be repainted.
        for (const child of this.children) {
            // When we repaint a container, children getElement() method will
            // return the same element until the element changes, this means
            // that we actually do not rebuild the whole structure, we only
            // rebuild what's really changed.
            child.item.repaint();
        }
        super.repaint();
    }

    /**
     * @inheritdoc
     */
    refresh() {
        if (this.initializer) {
            this.removeAllChildrenWithoutRepaint();
            this.initializer(this);
        }
        this.repaint();
    }
}

/**
 * Base implementation for container stack.
 *
 * Per default, is not element is displayed, then first will be.
 *
 * Implements must correctly refresh their trigger active/inactive state during
 * the repaint, the display() method will only show()/hide() children and mark
 * the current container has changed for later repaint() call.
 *
 * Do never call the display() method during repaint or you'll experience an
 * inifinite loop.
 */
export abstract class AbstractContainerStack<T extends Container, H = any> extends AbstractContainer<T> implements ContainerStack<T> {
    /**
     * Current tab being displayed, help for repaint.
     */
    private currentId: string | null = null;

    /**
     * Is this child the one being displayed.
     */
    protected isDisplayedChild(child: ContainerCell<T, H>): boolean {
        return this.currentId === child.item.getId();
    }

    /**
     * Create new stacked container instance.
     */
    protected abstract createNewStackedInstance(label?: string): T;

    /**
     * Create and stack new child container.
     */
    stack(label?: string): T {
        const stacked = this.createNewStackedInstance(label);
        if (!this.currentId) {
            this.currentId = stacked.getId();
            stacked.show();
        } else {
            stacked.hide();
        }
        this.addChild(stacked);
        return stacked;
    }

    /**
     * @inheritdoc
     */
    display(stacked: string | WidgetPosition | T): void {
        const target = this.findChild(stacked);

        if (!target) {
            throw "Could not find stacked container to display.";
        }

        if (this.isDisplayedChild(target)) {
            // Do nothing if the current target item is already the one
            // being displayed, avoid unnecessary repaint calls.
            return;
        }

        this.currentId = target.item.getId();

        for (const candidate of this.getChildren()) {
            if (target !== candidate) {
                candidate.item.hide();
            }
        }
        target.item.show();

        this.markAsChanged();
    }
}
