# Qubicode Website

A static Qubicode portfolio built with plain HTML, CSS, and JavaScript. It is GitHub Pages friendly. Project imagery is local; Driver Dash currently loads fonts from Google Fonts.

## Structure

```text
/
|-- index.html
|-- 404.html
|-- 404.css
|-- style.css
|-- script.js
|-- featured.js
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

The home page uses the root `style.css` and `script.js`. Most game pages keep their own local assets, styles, and scripts in their folders. Recovery Unit and Brawlbots use the root styling with `games/planned.css` for their temporary pages.

Every page loads `motion.css`. On narrow screens or touch devices, it stops perpetual decorative animations while preserving finite effects triggered by taps, scrolling, and navigation. The featured carousel uses manual navigation with animated transitions, and the Driver Dash trailer waits for the visitor to press play. The home-page cube and its reflection keep animating on mobile, but only while either is in view and the browser tab is visible. Gun Pop has no sound engine or manual animation toggle. Reduced-motion device preferences still suppress interaction effects.

Recovery Unit and Brawlbots use a single-screen layout in `games/planned.css`: the header, game details, screenshot, and footer all fit the current viewport without scrolling. Compact portrait and landscape layouts preserve the description, future notice, studio link, and privacy policy.

`games/game-ui.css` provides the Qubicode home buttons and store controls. Each game sets a theme class on its body so the glass button picks up that game's colors. Store buttons are currently disabled native buttons with their normal appearance; replace them with links when the store URLs are ready. Google Play and App Store controls appear on Driver Dash and Gun Pop. Steam and Wishlist on Steam controls appear on Red Signal and SCP-087.

## Featured Carousel

The home page's Featured section sits between the hero and game grid. Its four slides and matching selector cards are defined in `index.html`, with styling in `style.css` and rotation in `featured.js`. Gun Pop is the first feature; POM & Tessellation for URP and HDRP is the second and is marked as an upcoming Unity Asset Store release. The last two slots are intentionally empty.

On desktop, automatic rotation advances every eight seconds of visible, unpaused time. The progress bar uses the same timer. Arrows, selector cards, keyboard navigation, and touch swipes change the active feature and reset its timer. Hovering the main image carousel pauses the clock; the section heading, margins, selector cards, and site navigation do not. Leaving the image resumes the same countdown. A hidden browser tab or scrolling away also pauses the clock, and the pause/play button provides manual control. Reduced-motion users start with rotation paused. On mobile, automatic rotation, progress animation, and the pause/play control are disabled; arrows, selector cards, and swipes remain available. Without JavaScript, Gun Pop remains visible and links to its game page.

To replace an empty slot, edit its slide and matching selector card together, keeping their `id`, `aria-controls`, and `aria-labelledby` values paired.

## Home Page Game Cards

Home page game cards are generated from the `games` array in `script.js`.

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

Each entire card links to its game page, with a separate shortcut icon in its upper-right corner. Cards without a page link to the themed 404 page.

Status badges use these labels and classes:

| Status | Class | Color |
| --- | --- | --- |
| Seeking publisher | `status-seeking` | Yellow |
| Published | `status-published` | Green |
| In Development | `status-development` | Blue |
| Future | `status-future` | Gray |

Only use Published for a game that has actually been released.

SCP-087 is currently Future, and Gun Pop is In Development. Keep page copy and home page badges consistent when changing a game's status.

## Missing Pages

`404.html` shares the home page's glass styling and floating cube. GitHub Pages serves this file for missing URLs. Its early base-path setup keeps images, styles, and homepage links working for nested missing URLs, the `/QubicodeSite/` project deployment, and a root custom domain. If the repository/deployment path changes, update `projectPath` and `isGitHubProject` in `404.html`. Other static hosts should serve `404.html` with an HTTP 404 response for unknown paths.

The error page fits its header, message, return-home button, and footer into the current viewport. Its cube scales down on short screens and landscape phones.

## Privacy Pages

The home page footer links to `privacy/index.html`, which contains the website privacy policy and a directory of all six game policies. Each game footer links to its own `games/<game>/privacy/index.html` page. Those game policy bodies are intentionally empty and marked `noindex,follow` until the policies are ready.

All policy pages reuse the home page's `style.css` and navigation script, plus `privacy/privacy.css`. Edit the empty article in each game policy to add its content later, and remove its `noindex` directive when ready. Keep the game-policy directory in sync when adding games.

The website policy describes the current static site, GitHub Pages hosting, external fonts, and contact links. The example contact email remains in place for now. Update the policy and its date when contact details, providers, or data practices change.

## Adding Screenshots

1. Add the image file to `Images/`.
2. Update the matching home card's `image` in `script.js`.

Large images use lossless WebP exports with their original dimensions and transparency. When replacing an image, update references in HTML, CSS backgrounds, gallery data attributes, and JavaScript carousels together. Brawlbots keeps only `Images/brawlbotsScreenshot.jpg` as its game artwork; its former promotional page and other artwork have been removed.

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
