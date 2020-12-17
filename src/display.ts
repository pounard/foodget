import { AbstractWidget } from "./core";

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
