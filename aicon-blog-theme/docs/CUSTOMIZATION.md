# Customization

## Design tokens

All live theme styles are inside the `<b:skin>` block in `blogger/theme.xml`. The first variables define the system:

- Background: `#0B0B0F`
- Header: `#0E0E12`
- Surface: `#111116`
- Card: `#17171D`
- Secondary card: `#1B1B21`
- Border: `#27272A`
- Primary text: `#F5F5F5`
- Secondary text: `#A1A1AA`
- Muted text: `#71717A`
- Accent: `#FF6B35`

Keep the accent for interaction, labels and small highlights. The layout uses a 4px base spacing scale and a maximum content width of 1280px.

## Navigation and labels

Primary navigation links point to Blogger label routes built from `data:blog.homepageUrl`. If the owner uses a different label taxonomy, update the visible link text and the matching topic conditions in the homepage includable. Do not add a link until the corresponding destination is intended for the blog.

The topic sections match the parent labels and the related taxonomy labels in the XML. Each card still reads its title, image, excerpt, date, author and URL from the current Blogger post.

## Optional fields

The theme checks for optional Blogger values before rendering them:

- `data:post.featuredImage` and `data:post.firstImageUrl` for images
- `data:post.snippet` for excerpts and the article deck
- `data:post.author.authorPhoto.image` for an author image
- `data:post.lastUpdatedISO8601` for an updated timestamp
- `data:post.labels` for label links and related-post lookup

When a value is missing, the related visual element is omitted or uses a neutral brand fallback. No editorial value is generated.

## Article enhancements

The small inline script calculates reading time from the rendered post body, builds a table of contents from actual `h2` and `h3` elements, adds copy controls to existing code blocks, and makes tables horizontally scrollable through CSS. It does not replace article HTML.

On article pages only, the related-post enhancement requests the Blogger label feed for the first real post label. If the feed is unavailable or contains no other posts, the related section remains hidden.
