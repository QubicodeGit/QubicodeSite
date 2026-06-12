# Qubicode Website

A static Qubicode portfolio built with plain HTML, CSS, and JavaScript. It is GitHub Pages friendly and uses local project assets only.

## Structure

```text
/
|-- index.html
|-- style.css
|-- script.js
|-- Images/
|-- games/
|-- sandbox/
`-- README.md
```

The home page uses the root `style.css` and `script.js`. Game pages keep their own local assets, styles, and scripts in their folders, and the sandbox lives in its own `sandbox/` directory.

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
- `logo`
- `description`
- `tags`

Set `page` to an empty string while dedicated game pages are not part of the site:

```js
page: ""
```

Cards without a page show a disabled "Page Coming Later" button.

## Adding Screenshots

1. Add the image file to `Images/`.
2. Update the matching home card image or logo in `script.js`.

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

Before uploading, make sure file names and folder names match the references in the HTML exactly. GitHub Pages is case-sensitive, so `Images/`, `games/`, and `sandbox/` all need to stay spelled the same way everywhere.
