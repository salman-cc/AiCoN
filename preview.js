(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var blogUrl = root.getAttribute('data-blog-url') || window.AICON_BLOGGER_URL || new URLSearchParams(window.location.search).get('blog') || '';
  var entries = [];
  var lastFocus = null;

  function setMenu(open) {
    var button = document.querySelector('[data-menu-toggle]');
    var menu = document.getElementById('mobile-menu');
    if (!button || !menu) return;
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
  }

  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.getElementById('mobile-menu');
  if (menuButton) menuButton.addEventListener('click', function () { setMenu(mobileMenu.hidden); });
  if (mobileMenu) mobileMenu.addEventListener('click', function (event) { if (event.target.closest('a')) setMenu(false); });

  var searchDialog = document.getElementById('search-dialog');
  var searchInput = document.getElementById('search-input');
  var searchNote = document.getElementById('search-note');

  function setSearch(open) {
    if (!searchDialog) return;
    if (open) {
      lastFocus = document.activeElement;
      searchDialog.hidden = false;
      searchDialog.setAttribute('aria-hidden', 'false');
      body.style.overflow = 'hidden';
      window.setTimeout(function () { if (searchInput) searchInput.focus(); }, 20);
    } else {
      searchDialog.hidden = true;
      searchDialog.setAttribute('aria-hidden', 'true');
      body.style.overflow = '';
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }
  }

  document.querySelectorAll('[data-search-open]').forEach(function (button) { button.addEventListener('click', function () { setSearch(true); }); });
  document.querySelectorAll('[data-search-close]').forEach(function (button) { button.addEventListener('click', function () { setSearch(false); }); });
  if (searchDialog) searchDialog.addEventListener('click', function (event) { if (event.target === searchDialog) setSearch(false); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (searchDialog && !searchDialog.hidden) setSearch(false);
      if (mobileMenu && !mobileMenu.hidden) setMenu(false);
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      setSearch(searchDialog && searchDialog.hidden);
    }
  });

  function normalizeBlogUrl(value) {
    if (!value) return '';
    var url = value.trim();
    if (!/^https?:\/\//i.test(url)) return '';
    return url.replace(/\/$/, '') + '/';
  }

  blogUrl = normalizeBlogUrl(blogUrl);
  if (!blogUrl) {
    document.querySelectorAll('[data-feed-section]').forEach(function (section) {
      if (section.getAttribute('data-feed-section') !== 'featured' && section.getAttribute('data-feed-section') !== 'latest') section.setAttribute('data-has-posts', 'false');
    });
    return;
  }

  if (searchNote) searchNote.textContent = 'Search the published posts currently available from Blogger.';

  function alternateLink(entry) {
    var links = entry.link || [];
    var link = links.find(function (item) { return item.rel === 'alternate'; });
    return link ? link.href : '';
  }

  function entryImage(entry) {
    var media = entry.media$thumbnail && entry.media$thumbnail.url;
    if (!media && entry.content && entry.content.$t) {
      var match = entry.content.$t.match(/<img[^>]+src=["']([^"']+)["']/i);
      media = match && match[1];
    }
    return media ? media.replace(/\/s[0-9]+(-c)?\//, '/s720/') : '';
  }

  function entrySummary(entry) {
    var source = entry.summary && entry.summary.$t ? entry.summary.$t : entry.content && entry.content.$t ? entry.content.$t : '';
    var node = document.createElement('div');
    node.innerHTML = source;
    return (node.textContent || '').trim();
  }

  function labelsFor(entry) {
    return (entry.category || []).map(function (category) { return category.term; }).filter(Boolean);
  }

  function card(entry, compact) {
    var url = alternateLink(entry);
    var title = entry.title && entry.title.$t ? entry.title.$t : '';
    if (!url || !title) return null;
    var article = document.createElement('article');
    article.className = 'post-card' + (compact ? ' post-card-compact' : '');
    article.setAttribute('itemscope', '');
    article.setAttribute('itemtype', 'https://schema.org/BlogPosting');

    var link = document.createElement('a');
    link.className = 'media';
    link.href = url;
    link.setAttribute('itemprop', 'url');
    var image = entryImage(entry);
    if (image) {
      var img = document.createElement('img');
      img.src = image;
      img.alt = title;
      img.loading = 'lazy';
      img.width = 720;
      img.height = 405;
      img.setAttribute('itemprop', 'image');
      link.appendChild(img);
    } else {
      var fallback = document.createElement('span');
      fallback.className = 'media-fallback';
      fallback.setAttribute('aria-hidden', 'true');
      fallback.textContent = 'aicon';
      link.appendChild(fallback);
    }
    article.appendChild(link);

    var content = document.createElement('div');
    content.className = 'post-card-content';
    var labels = labelsFor(entry);
    if (labels.length) {
      var label = document.createElement('span');
      label.className = 'post-label';
      label.textContent = labels[0];
      content.appendChild(label);
    }
    var heading = document.createElement('h3');
    heading.setAttribute('itemprop', 'headline');
    var headingLink = document.createElement('a');
    headingLink.href = url;
    headingLink.textContent = title;
    heading.appendChild(headingLink);
    content.appendChild(heading);
    if (!compact) {
      var summary = entrySummary(entry);
      if (summary) {
        var excerpt = document.createElement('p');
        excerpt.className = 'post-excerpt';
        excerpt.setAttribute('itemprop', 'description');
        excerpt.textContent = summary;
        content.appendChild(excerpt);
      }
    }
    var meta = document.createElement('div');
    meta.className = 'post-meta';
    var published = entry.published && entry.published.$t ? new Date(entry.published.$t) : null;
    var date = document.createElement('time');
    if (published && !isNaN(published.getTime())) {
      date.dateTime = published.toISOString();
      date.textContent = published.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    meta.appendChild(date);
    content.appendChild(meta);
    article.appendChild(content);
    return article;
  }

  function featured(entry) {
    var url = alternateLink(entry);
    var title = entry.title && entry.title.$t ? entry.title.$t : '';
    if (!url || !title) return null;
    var article = document.createElement('article');
    article.className = 'featured-card';
    var link = document.createElement('a');
    link.className = 'media';
    link.href = url;
    var image = entryImage(entry);
    if (image) {
      var img = document.createElement('img');
      img.src = image;
      img.alt = title;
      img.loading = 'eager';
      img.fetchPriority = 'high';
      img.width = 1200;
      img.height = 675;
      link.appendChild(img);
    } else {
      var fallback = document.createElement('span');
      fallback.className = 'media-fallback';
      fallback.textContent = 'aicon';
      fallback.setAttribute('aria-hidden', 'true');
      link.appendChild(fallback);
    }
    article.appendChild(link);
    var content = document.createElement('div');
    content.className = 'featured-card-content';
    var labels = labelsFor(entry);
    if (labels.length) { var label = document.createElement('span'); label.className = 'post-label'; label.textContent = labels[0]; content.appendChild(label); }
    var heading = document.createElement('h3');
    var headingLink = document.createElement('a');
    headingLink.href = url;
    headingLink.textContent = title;
    heading.appendChild(headingLink);
    content.appendChild(heading);
    var summary = entrySummary(entry);
    if (summary) { var excerpt = document.createElement('p'); excerpt.className = 'post-excerpt'; excerpt.textContent = summary; content.appendChild(excerpt); }
    var meta = document.createElement('div');
    meta.className = 'post-meta';
    if (entry.published && entry.published.$t) meta.textContent = new Date(entry.published.$t).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    content.appendChild(meta);
    article.appendChild(content);
    return article;
  }

  function showEmpty(section, show) {
    var empty = section.querySelector('[data-empty]');
    if (empty) empty.hidden = !show;
  }

  function render() {
    var featuredSection = document.querySelector('[data-feed-section="featured"]');
    if (featuredSection) {
      var target = featuredSection.querySelector('[data-feed-target]');
      var item = entries.length ? featured(entries[0]) : null;
      if (target && item) target.appendChild(item);
      showEmpty(featuredSection, !item);
    }

    var latestSection = document.querySelector('[data-feed-section="latest"]');
    if (latestSection) {
      var latestTarget = latestSection.querySelector('[data-feed-target]');
      entries.forEach(function (entry) { var item = card(entry, false); if (item && latestTarget) latestTarget.appendChild(item); });
      showEmpty(latestSection, !latestTarget || !latestTarget.children.length);
    }

    document.querySelectorAll('[data-feed-section]:not([data-feed-section="featured"]):not([data-feed-section="latest"])').forEach(function (section) {
      var wanted = section.getAttribute('data-feed-section').toLowerCase();
      var target = section.querySelector('[data-feed-target]');
      var matches = entries.filter(function (entry) { return labelsFor(entry).some(function (label) { return label.toLowerCase() === wanted; }); });
      matches.slice(0, 4).forEach(function (entry) { var item = card(entry, true); if (item && target) target.appendChild(item); });
      var hasPosts = !!(target && target.children.length);
      section.setAttribute('data-has-posts', String(hasPosts));
      showEmpty(section, !hasPosts);
    });
  }

  function loadFeed() {
    var url = new URL('feeds/posts/default', blogUrl);
    url.searchParams.set('alt', 'json');
    url.searchParams.set('max-results', '24');
    return fetch(url.toString(), { mode: 'cors' }).then(function (response) {
      if (!response.ok) throw new Error('Blogger feed unavailable');
      return response.json();
    }).then(function (data) {
      entries = data.feed && data.feed.entry ? data.feed.entry : [];
      render();
    }).catch(function () {
      render();
    });
  }

  if (searchInput) {
    document.getElementById('search-form').addEventListener('submit', function (event) {
      event.preventDefault();
      var query = searchInput.value.trim().toLowerCase();
      if (!query) return;
      var results = entries.filter(function (entry) { return ((entry.title && entry.title.$t) || '').toLowerCase().indexOf(query) !== -1 || entrySummary(entry).toLowerCase().indexOf(query) !== -1; });
      var latest = document.querySelector('[data-feed-section="latest"] [data-feed-target]');
      if (latest) {
        latest.innerHTML = '';
        results.forEach(function (entry) { var item = card(entry, false); if (item) latest.appendChild(item); });
        var section = document.querySelector('[data-feed-section="latest"]');
        showEmpty(section, !results.length);
      }
      if (searchNote) searchNote.textContent = results.length ? 'Showing published posts matching “' + searchInput.value.trim() + '”.' : 'No published posts match this search.';
      setSearch(false);
      var latestAnchor = document.getElementById('latest');
      if (latestAnchor) latestAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  loadFeed();
}());
