import { AbstractWidget, Signal } from "./core";

// @todo spinner
// @todo level bar
// @todo progress bar
// @todo image
// @todo picture
// @todo horizontal/vertical separator
// @todo multiline text

/**
 * Icon name type.
 */
export type IconName = NavigationIcon | NotificationIcon | string;

/**
 * Icon size type.
 */
export type IconSizeValue = IconSize | number;

/**
 * Icon size.
 */
export enum IconSize {
    Default = 18,
    Large = 24,
    Larger = 36,
    Huge = 48,
}

/**
 * Most common navigation icons.
 *
 * Names are stock names from material-icons, but they should exist in most
 * common icon fonts, from Bootstrap, FontAwesome and others.
 */
export enum NavigationIcon {
    Apps = "apps",
    ArrowBack = "arrow_back",
    ArrowDown = "arrow_drop_down",
    ArrowForward = "arrow_forward",
    ArrowLeft = "arrow_left",
    ArrowRight = "arrow_right",
    ArrowUp = "arrow_drop_up",
    Cancel = "cancel",
    Check = "check",
    ChevronLeft = "chevron_left",
    ChevronRight = "chevron_right",
    Close = "close",
    Fullscreen = "fullscreen",
    FullscreenExit = "fullscreen_exit",
    Menu = "menu",
    MoreHorizontal = "more_horiz",
    MoreVertical = "more_vert",
    Refresh = "refresh",
}

/**
 * Most common navigation icons.
 *
 * Names are stock names from material-icons, but they should exist in most
 * common icon fonts, from Bootstrap, FontAwesome and others.
 */
export enum NotificationIcon {
    EventAvailable = "event_available",
    EventBusy = "event_busy",
    EventNote = "event_note",
    Message = "sms",
    MessageFailed = "sms_failed",
    Power = "power",
    PowerOff = "power_off",
    Sync = "sync",
    SyncDisabled = "sync_disabled",
    SyncProblem = "sync_problem",
}

/**
 * Icon display.
 *
 * Icon name can be an enum value, or an arbitrary string, it's up to the
 * rendering pipeline to know what to do with it, or you to extend it to
 * to provide the right icon.
 *
 * Current limitation is that material-ui icon usage is hardcoded. It will
 * changed when the rendering pipeline will be decoupled.
 */
export class Icon extends AbstractWidget {
    /**
     * Icon name.
     */
    private iconName: IconName;

    /**
     * Icon size.
     */
    private iconSize: IconSizeValue;

    /**
     * Get icon name.
     */
    getIconName(): IconName {
        return this.iconName;
    }

    /**
     * Get icon name.
     */
    setIconName(iconName: IconName): void {
        this.iconName = iconName;
    }

    /**
     * Get icon Size.
     */
    getIconSize(): IconSizeValue {
        return this.iconSize;
    }

    /**
     * Get icon Size.
     */
    setIconSize(iconSize: IconSizeValue): void {
        this.iconSize = iconSize;
    }

    /**
     * @inheritdoc
     */
    constructor(iconName: IconName, iconSize?: IconSizeValue) {
        super();
        this.iconName = iconName;
        this.iconSize = iconSize ?? IconSize.Default;
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.doCreateElement("i", "fg-icon");
        element.classList.add("material-icons");
        element.style.fontSize = this.iconSize + "px";
        element.innerHTML = this.iconName;
        return element;
    }
}

/**
 * Simple label.
 */
export class Label extends AbstractWidget {
    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.doCreateElement("p", "fg-label");
        element.innerText = this.getLabel() ?? "";
        return element;
    }
}

/**
 * Link.
 */
export class Link extends AbstractWidget {
    /**
     * Link target.
     */
    private href: string;

    /**
     * @inheritdoc
     */
    constructor(label: string, href?: string) {
        super(label);
        this.href = href ?? '#';
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.doCreateElement("a", "fg-link");
        element.setAttribute("target", "blank");
        element.setAttribute("href", this.href);
        element.innerText = this.getLabel() as string;
        element.addEventListener("click", () => this.dispatch(Signal.Clicked));
        return element;
    }
}

/**
 * Raw HTML element initializer callback.
 */
export type RawHtmlInitializer = (parent: HTMLElement) => void;

/**
 * Consume a user-given initializer callback which gives you an HTML element
 * to attach to, and allow you put anything you wish in it. Beware that the
 * initializer will not be called on repaint(), you will need to invalidate
 * the component manually.
 *
 * You also can just pass raw HTML instead.
 */
export class RawHtml extends AbstractWidget {
    /**
     * User initializer.
     */
    private initializer: RawHtmlInitializer | null = null;

    /**
     * Raw HTML code from the user if any.
     */
    private raw: string | null = null;

    /**
     * @inheritdoc
     */
    constructor(raw: RawHtmlInitializer | string) {
        super();
        if (typeof raw === "string") {
            this.raw = raw;
        } else {
            this.initializer = raw;
        }
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.doCreateElement("div", "fg-raw");
        if (this.initializer) {
            this.initializer(element);
        } else if (this.raw) {
            element.innerHTML = this.raw;
        }
        return element;
    }
}

/**
 * Multiline text.
 */
export class MultilineText extends AbstractWidget {
    private text: string = '';

    setText(text: string) {
        this.text = text;
    }

    getText(): string {
        return this.text;
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.doCreateElement("div", "fg-text");
        element.innerText = this.text;
        return element;
    }
}

/**
 * Image.
 */
export class Image extends AbstractWidget {
    private uri: string | null = null;

    setUri(uri: string): void {
        this.uri = uri;
    }

    getUri(): string | null {
        return this.uri;
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.doCreateElement("img", "fg-image") as HTMLImageElement;
        element.src = this.uri ?? '#broken';
        return element;
    }
}
