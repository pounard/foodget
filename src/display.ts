import { AbstractWidget, Signal } from "./core";

// @todo spinner
// @todo level bar
// @todo progress bar
// @todo image
// @todo picture
// @todo horizontal/vertical separator
// @todo multiline text

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
