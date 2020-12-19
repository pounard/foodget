import { AbstractWidget, Signal } from "./core";
import { Image } from "./display";

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
    private checked: boolean = false;

    setChecked(checked: boolean = true): void {
        this.checked = checked;
    }

    isChecked(): boolean {
        return this.checked;
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
        element.appendChild(inputElement);

        const label = this.getLabel();
        if (label) {
            const labelElement = this.doCreateElement("label");
            labelElement.innerHTML= label;
            element.appendChild(labelElement);
        }

        inputElement.addEventListener("click", () => {
            this.dispatch(Signal.Clicked);
            this.checked = inputElement.checked;
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
     * @inheritdoc
     */
    createElement() {
        const element = this.doCreateElement("button", "fg-button");
        element.innerText = this.getLabel() ?? '';
        element.addEventListener("click", () => this.dispatch(Signal.Clicked));
        return element;
    }
}

/**
 * Simple button with image.
 */
export class ImageButton extends AbstractWidget {
    private image: Image | null = null;

    setImage(image: Image): void {
        this.image = image;
    }

    getImage(): Image | null {
        return this.image;
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
            element.appendChild(document.createTextNode(label));
        }
        element.addEventListener("click", () => this.dispatch(Signal.Clicked));
        return element;
    }
}
