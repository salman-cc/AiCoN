# AiCoN Tech Hub

AiCoN is an English-language technology publication theme for artificial intelligence, software, developer tools, technology and student resources.

This repository contains two related deliverables:

- `aicon-blog-theme/blogger/theme.xml` — the production Blogger XML theme. It owns the dynamic post rendering, page-type layouts, metadata, responsive system and accessible interactions.
- The repository root preview — a dependency-free Vercel preview of the visual system. It starts empty by design and can render a real public Blogger feed when a blog URL is supplied.

No editorial posts, authors, ratings, dates, sources or social profiles are bundled. The site owner publishes the real material through Blogger.

## Local validation

```bash
cd aicon-blog-theme
npm run validate
```

The validator parses the XML with Python's standard library and checks the core Blogger data markers.

## Vercel preview

The root is a static site, so it can be imported into Vercel without a build step. The included `vercel.json` provides clean static delivery and basic security headers.

To preview locally from the repository root:

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

The preview is intentionally empty until a real Blogger feed is configured. To load a public feed for a preview session, add the blog origin as a query parameter:

```text
/?blog=<your-public-blog-url>
```

The URL is read at runtime; posts are never copied into this repository. For the live Blogger site, upload `aicon-blog-theme/blogger/theme.xml` in Blogger Theme → Edit HTML.

## Theme installation

1. Back up the current Blogger theme.
2. Open `aicon-blog-theme/blogger/theme.xml`.
3. Paste the complete file into Blogger Theme → Edit HTML and save.
4. Create the site's static pages in Blogger if they are needed. The footer uses the standard Blogger page paths for About, Contact, Privacy Policy, Disclaimer, Editorial Policy and Terms.
5. Apply the labels used by the topic navigation to the owner's real posts. Empty topic sections hide themselves on the live homepage.

The theme has no framework, component library, tracking script or bundled image. Poppins is loaded with `display=swap`; all article images, titles, excerpts, labels, dates and authors come from Blogger data.
