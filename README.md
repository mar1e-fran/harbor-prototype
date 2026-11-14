# Harbor prototype (UXD 370 Hi-Fi)

Exported from the Claude design canvas. Every screen is 390 × 844.

## Run it in VS Code

1. Open this folder in VS Code (File › Open Folder).
2. Install the **Live Server** extension (VS Code will suggest it).
3. Right-click `index.html` and choose **Open with Live Server**.

Any local web server works too, for example `python3 -m http.server` in this
folder, then open http://localhost:8000.

Opening a file by double-clicking it will not work: screens load their
components from sibling files, which browsers block without a server.

## What is in the folder

- `index.html`: list of every screen, with a button that clears saved data.
- `*.dc.html`: one file per screen or component. Markup is inside `<x-dc>`,
  logic is the `class Component` script at the bottom. A screen pulls in a
  component with `<dc-import name="NavBar">`, which loads `NavBar.dc.html`.
- `support.js`: the runtime from the Claude design canvas that renders the
  `.dc.html` files (it includes React). Do not edit.
- `assets/`: images and icons.
- `canvas.json`: the layout of the artboards on the Claude canvas. Not needed
  to run the prototype.

## Notes

- Fonts (Poppins, DM Sans, Inter, Urbanist, Lexend) load from Google Fonts,
  so they need an internet connection.
- Your name, mood, notes and career fair registration are saved in the
  browser's local storage. Use "Clear saved data" on `index.html` to reset.
- Changes made here do not go back to the Claude canvas.
