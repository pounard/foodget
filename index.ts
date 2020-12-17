import { App, Window } from "./src/app";
import { ActionBar, NoteBook, StatusBar } from "./src/container";
import { Signal } from "./src/core";
import { Label, MultilineText } from "./src/display";
import { Button, TextEntry } from "./src/form";
// import { MenuBar } from "./src/menu";

import { initFlowBoxDemo } from "./demo/flowbox";
import { initListBoxDemo } from "./demo/listbox";

const INTRO_TEXT = `Welcome in Foo'dget test.

OK, this is not a good name, yet it is a name, I needed one.

This text is stacked into a "Page" container, itself within a "NoteBook" container. You can add new pages in the notebook by clicking the "Add page" button upper.

Have fun testing. 
`;

const GENERATED_HAIKUS = [
`a dog shakes deeper
hard-pressed and strong shining sun
stained table cloths your eyes`,

`monkey bars like rain
the last ash falls snowflakes fall
leaving home soulful`,

`torn paper trouble
streets full of rain my old home
wishing star heartfelt`,

`stained table cloths gone now
steaming mud waits on my tongue
ferris wheels rise up`,

`sand grains fall your lips
ants signal code in my ears
glowing moon songbird `,

`salted pork wonder
spiders spin webs eyes glisten
small blue bits thoughtless`,


`snowflakes fall in dreams
a glass of wine in the yard
eyes glisten mutters`,


`stained table cloths risen
steaming mud waits sand grains fall
beneath sky forlorn`,


`on this day learning
under blessed skies sand grains fall
in the yard lifeless`,


`when i died comforts
shadows silent in the trees
worried glance your eyes`
];

function createAddPageForm(app: App, noteBook: NoteBook): Window {
    const window = new Window("Add new page");

    const name = new TextEntry();
    window.addChild(new Label("Please input name"));
    window.addChild(name);

    const cancelButton = new Button("Cancel");
    cancelButton.connect(Signal.Clicked, () => app.closeCurrent());

    const createButton = new Button("Create");
    createButton.connect(Signal.Clicked, () => {
        const page = noteBook.createPage(name.getValue());
        const text = new MultilineText();
        text.setText(GENERATED_HAIKUS[Math.floor(Math.random() * GENERATED_HAIKUS.length)]);
        page.addChild(text);
        noteBook.repaint();
        noteBook.displayPage(page.getId());
        app.closeCurrent();
    });

    const actionBar = new ActionBar();
    actionBar.addChild(cancelButton);
    actionBar.addChild(createButton);

    window.addChild(actionBar);

    return window;
}

const element = document.querySelector("#app") as HTMLElement|null;
if (element) {
    const app = new App();
    const mainWindow = app.createWindow("Welcome in my first app !");

    /*
    const menuBar = new MenuBar();
    const menu1 = menuBar.createMenu();
    menu1.setLabel("Faire");

    const helloItem = menu1.createMenuItem();
    helloItem.setLabel("Hello, World !");
    helloItem.connect(Signal.Clicked, () => window.alert("Hello, World !"));
    menu1.createSeparator();
    const universeItem = menu1.createMenuItem();
    universeItem.setLabel("Hello, Universe !");
    universeItem.connect(Signal.Clicked, () => window.alert("Hello, Universe !"));
     */

    const actionBar = new ActionBar();
    actionBar.addChild(new Label("This is an action bar"));
    mainWindow.addChild(actionBar);

    const flowBoxWindow = initFlowBoxDemo(app);
    const flowBoxOpenButton = new Button("FlowBox");
    flowBoxOpenButton.connect(Signal.Clicked, () => app.open(flowBoxWindow.getId()));
    actionBar.addChild(flowBoxOpenButton);

    const listBoxWindow = initListBoxDemo(app);
    const listBoxOpenButton = new Button("ListBox");
    listBoxOpenButton.connect(Signal.Clicked, () => app.open(listBoxWindow.getId()));
    actionBar.addChild(listBoxOpenButton);

    const noteBook = new NoteBook();
    mainWindow.addChild(noteBook);

    const page1 = noteBook.createPage("Introduction");
    const introText = new MultilineText();
    introText.setText(INTRO_TEXT);
    page1.addChild(introText);

    const statusBar = new StatusBar();
    statusBar.addChild(new Label("This is a status bar."));
    mainWindow.addChild(statusBar);

    const addPageWindow = createAddPageForm(app, noteBook);
    const addPageOpenButton = new Button("Add page");
    addPageOpenButton.connect(Signal.Clicked, () => app.open(addPageWindow.getId()));
    actionBar.addChild(addPageOpenButton);
    app.addChild(addPageWindow);

    app.start(element);
}
