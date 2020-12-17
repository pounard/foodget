import { AbstractContainer, AbstractWidget, Signal } from "./core";

export class MenuItemSeparator extends AbstractWidget {
    createElement() {
        const element = document.createElement("li");
        element.classList.add("fg-menu-item-sep");
        element.innerHTML = "<hr/>"
        return element;
    }
}

export class MenuItem extends AbstractWidget {
    createElement() {
        const element = document.createElement("a");
        element.innerText = this.getLabel() ?? '';
        element.addEventListener("click", () => this.dispatch(Signal.Clicked));

        const wrapperElement = document.createElement("li");
        wrapperElement.classList.add("fg-menu-item");
        wrapperElement.append(element);

        return wrapperElement;
    }
}

export class Menu extends AbstractContainer<MenuItem | MenuItemSeparator> {
    createMenuItem(): MenuItem {
        const item = new MenuItem();
        this.addChild(item);
        return item;
    }

    createSeparator(): MenuItemSeparator {
        const item = new MenuItemSeparator();
        this.addChild(item);
        return item;
    }

    createElement() {
        const element = document.createElement("ul");
        element.classList.add("fg-menu-item-list");

        for (const menuItem of this.getChildren()) {
            element.appendChild(menuItem.item.getElement());
        }

        const wrapperElement = document.createElement("div");
        wrapperElement.classList.add("fg-menu");

        const label = this.getLabel();
        if (label) {
            const titleElement = document.createElement("h2");
            titleElement.classList.add("fg-menu-title");
            titleElement.innerText = label;
            wrapperElement.appendChild(titleElement);
        }

        wrapperElement.appendChild(element);

        return wrapperElement;
    }
}

export class MenuBar extends AbstractContainer<Menu> {
    createMenu(): Menu {
        const menu = new Menu();
        this.addChild(menu);
        return menu;
    }

    createElement() {
        const element = document.createElement("nav");
        element.classList.add("fg-menu-bar");

        for (const menu of this.getChildren()) {
            element.appendChild(menu.item.getElement());
        }

        return element;
    }
}
