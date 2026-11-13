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

Brawlbots' complete promotional page was restored from Git commit `42da210`, including its seven original images, responsive layout, features, bot selector, and facilities. Its local `styles.css` and `script.js` pause decorative animations outside the viewport and in hidden tabs. Facility images open in a keyboard-accessible preview. The page shows the Planned release status, contact link, and current privacy page.

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

`games/red-signal/images/red-signal-key-art.webp` is a promotional composite created with built-in imagegen from the supplied game imagery, using the white RED / red SIGNAL title. It is referenced by the page's social metadata. The homepage uses the original monster screenshot at `images/captured/creature-front.jpg`, with a bright white/red decorative wordmark on the right, slightly below the normal card heading. The heading and expanded description remain on the left; the full description wraps without truncation. Both prompts are recorded in `images/artwork-prompt.txt`; gameplay screenshots are kept separate. Red Signal is in development for PC, with store buttons disabled until a Steam URL is available. Press and publishing enquiries use `qubicode.team@gmail.com`.

## Home Page Game Cards

Home page game cards are generated from the `games` array in `script.js`.

The nine games use three columns on desktop, two at widths up to 1100px, and one at widths up to 600px. The six non-Roblox games appear first, followed by three Roblox games. Release-status ordering applies within each group, with Published Build the Eiffel Tower! first among Roblox games, followed by Go Up! and Break Everything. Search combines with the category filters.

Coin Rush and REALMS RPG are no longer listed. Historical artwork and source records remain in Images/roblox/. Break Everything uses the supplied 1672 × 941 PNG, unchanged, at Images/roblox/break-everything-card.png. The other Roblox cards retain their existing artwork. Build the Eiffel Tower!'s Published status was updated at the user's request on 2026-11-07.

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

Each entire card links to its game page, with a separate shortcut icon in its upper-right corner. Platform icons stay at the bottom left of every card. `page` can also be a verified external Roblox experience URL. Cards without a page link to the themed 404 page.

Status badges use these labels and classes:

| Status | Class | Color |
| --- | --- | --- |
| Seeking publisher | `status-seeking` | Yellow |
| Published | `status-published` | Green |
| In Development | `status-development` | Blue |
| Planned | `status-future` | Gray |

Only use Published for a game that has actually been released.

SCP-087 is In Development, Brawlbots is Planned, and Gun Pop is Seeking publisher. Keep page copy and home page badges consistent when changing a game's status.

## Missing Pages

`404.html` shares the home page's glass styling and floating cube. GitHub Pages serves this file for missing URLs. Its early base-path setup keeps images, styles, and homepage links working for nested missing URLs, the `/QubicodeSite/` project deployment, and a root custom domain. If the repository/deployment path changes, update `projectPath` and `isGitHubProject` in `404.html`. Other static hosts should serve `404.html` with an HTTP 404 response for unknown paths.

The error page fits its header, message, return-home button, and footer into the current viewport. Its cube scales down on short screens and landscape phones.

## Privacy Pages

The home page footer links to `privacy/index.html`, which contains the website privacy policy and a directory of all six game policies. Each game footer links to its own `games/<game>/privacy/index.html` page. Those game policy bodies are intentionally empty and marked `noindex,follow` until the policies are ready.

All policy pages reuse the home page's `style.css` and navigation script, plus `privacy/privacy.css`. Edit the empty article in each game policy to add its content later, and remove its `noindex` directive when ready. Keep the game-policy directory in sync when adding games.

The website policy describes the current static site, GitHub Pages hosting, external fonts, and contact links. The homepage contact email is `qubicode.team@gmail.com`. Update the policy and its date when contact details, providers, or data practices change.

## Adding Screenshots

### Recovery Unit

Recovery Unit is presented as an early development showcase, with a short overview, separate descriptions of what the screenshots show and the planned gameplay, and seven original development captures. It explicitly states that the game is a long way from complete and has no release date.

Its local styles and script provide responsive navigation and a screenshot gallery with keyboard controls and a native enlarged-image dialog. The page has no decorative atmosphere effects or promotional art download. The screenshots in images/captured/ remain unchanged; The homepage uses the original desert apocalypse screenshot at `images/captured/buried-city.jpg`; historical proposals are retained separately.

### General image updates

SCP-087's homepage card overlays `games/scp-087-exploration-iv/images/scp087-wordmark.svg` on the right of its existing screenshot. This simple white/red wordmark uses outlined lettering, so it stays sharp without loading a font. Its layout is separate from the screenshot crop, and the regular card heading and description remain visible on the left.

Brawlbots uses the same independent logo overlay with `games/brawlbots/images/brawlbots-wordmark.svg`. The white/lime lettering is outlined from Arial Black, with a pale outer edge and dark extrusion to match the restored page's palette. Its homepage card uses `scrapyard-card.webp`, an optimized copy of the original Scrapyard Facility screenshot (`img7.PNG`). The logo sits above the bots on the right, and the shorter description remains fully visible on the left.

1. Add the image file to `Images/`.
2. Update the matching home card's `image` in `script.js`.

Large images generally use lossless WebP exports with their original dimensions and transparency; Brawlbots' Scrapyard card uses a quality-90 WebP to reduce the homepage download. When replacing an image, update references in HTML, CSS backgrounds, gallery data attributes, and JavaScript carousels together. Brawlbots keeps its restored original PNG artwork and homepage WebP in `games/brawlbots/images/`.

## Social Links

The site currently links to:

- itch.io: `https://qubicode.itch.io`
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

## SIX featured project

The homepage features SIX above the game grid, with the supplied cover at Images/six-cover.png and logo at Images/six-logo.png. The cover fills the card on desktop and mobile, and the logo replaces the text wordmark while retaining an accessible SIX heading. The compact SIX card describes the game concept as in development and links to its game page at https://qubicode.itch.io/six. A companion blue card links to the official 2026 Unity Game Jam and shows its Lucky Number theme and November 5–14 dates. The cards sit side by side on desktop and stack on mobile; borders, glows, and decorations use CSS, with no new generated imagery. It does not imply a playable release. Ten projects are represented: this feature and nine grid entries.

Recovery Unit now has a crew-and-train screenshot immediately after the introduction. It opens the existing screenshot viewer and retains the original image and work-in-progress caption.
