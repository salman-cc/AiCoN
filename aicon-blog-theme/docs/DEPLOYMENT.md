# Deployment

## Blogger

The Blogger theme is the publishing implementation. Upload `blogger/theme.xml` through Blogger Theme → Edit HTML. Blogger supplies the post loop, labels, author values, canonical URL, search views, archives, comments and static page body.

Use a private test blog first. Verify these views before applying the theme to the public blog:

- Homepage with no posts and with published posts
- Single post with and without an image
- Label page
- Search result page with and without matches
- Static page
- Archive page
- 404 page
- Mobile menu, search dialog and keyboard focus

## Vercel

Vercel serves the repository root as a static preview. It is useful for reviewing the design system and optional feed rendering; it is not a replacement for Blogger's publishing engine.

The preview has no build command. Import the repository into Vercel or run a static server locally. To show the owner's real public feed during a preview, use the `blog` query parameter described in the root README. The preview only requests published entries at runtime and does not save them.

## Performance checks

- Keep the Blogger page count practical for each view.
- Upload appropriately sized images through Blogger and provide meaningful image descriptions.
- Test article embeds, tables and code blocks on a narrow viewport.
- Run Lighthouse against the actual Blogger URL after custom content and third-party embeds are added.
- Avoid adding tracking or widget scripts that are not required.
