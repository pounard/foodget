import { AbstractWidget, Signal } from "./core";
import { Icon, IconName, IconSize, Image } from "./display";

// @todo Switch button (button with state)
// @todo radios buttons (radios)
// @todo combo boxes (select)
// @todo drop down
// @todo toggle button (button with state, alias of checkbox in term of features)
// @todo entry (text)
// @todo search entry (text with theming)
// @todo password entry (password)
// @todo spin button (number)
// @todo editable label
// @todo multiline entry (textarea)
// @todo horizontal/vertical scales
// @todo calendar

/**
 * Simple text entry.
 */
export class TextEntry extends AbstractWidget {
    private value: string = '';

    setValue(value: string): void {
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.doCreateElement("input", "fg-entry-text") as HTMLInputElement;
        element.setAttribute("type", 'text');
        // @todo better handle signals
        element.value = this.value;
        element.addEventListener("change", () => {
            this.value = element.value ?? '';
            this.dispatch(Signal.EntryChanged);
        });
        return element;
    }
}

/**
 * Multiline text entry.
 *
 * We are in a browser, this will be a vanilla textarea HTML element.
 */
export class MultilineTextEntry extends AbstractWidget {
    private value: string = '';

    setValue(value: string): void {
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.doCreateElement("textarea", "fg-entry-text-multi") as HTMLInputElement;
        // @todo better handle signals
        element.value = this.value;
        element.addEventListener("change", () => {
            this.value = element.value ?? '';
            this.dispatch(Signal.EntryChanged);
        });
        return element;
    }
}

/**
 * Simple button.
 */
export class CheckBox extends AbstractWidget {
    /**
     * Current state.
     */
    private checked: boolean = false;

    /**
     * Checkbox value.
     */
    private value: string | null = null; 

    setChecked(checked: boolean = true): void {
        this.checked = checked;
    }

    isChecked(): boolean {
        return this.checked;
    }

    setValue(value: string | null): void {
        this.value = value;
    }

    getValue(): string | null {
        return this.value ?? null;
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.doCreateElement("div", "fg-checkbox");
        const inputElement = this.doCreateElement("input") as HTMLInputElement;
        inputElement.setAttribute("type",  "checkbox");
        if (this.checked) {
            inputElement.setAttribute("checked", "checked");
        }
        if (this.value) {
            inputElement.setAttribute("value", this.value);
        }
        element.appendChild(inputElement);

        const label = this.getLabel();
        if (label) {
            const labelElement = this.doCreateElement("label");
            labelElement.innerHTML= label;
            element.appendChild(labelElement);
        }

        inputElement.addEventListener("click", () => {
            this.checked = inputElement.checked;
            this.dispatch(Signal.Clicked);
            if (inputElement.checked) {
                this.dispatch(Signal.EntryChecked);
            } else {
                this.dispatch(Signal.EntryUnchecked);
            }
        });

        return element;
    }
}

/**
 * Simple button.
 */
export class Button extends AbstractWidget {
    /**
     * Icon if any.
     */
    private icon: Icon | null = null;

    /**
     * @inheritdoc
     */
    constructor(label: string, iconName?: IconName, iconSize?: IconSize) {
        super(label);
        this.setIcon(iconName, iconSize);
    }

    /**
     * Set icon.
     */
    setIcon(iconName?: IconName, iconSize?: IconSize) {
        this.icon?.dispose();
        if (iconName) {
            this.icon = new Icon(iconName, iconSize);
        } else {
            this.icon = null;
        }
    }

    /**
     * Get icon.
     */
    getIcon(): Icon | null {
        return this.icon;
    }

    /**
     * @inheritdoc
     */
    getNestedWidgets() {
        return this.icon ? [this.icon] : null;
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.doCreateElement("button", "fg-button");
        if (this.icon) {
            element.appendChild(this.icon.getElement());
        }
        const label = this.getLabel();
        if (label) {
            const textElement = this.doCreateElement("span");
            textElement.innerText = label;
            element.appendChild(textElement);
        }
        element.addEventListener("click", () => this.dispatch(Signal.Clicked));
        return element;
    }
}

/**
 * Simple button with image.
 */
export class ImageButton extends AbstractWidget {
    /**
     * Image if any.
     */
    private image: Image | null = null;

    /**
     * Set image.
     */
    setImage(image?: Image): void {
        this.image?.dispose();
        this.image = image ?? null;
    }

    /**
     * Get image.
     */
    getImage(): Image | null {
        return this.image;
    }

    /**
     * @inheritdoc
     */
    getNestedWidgets() {
        return this.image ? [this.image] : null;
    }

    /**
     * @inheritdoc
     */
    createElement() {
        const element = this.doCreateElement("button", "fg-button");
        if (this.image) {
            element.append(this.image.getElement());
        }
        const label = this.getLabel();
        if (label) {
            const textElement = this.doCreateElement("span");
            textElement.innerText = label;
            element.appendChild(textElement);
        }
        element.addEventListener("click", () => this.dispatch(Signal.Clicked));
        return element;
    }
}
