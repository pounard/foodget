import { App, Window } from "../src/app";
import { ActionBar } from "../src/container";
import { Signal } from "../src/core";
import { Image, Label } from "../src/display";
import { Button, ImageButton } from "../src/form";
import { FlowBox } from "../src/list";

export function createFlowBoxDemo(app: App): void {
    const window = new Window("FlowBox example");
    const flowbox = new FlowBox();

    for (let x = 0; x < 1000; x++) {
        const image = new Image();
        image.setUri(colorImage(randomColor(), 24, 24));
        const button = new ImageButton();
        button.setImage(image);
        flowbox.addChild(button);
    }

    const actionBar = new ActionBar();
    actionBar.addChild(new Label(`This flowbox contains 1000 elements`));
    const closeButton = new Button("Close");
    closeButton.connect(Signal.Clicked, () => app.disposeCurrent())
    actionBar.addChild(closeButton)

    window.addChild(actionBar);
    window.addChild(flowbox);
    app.addChild(window);
    app.display(window);
}

interface Color {
    R: number,
    G: number,
    B: number,
}

function colorImage(color: Color, width: number, height: number): string {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw "Could not create canvas context";
    }
    ctx.fillStyle = `rgb(${color.R}, ${color.G}, ${color.B})`
    ctx.fillRect(0, 0, 24, 24);

    return canvas.toDataURL();
}

function randomColor(): Color {
    return {
        R: Math.floor(Math.random() * 256),
        G: Math.floor(Math.random() * 256),
        B: Math.floor(Math.random() * 256),
    }
}
