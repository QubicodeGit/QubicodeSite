# Qubicode Website

A static Qubicode portfolio built with plain HTML, CSS, and JavaScript. It is GitHub Pages friendly and uses local project assets only.

## Structure

```text
/
|-- index.html
|-- 404.html
|-- 404.css
|-- style.css
|-- script.js
|-- Images/
|-- games/
`-- README.md
```

The home page uses the root `style.css` and `script.js`. Most game pages keep their own local assets, styles, and scripts in their folders. Recovery Unit shares the root styling and navigation script, with its page layout scoped inside its HTML.

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

## Missing Pages

`404.html` shares the home page's glass styling and floating cube. GitHub Pages serves this file for missing URLs. Its early base-path setup keeps images, styles, and homepage links working for nested missing URLs, the `/QubicodeSite/` project deployment, and a root custom domain. If the repository/deployment path changes, update `projectPath` and `isGitHubProject` in `404.html`. Other static hosts should serve `404.html` with an HTTP 404 response for unknown paths.

## Adding Screenshots

1. Add the image file to `Images/`.
2. Update the matching home card's `image` in `script.js`.

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
