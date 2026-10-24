# Qubicode Website

A static Qubicode portfolio built with plain HTML, CSS, and JavaScript. It is GitHub Pages friendly. Project imagery is local; Driver Dash and Brawlbots currently load fonts from Google Fonts.

## Structure

```text
/
|-- index.html
|-- 404.html
|-- 404.css
|-- style.css
|-- script.js
|-- motion.css
|-- privacy/
|   |-- index.html
|   `-- privacy.css
|-- Images/
|-- games/
|   |-- game-ui.css
|   |-- planned.css
|   `-- <game>/privacy/index.html
`-- README.md
```

The home page uses the root `style.css` and `script.js`. Game pages keep their own local assets, styles, and scripts in their folders.

Most pages load `motion.css`. On narrow screens or touch devices, it stops perpetual decorative animations while preserving finite effects triggered by taps, scrolling, and navigation. The Driver Dash trailer waits for the visitor to press play. The home-page cube and its reflection keep animating on mobile, but only while either is in view and the browser tab is visible. Gun Pop and Red Signal apply their own responsive and reduced-motion rules for their added effects. Reduced-motion device preferences suppress decorative and interaction effects.

Brawlbots' complete promotional page was restored from Git commit `42da210`, including its seven original images, responsive layout, features, bot selector, and facilities. Its local `styles.css` and `script.js` pause decorative animations outside the viewport and in hidden tabs. Facility images open in a keyboard-accessible preview. The page shows the In Development release status, contact link, and current privacy page.

`games/game-ui.css` provides shared Qubicode home buttons and store controls. Game theme classes give those controls the appropriate colors. Store buttons are currently disabled native buttons; replace them with links when the store URLs are ready. Google Play and App Store controls appear on Driver Dash. Steam and Wishlist on Steam controls appear on Red Signal and SCP-087. Gun Pop uses its own navigation and release notice.

## Gun Pop

Gun Pop's page uses the game's Bungee and Nunito fonts, wooden UI, original model renders, and skin preview art. The homepage card combines the original Gun Pop logo with actual bosses, guns, props, and a wooden background. Artwork is in `games/gun-pop/images/game/` and `images/showcase/`.

`showcase-data.js` drives the interactive arsenal (10 progression guns, four preview finishes per gun) and 16 prop families. The full current progression collection has 490 looks including default finishes, and the boss catalog has 33 characters. The page features eight boss portraits, six environment captures, progression screens, and a publisher overview. Premium preview guns are excluded. Both contact sections use `qubicode.team@gmail.com`.

`media/gun-pop-showcase.mp4` is a 46-second edit at 720 × 1280, 30 fps, with H.264 video, AAC stereo game audio, and fast-start metadata. It combines nine real gameplay takes: six environments and three bosses, with eight distinct guns and nine skin combinations. Cuts preserve real-time play. Footage came from the running Unity Game View using GPU readback and native recording; a fixed 30 fps export normalizes the source frame cadence. The developer menu selected later levels, prop families, and unlocked loadouts. Timed presses used the normal input handler; aim, physics, target movement, and scoring were unchanged. The original saved progress and Game View settings were restored, and temporary capture tooling was removed.

The 13 gallery images show actual gameplay and game UI. Playback begins on demand and pauses offscreen or in a hidden tab. The arsenal, prop selectors, mobile menu, and enlarged gallery work with keyboard controls. Gun Pop is seeking a publisher for iOS and Android; no store availability is implied.

`playful.css` and `playful.js` add the page's decorative motion: wooden shutters with emerging game props, 48 floating props around the centered target selector, and a glowing crate with a tap-triggered particle burst. Each shutter cycles through all 48 props, changing its target while the doors are closed before the next opening. Faint combo phrases from the game's feedback profile drift upward behind the content, using its Bungee font and color palettes. These decorative phrases cannot receive input and are hidden from assistive technology. The screenshot gallery loops automatically to the right while retaining the original 13 images in its keyboard order and lightbox. Hover, focus, manual browsing, video playback, and the pause controls suspend its movement. Offscreen and hidden-tab animations pause, and reduced-motion preferences leave a static presentation with manual gallery controls.

## Red Signal

Red Signal keeps its condensed white/red title and dark transmission styling. Its six scenes introduce Mars, the surface and scanner, the station, the creature encounter, the screenshot archive, and the PC release notice. Layouts adapt to phones, and decorative motion pauses offscreen or in a hidden tab and respects reduced-motion preferences.

`atmosphere.css` adds drifting dust and haze, irregular red light along the scene edges, and two brief title glitches per cycle. The layers sit behind the content and cannot receive input. Mobile layouts use fewer particles. The navigation's Motion control pauses the effects; opening an image viewer also suspends background motion. The homepage artwork fills the entire card behind the standard title, description, status, and platform overlays, using the same image sizing and hover effect as Driver Dash and Gun Pop.

The seven JPGs in `games/red-signal/images/captured/` are unchanged copies of the screenshots supplied in `C:/Users/Leo/Desktop/RedSignal`. The screenshot archive supports thumbnails, previous/next controls, arrow keys, and an enlarged dialog with Escape and focus restoration. The full-size viewer shows each original frame without cropping or color filters.

`games/red-signal/images/red-signal-key-art.webp` is a promotional composite created with built-in imagegen from the supplied game imagery, using the white RED / red SIGNAL title. It is referenced by the page's social metadata. The homepage uses `red-signal-card-background.webp`, a title-free edit of that artwork, with a bright white/red decorative wordmark on the right, slightly below the normal card heading. The heading and expanded description remain on the left; the full description wraps without truncation. Both prompts are recorded in `images/artwork-prompt.txt`; gameplay screenshots are kept separate. Red Signal is in development for PC, with store buttons disabled until a Steam URL is available. Press and publishing enquiries use `qubicode.team@gmail.com`.

## Home Page Game Cards

Home page game cards are generated from the `games` array in `script.js`.

The twelve games form three columns and four rows in a 1240px-wide section on desktop, with two columns at widths up to 1100px and one column at widths up to 600px. The six non-Roblox games appear first, followed by the six Roblox games; release-status ordering applies within each group. Search matches titles, descriptions, genres, platforms, and tags; it combines with the category buttons, including Roblox. A result count and resettable empty state support keyboard and screen-reader use.

The six Roblox cards belong to the Qubicode community (`280151666`): REALMS RPG, Go Up!, Break Everything, COIN RUSH, Build the Eiffel Tower!, and ZombieShooter. They link directly to their Roblox experience pages. Roblox's public catalog listed REALMS RPG and Go Up! on 2026-10-23; the remaining four are shown as In Development. Do not infer release status from an uploaded icon alone.

`Images/roblox/sources.json` records the official titles, descriptions, universe/place IDs, URLs, icon sources, and public status. Original icons are retained under `reference-icons/`. Built-in imagegen adapted each icon into full-bleed landscape card artwork, preserving its characters and visual identity; these are promotional images, not gameplay captures. The six `*-card.webp` files are 960 × 640 and together download in approximately 685 KiB. All images load locally and lazily, with no Roblox API calls during page visits. Exact prompts are in `artwork-prompts.json`, and output details are in `artwork-manifest.json`.

COIN RUSH and ZombieShooter currently have no official descriptions. Their short introductions describe only the theme visible in the official icons and avoid unverified progression or feature claims. The seasonal prefix on Build the Eiffel Tower! is omitted from the evergreen card title.

Each game object controls:

- `title`
- `status`
- `statusClass`
- `platforms`
- `filters`
- `page`
- `image`
- `description`

Set `page` to an empty string while dedicated game pages are not part of the site:

```js
page: ""
```

Each entire card links to its game page, with a separate shortcut icon in its upper-right corner. `page` can also be a verified external Roblox experience URL. Cards without a page link to the themed 404 page.

Status badges use these labels and classes:

| Status | Class | Color |
| --- | --- | --- |
| Seeking publisher | `status-seeking` | Yellow |
| Published | `status-published` | Green |
| In Development | `status-development` | Blue |
| Future | `status-future` | Gray |

Only use Published for a game that has actually been released.

SCP-087 and Brawlbots are In Development, and Gun Pop is Seeking publisher. Keep page copy and home page badges consistent when changing a game's status.

## Missing Pages

`404.html` shares the home page's glass styling and floating cube. GitHub Pages serves this file for missing URLs. Its early base-path setup keeps images, styles, and homepage links working for nested missing URLs, the `/QubicodeSite/` project deployment, and a root custom domain. If the repository/deployment path changes, update `projectPath` and `isGitHubProject` in `404.html`. Other static hosts should serve `404.html` with an HTTP 404 response for unknown paths.

The error page fits its header, message, return-home button, and footer into the current viewport. Its cube scales down on short screens and landscape phones.

## Privacy Pages

The home page footer links to `privacy/index.html`, which contains the website privacy policy and a directory of all six game policies. Each game footer links to its own `games/<game>/privacy/index.html` page. Those game policy bodies are intentionally empty and marked `noindex,follow` until the policies are ready.

All policy pages reuse the home page's `style.css` and navigation script, plus `privacy/privacy.css`. Edit the empty article in each game policy to add its content later, and remove its `noindex` directive when ready. Keep the game-policy directory in sync when adding games.

The website policy describes the current static site, GitHub Pages hosting, external fonts, and contact links. The homepage contact email is `qubicode.team@gmail.com`. Update the policy and its date when contact details, providers, or data practices change.

## Adding Screenshots

### Recovery Unit

`games/recovery-unit/index.html` is the Recovery Unit landing page. Its standalone `styles.css` and `script.js` provide responsive navigation, an accessible four-stage expedition selector, a seven-image gallery with a native dialog viewer, and optional rain, drifting fog, dust, and train-window lighting. Fog uses one soft gradient per scene without live blur or masks; only the hero and railway fog drift. Rain is limited to twelve streaks on desktop and six on phones. Small cabin-light overlays follow the source screenshot's cover crop through a ResizeObserver and animate as a single opacity layer. Decorative layers are hidden offscreen and in background tabs; motion also pauses in the image viewer, respects the system preference, and can be paused from the navigation. Screenshots remain available through ordinary links without JavaScript.

`games/recovery-unit/artwork-preview.html` retains the comparison with proposal 03 for reference. The user chose to keep the current homepage artwork on 2026-10-23. Proposals 02 and 03 and their exact imagegen prompts remain in `images/proposals/`; neither proposal is referenced by the homepage or the game's art download.

The original JPGs in `games/recovery-unit/images/captured/` are unedited game captures supplied by the developer. `recovery-unit-key-art.webp` is generated promotional artwork for the homepage card and the downloadable project art; its references and exact prompt are in `images/artwork-prompt.txt`. Do not label that artwork as a gameplay capture. The subpage uses the original screenshots.

Copy describes the four-player train expedition and search for a cure supplied by the developer, plus mission, equipment, extraction, and research mechanics checked against the local Unity project's `Documentation/RecoveryProgression.md`, `Documentation/TrainCorrection.md`, and mission assets. The project is in development for PC; no release date or public store page is announced here. Publisher and press enquiries go to `qubicode.team@gmail.com`.

### General image updates

SCP-087's homepage card overlays `games/scp-087-exploration-iv/images/scp087-wordmark.svg` on the right of its existing screenshot. This simple white/red wordmark uses outlined lettering, so it stays sharp without loading a font. Its layout is separate from the screenshot crop, and the regular card heading and description remain visible on the left.

Brawlbots uses the same independent logo overlay with `games/brawlbots/images/brawlbots-wordmark.svg`. The white/lime lettering is outlined from Arial Black, with a pale outer edge and dark extrusion to match the restored page's palette. Its homepage card uses `scrapyard-card.webp`, an optimized copy of the original Scrapyard Facility screenshot (`img7.PNG`). The logo sits above the bots on the right, and the shorter description remains fully visible on the left.

1. Add the image file to `Images/`.
2. Update the matching home card's `image` in `script.js`.

Large images generally use lossless WebP exports with their original dimensions and transparency; Brawlbots' Scrapyard card uses a quality-90 WebP to reduce the homepage download. When replacing an image, update references in HTML, CSS backgrounds, gallery data attributes, and JavaScript carousels together. Brawlbots keeps its restored original PNG artwork and homepage WebP in `games/brawlbots/images/`.

## Social Links

The site currently links to:

- YouTube: `https://www.youtube.com/@Qubicode`
- Instagram: `https://www.instagram.com/qubicode`
- GitHub: `https://github.com/QubicodeGit`
- Discord: `https://discord.gg/2PjpjMRh5N`

Update contact cards in `index.html` and page footers if these change.

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
