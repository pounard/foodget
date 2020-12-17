# Foo'dget, a Foo widget library

Educational project that provides a common legacy old-fashioned GUI widget
toolkit library written in TypeScript.

It's not complete, it's not extendable, it's simple, it's nor fast nor slow.

Why? Because modern JS frameworks seem wrong to me when it comes to building
business oriented software packages. They all mix up HTML rendering, semantic
meaning of components, and state. Also because manipulating the DOM too much
makes you anxious, as well as writing too much JavaScript. I'd like to keep
a sane health.

Deep down inside of me, I thing that JavaScript and everything being in the
browser nowadays are the two worst things that happened to IT during these
last 30 years. Most old-fashioned UI toolkits are now modern too, they have
enough widgets to implement all the needs and beyond, you don't need HTML/CSS
to write a good UI.

Aside of that, Vue, React and Angular are all very good frameworks, I love each
one of them, for many reasons. But sadly, maintaining applications using them
on the long run when you're not a _type in framework name_ specialized developer
is just so insanely and uselessly difficult. They also do not suit very well for
building classical business orientend software packages. Common legacy
old-fashion toolkits are well-suited for this, and are always very simple to
use, they are explicit semantically, you write code, not HTML, and force you to
be explicit in your intent.

No, this API will never have any other depencency than TypeScript, webpack for
bundling (although this might change) and your browser.

This API intents to implement a subset of GTK4 base widgets (in a simpler form)
which altogether are more than enough to build super complete, super powerful
UIs. Pease see https://developer.gnome.org/gtk4/4.0/ch08.html

# Design and runtime flow

It's an old-fashioned widget tree, pretty much like any other existing tooking
modern or old that exists. When a parent is renderered, it triggers its
children rendering as well. When a parent is disposed, it triggers its children
disposal as well.

Every widget or container exposes a set of signals, on which you can arbitrarily
connect code to, in order to react upon user actions. Signals are custom, not
DOM based, this is an explicit choice that as a user, you will never manipulate
anything which is DOM related: this opens the door to alternate rendering
pipelines than the browser.

Runtime flow is rather easy: create an `App` instance, build one or more
`Window` objets attached to it, connect to signals, then run it!

# Widgets

## Existing containers

 - `App` is the main application window, it is a `Page` container on which
   you can additionaly attach various other specific widgets.
 - `Page` is the equivalent of an ordinary window, it can contain anything.
   Moreover it can be stacked in containers which are page containers, such
   as the `Notebook` window. Usually, when a `Page` is displayed, siblings
   are hidden.
 - `Window` is pretty similar to page, except it can only exist as an `App`
   direct child. Only one `Window` at a time can be displayed.
 - `Box` is an arbitrary widget container, the same way `Page` is, it can
   contain anything. It can be stacked in box containers: `HorizontalBox`
   and `VerticalBox`.
 - `HorizontalBox` and `VerticalBox` are containers which can contain one
   or more `Box` containers, stacked horizontally or vertically.
 - `NoteBook` is a `Page` container, which displays each `Page` title as a tab
   allowing the user to switch from one to another.
 - `ActionBar` is a widget that attaches itself on top of a `Page`, which may
   contain arbitrary widgets. Items are aligned to the right.
 - `StatusBar` is a widget that attaches itself at the bottom of a `Page`,
   which may contain arbitrary widgets, items are aligned to the left.
 - `ListBox` displays rows in tabbed fashion,
 - `FlowBox` displays items arbitrarily in lines, with line wrap when going
   out of view port.

## Existing widgets

 - `Button` is a button.
 - `ImageButton` is a button that can contain an image,
 - `TextEntry` is a simple text input,
 - `MultilineText` simply displays text as given, HTML is stripped,
 - `Label` displays text arbitrarily. No markup or line ending are permitted.

## Future containers

 - `HorizontalPane` and `VerticalPane` are containers which contains two
   `Pane` containers each, stacked horizontally or vertically separated with
    a separator bar, which can be resized.
 - `Frame` is an arbitrary widget containers that displays a border around the
   contained widgets.
 - `Expander` behave like a `Frame` with the addition it can be opend or closed
   by clicking on its label.

## Future containers special containers

 - `InfoBar` is a dismissable horizontal container that can be attached
   anywhere, which may contain arbitrary widgets.
 - `SideBar` is a widget that attaches itself on the left or right side of a
   `Page`, which may contain arbitrary widgets. It's meant to adapt to viewport
   size and open/closed depending on available space.

## Future widgets

 - Lots, this needs to be documented.

# Roadmap

 - [x] implement widget basics,
 - [x] implement container basics,
 - [x] page switching, browsing basics,
 - [x] implement a much more robust signal API,
 - [x] make rendering more robust,
 - [x] lazyly render hidden items,
 - [ ] implement everything needed for building forms,
 - [x] flow box, list box
 - [ ] tree view
 - [ ] viewport size constraint and scrolled windows (pending),
 - [ ] selections,
 - [ ] shortcuts and accelerators,
 - [ ] accessibility!
 - [ ] unit test it (single thing I think I can't do in (Type|Java)Script,
 - [ ] make theming easier,
 - [ ] provide a few more themes,
 - [ ] decouple rendering (why couldn't it be WebGL or canvas?).
