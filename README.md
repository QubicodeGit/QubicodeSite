# Qubicode Website

A static Qubicode portfolio built with plain HTML, CSS, and JavaScript. It is GitHub Pages friendly and uses local project assets only.

## Local Preview

Open `index.html` directly in a browser to view the site and play the footer game.
No build step or local server is required. The runner loads ordinary deferred
scripts in dependency order, with relative asset paths that work from `file://`,
a local HTTP server, and a GitHub Pages repository subdirectory.

## Structure

```text
/
|-- index.html
|-- style.css
|-- script.js
|-- privacy.css
|-- privacy/
|-- Images/
|-- games/
`-- README.md
```

The home page uses the root `style.css` and `script.js`. Game pages keep their own local assets, styles, and scripts in their folders.

## Home Page Game Cards

Home page game cards are generated from the `games` array in `script.js`.

Each game object controls:

- `title`
- `status`
- `statusClass`
- `platforms`
- `genre`
- `filters`
- `page`
- `image`
- `description`

Set `page` to an empty string while dedicated game pages are not part of the site:

```js
page: ""
```

Cards without a page show a non-interactive "Details to follow" label.

All cards share the same dimensions in a two-column grid (one column on phones).
They are sorted by Published, Seeking Publisher, In Development, then Future;
the array order is preserved within each status, including when filtered.

## Homepage Hero

The compact hero uses diagonal slices of existing game screenshots that loop
smoothly from right to left, with a central logo and orbiting dots beside the copy.
Optimized copies are in `Images/hero/`; the originals remain in the game folders
and `Images/`. Keep both six-image groups in `index.html` identical when changing
the collage so the loop stays seamless. Illustrated Games, Tools, and Assets cards
sit below the copy. The logo and cards scale down on narrow or short viewports.

## Homepage Assets & Tools

The three tool cards are defined directly in `index.html`. Advanced Surface Shaders
and Simple Car System are intended to link to the Unity Asset Store; QuadWeaver
will link to its free GitHub repository. All three buttons are currently disabled,
with one shared availability note. When a destination exists, replace that button
with an anchor using the same class and the real URL. No tool detail pages are needed.

Placeholder concept artwork lives in `Images/tools/` as optimized WebP files.
`Images/tools/ARTWORK.md` records the built-in image generation prompts and source
image paths. These illustrations should be replaced with product images when ready.

## Homepage Motion

The screenshot strip and logo orbits use CSS transform animations. They pause
when the hero leaves the viewport or the browser tab is hidden, and are disabled
for reduced motion. Background glows and status badges stay static. Elements
reveal once as they enter the viewport. Glare overlays, pointer-following
spotlights, and card tilt are removed.

## Adding Screenshots

1. Add the image file to `Images/`.
2. Update the matching home card image in `script.js`.

## Game Trailers

Driver Dash's hero phone plays `games/driver-dash/PromoMaterial/driverdashtrailer.mp4`.
Playback pauses offscreen or in a hidden tab, preserves a visitor's manual pause,
and does not start automatically when reduced motion is enabled.

Gun Pop's hero phone currently displays a gameplay still and a trailer placeholder
caption. Replace its `.trailer-phone-screen` image with the real video when ready;
no trailer file is referenced until one exists.

## Game Store Buttons

Gun Pop and Driver Dash have App Store and Google Play buttons in their final
sections. Red Signal, SCP-087, and Brawlbots have Steam buttons. These are
`type="button"` placeholders with `aria-disabled="true"` and no click handlers,
so they retain their normal styling without navigating or jumping the page.
Shared spacing and vector icons live in `store-buttons.css` and
`Images/store-icons.svg`. To activate a store destination, replace its button
with an anchor, preserve its classes and contents, add the real store URL, and
remove `type` and `aria-disabled`.

## Social Links

The site currently links to:

- YouTube: `https://www.youtube.com/@Qubicode`
- Instagram: `https://www.instagram.com/qubicode`
- GitHub: `https://github.com/QubicodeGit`
- Discord: `https://discord.gg/2PjpjMRh5N`

Update contact cards in `index.html` and page footers if these change.

TikTok is a non-clickable "Coming soon" contact card until a profile is available.

## Privacy Pages

The website privacy policy is in `privacy/index.html`. It also links to a separate
placeholder at `games/<game-slug>/privacy/index.html` for each of the six games,
including Recovery Unit. Existing game pages link to their own policy in the footer.
All privacy pages share the root `style.css` and `privacy.css` and work without JavaScript.

To publish a game policy, replace its marked placeholder section with the approved
text, update the description and directory label, and remove the `noindex` meta tag.
No game policy text has been generated. Keep the website policy in sync if hosting,
external fonts, forms, or analytics change. Replace the existing `contact@example.com`
address in `index.html` with a real contact address before publishing.

## Custom 404 Page

The root `404.html` is the custom missing-page screen. It is self-contained, so it
also renders at broken URLs several folders deep. Its navigation supports both
the `/QubicodeSite/` repository path and a site hosted at a domain root. Update
`projectPath` in that file if the repository is renamed.

## Homepage Mini Game

The Driver Dash runner spans the full page width and uses the footer's top edge
as its road. `runner-engine.js` handles the simulation; `runner.js` draws the
transparent canvas and handles controls; `runner.css` styles the compact controls.
`runner-art.js` defines source rectangles for the supplied sprite sheets, saved
losslessly as `Images/runner/player.webp`, `Images/runner/sprites.webp` (car and
cloud), and `Images/runner/city-atlas.webp`. Running and ducking each use three
poses in a 1–2–3–2 cycle, inserting the middle pose between both strides. Jumping
uses its own pose, and the character stands idle when waiting or stopped on the
ground. Frames share a fixed scale and align at the helmet and road.
Cars are ground obstacles, and the low clouds replace birds as duck-under obstacles.

The darkened skyline scrolls at 12% of the obstacle speed. Lamps sit behind the
player and obstacles at 43% opacity and move at the same speed as the obstacles.
The moon exits the left edge after 300 seconds of active play. Its elapsed time
and the scenery position persist across restarts and freeze when the game pauses.

Space, Up, or W jumps; holding Down or S ducks; P or Escape pauses. Touch controls
provide a Jump button and a hold-to-duck button. Keyboard activation of the Duck
button toggles ducking. The game starts only on request, pauses when offscreen,
when focus leaves it, on resize, or in a hidden tab, and requires an explicit resume.
Reduced motion freezes the scenery and alternating frames, while keeping jump
and duck gameplay functional.
The best score lasts only for the current page visit: no storage, cookies, or
network score service is used. Artwork is loaded as the game approaches the viewport.

Run the game-logic checks with `node --test tests/runner.test.mjs` (Node 22 or newer).

## GitHub Pages Deployment

1. Push the full folder to a GitHub repository.
2. Open the repository on GitHub.
3. Go to **Settings**.
4. Open **Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and root folder.
7. Save.

GitHub Pages will publish the site at:

```text
https://your-username.github.io/your-repository-name/
```

No build step is required.

## Final Check

Before uploading, make sure file names and folder names match the references in the HTML exactly. GitHub Pages is case-sensitive, so `Images/` and `games/` need to stay spelled the same way everywhere.
