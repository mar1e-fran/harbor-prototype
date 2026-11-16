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

- `index.html`: opens the prototype (onboarding). `screens.html`: list of every screen, with a button that clears saved data.
- `LiveWaiting.dc.html`: the Live tab when no event is live (find an event, starts soon, or wrap-up).
- `phone-fit.js`: shows each screen full-screen on phones and inside a phone frame (with a flow menu) on desktop. On phones and narrow windows, a tab on the right edge opens the same menu as a bottom sheet; drag it up or down to move it.
- `*.dc.html`: one file per screen or component. Markup is inside `<x-dc>`,
  logic is the `class Component` script at the bottom. A screen pulls in a
  component with `<dc-import name="NavBar">`, which loads `NavBar.dc.html`.
- `support.js`: the runtime from the Claude design canvas that renders the
  `.dc.html` files (it includes React). Do not edit.
- `assets/`: images and icons.
- `canvas.json`: the layout of the artboards on the Claude canvas. Not needed
  to run the prototype.

## After the event (built from the Mid-Fi User Tests page)

These screens had no Hi-Fi frame in Figma, so they were built from the
mid-fi user-test versions in the Hi-Fi style:

- History tab → `VoyageLogbook` (Events and Notes tabs, search, new entry)
- SCAD Career Fair in the logbook → `EventRecap`; its banner replays `Wrapped`
  (tap through 4 slides, then the share card) → close → back to `EventRecap`
- `EventRecap` → Details tab (`EventPast`), follow-up cards → `Chat`, every
  person → `Crewmate?p=<name>`, note topics → History's Notes tab
  filtered to the fair
- Profile tab → `Profile` (your onboarding answers; Edit profile → review and back)

The transcript-style Logbook variant was intentionally left out.

## Notes

- Fonts (Poppins, DM Sans, Inter, Urbanist, Lexend) load from Google Fonts,
  so they need an internet connection.
- Your name, mood, notes and career fair registration are saved in the
  browser's local storage. Use "Clear saved data" on `index.html` to reset.
- Changes made here do not go back to the Claude canvas.
