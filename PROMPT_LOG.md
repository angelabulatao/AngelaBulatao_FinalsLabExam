# Prompt Log

Techniques used in the single prompt that produced this project, and how each shaped the result.

| Technique | How it was applied | Effect |
|---|---|---|
| Role prompting | "Act as a senior developer and professional UI/UX designer" | Pushed output toward both clean code structure and deliberate visual choices. |
| Explicit deliverable list | Four named pages, each with its required behaviour | Every page maps to one view in `index.html`; nothing ambiguous to guess. |
| Constraint specification | Stack (HTML/CSS/JS/Bootstrap 5), separate files, palette, "Travel Editorial" style | Fixed the file layout and design tokens up front. |
| Negative constraints | "Avoid generic designs and nonfunctional buttons" | Led to the passport-stamp motif and an audit that every button has a handler. |
| Quality criteria | Accessibility, responsiveness, validation, localStorage | Became the checklist used in review (see below). |
| Verification step in the prompt | "Test… and fix any errors before presenting" | Triggered the checks below. |
| Design-first planning | Palette, type and one signature element chosen before coding | Avoided a default cream-and-serif template look. |

## Verification actually performed
- `node --check` on `app.js` and `data.js`: passes.
- Every `#id` that `app.js` selects exists in `index.html`: passes.
- Relative paths (`css/style.css`, `js/data.js`, `js/app.js`) exist.
- Duration logic run in Node: 20→27 Dec = 8 days / 7 nights; same day = 1 day / 0 nights; reversed dates rejected.
- Destination ids are unique (16).

## Not verified
No real browser was available in the build environment, so rendering, responsive breakpoints, Bootstrap behaviour and live localStorage were not exercised. Please open the app and run through each page; report anything off and it can be fixed in a follow-up prompt.

## Iteration notes
Review pass fixed: invalid CSS declaration in the hero stats, and `<dl>` child order (term before description).
