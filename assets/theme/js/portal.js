/* Shared shell for the legacy static pages. Kept dependency-free for GitHub Pages. */
(() => {
  // The legacy Mobirise bundle is present on every page. Load our layer last so
  // the portal tokens intentionally win without rewriting project content.
  if (!document.getElementById('portal-design-layer')) {
    const designLayer = document.createElement('link');
    designLayer.id = 'portal-design-layer';
    designLayer.rel = 'stylesheet';
    designLayer.href = 'assets/theme/css/portal.css';
    document.head.append(designLayer);
  }

  const page = window.location.pathname.split('/').pop() || 'index.html';
  const portal = 'https://www.3domics.eu/database/';
  const link = (href, label, current = false, marked = false) =>
    `<a href="${href}"${current ? ' aria-current="page"' : ''}>${marked ? '<span class="portal-menu-mark" aria-hidden="true"></span>' : ''}${label}</a>`;
  const group = (label, links) => {
    const id = `portal-menu-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const current = links.some(([href]) => page === href);
    return `
      <li class="portal-menu-group${current ? ' is-current' : ''}">
        <button class="portal-menu-trigger" type="button" aria-expanded="false" aria-controls="${id}">${label} <span aria-hidden="true">⌄</span></button>
        <ul class="portal-submenu" id="${id}">${links.map(([href, name]) => `<li>${link(href, name, page === href, true)}</li>`).join('')}</ul>
      </li>`;
  };

  const navigation = [
    `<li>${link('index.html', 'Home', page === 'index.html')}</li>`,
    group('Project', [
      ['concept.html', 'Concept'],
      ['workflow.html', 'Workflow & management'],
      ['consortium.html', 'Consortium & board'],
      ['sneak_peek.html', 'Progress sneak-peek'],
    ]),
    group('Resources', [
      [portal, "3D'omics Data Portal"],
      ['cooperations.html', 'Cooperations'],
      ['publications.html', 'Publications'],
      ['press.html', 'Press coverage'],
      ['outreach.html', 'Outreach & videos'],
    ]),
    group('Activities', [
      ['training.html', 'Training activities'],
      ['events.html', "3D'omics events"],
    ]),
    `<li>${link('contact.html', 'Contact', page === 'contact.html')}</li>`,
  ].join('');

  const shell = `
    <nav class="portal-nav" aria-label="Primary navigation">
      <div class="portal-nav__inner">
        <div class="portal-brand-group">
          <a class="portal-brand" href="index.html" aria-label="3D'omics home">
            <img src="assets/images/3domics-logo-1-378x120.png" alt="3D'omics logo">
          </a>
        </div>
        <ul class="portal-links">${navigation}</ul>
        <button class="portal-theme" type="button" aria-label="Theme: system" title="Theme: system"><span aria-hidden="true">◐</span></button>
        <button class="portal-menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false">☰</button>
      </div>
    </nav>`;

  const footer = `
    <footer class="portal-footer">
      <div class="portal-footer__content">
        <div class="portal-footer__funding">
          <img class="portal-footer__flag" src="assets/images/eu-flag.jpeg" alt="European Union flag">
          <p>This project has received funding from the European Union's Horizon 2020 Research and Innovation programme under grant agreement No. 101000309.</p>
        </div>
        <ul class="portal-footer__meta">
          <li>Coordinator: <a href="https://www.alberdilab.dk/">Antton Alberdi (UCPH)</a></li>
          <li class="portal-footer__meta-separator" aria-hidden="true">|</li>
          <li>Contact: <a href="mailto:3d-omics@sund.ku.dk">3d-omics@sund.ku.dk</a></li>
          <li class="portal-footer__meta-separator" aria-hidden="true">|</li>
          <li><a href="privacy.html">Data and privacy policy</a></li>
        </ul>
      </div>
      <ul class="portal-footer__social" aria-label="3D'omics social links">
        <li><a href="https://bsky.app/profile/3domics.bsky.social" aria-label="Bluesky"><span class="mbr-iconfont mbrib-cloud"></span></a></li>
        <li><a href="https://github.com/3d-omics" aria-label="GitHub"><span class="mbr-iconfont mbrib-github"></span></a></li>
        <li><a href="https://www.youtube.com/channel/UCELmDxgD1-AV0ObFl9UZNyQ" aria-label="YouTube"><span class="mbr-iconfont socicon-youtube socicon"></span></a></li>
        <li><a href="https://www.linkedin.com/company/79361799/admin/dashboard/" aria-label="LinkedIn"><span class="mbr-iconfont socicon-linkedin socicon"></span></a></li>
      </ul>
    </footer>`;

  const preferences = ['system', 'light', 'dark'];
  const themeIcon = (preference) => preference === 'light' ? '☀' : preference === 'dark' ? '●' : '◐';
  const readThemePreference = () => {
    try {
      return localStorage.getItem('theme');
    } catch {
      return null;
    }
  };
  const storeThemePreference = (preference) => {
    try {
      localStorage.setItem('theme', preference);
    } catch {
      // Storage can be unavailable in private browsing contexts.
    }
  };
  const resolveTheme = (preference) => preference === 'system'
    ? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : preference;
  const setTheme = (preference) => {
    document.documentElement.dataset.theme = resolveTheme(preference);
    storeThemePreference(preference);
    document.querySelectorAll('.portal-theme').forEach((toggle) => {
      toggle.setAttribute('aria-label', `Theme: ${preference}`);
      toggle.setAttribute('title', `Theme: ${preference}`);
      toggle.innerHTML = `<span aria-hidden="true">${themeIcon(preference)}</span>`;
    });
  };

  const boot = () => {
    document.body.classList.add('portal-site');
    const saved = readThemePreference();
    const preference = preferences.includes(saved) ? saved : 'system';
    setTheme(preference);

    // Non-home pages follow the data portal's PageHeader pattern: a compact
    // prism banner with a breadcrumb trail, title, and optional introduction.
    // The legacy source heading remains in the document as the content editor
    // expects it, but is hidden once its standardized replacement is in place.
    const firstPageSection = [...document.body.children].find((element) =>
      element.tagName === 'SECTION' && !element.matches('.menu1, .footer1, .footer2'));
    const breadcrumbGroups = {
      'concept.html': 'Project',
      'workflow.html': 'Project',
      'consortium.html': 'Project',
      'sneak_peek.html': 'Project',
      'cooperations.html': 'Resources',
      'publications.html': 'Resources',
      'press.html': 'Resources',
      'outreach.html': 'Resources',
      'training.html': 'Activities',
      'TrainingEvent_MicrobiomeAtlas.html': 'Activities',
      'events.html': 'Activities',
      'wp3.html': 'Work packages',
      'wp4.html': 'Work packages',
      'wp5.html': 'Work packages',
      'wp6.html': 'Work packages',
      'wp7.html': 'Work packages',
      'wp8.html': 'Work packages',
      'wp9.html': 'Work packages',
    };
    if (page !== 'index.html' && firstPageSection) {
      const sourceTitle = firstPageSection.querySelector('h1, .mbr-section-title, h2');
      const sourceIntro = [...firstPageSection.querySelectorAll('.mbr-section-subtitle, .mbr-section-text')]
        .find((element) => element !== sourceTitle && element.textContent.replace(/\s+/g, ' ').trim());
      const normalizedText = (element) => {
        if (!element) return '';
        const copy = element.cloneNode(true);
        copy.querySelectorAll('br').forEach((breakElement) => breakElement.replaceWith(' '));
        copy.querySelectorAll('div, p').forEach((block) => {
          block.before(' ');
          block.after(' ');
        });
        return copy.textContent.replace(/\s+/g, ' ').trim();
      };
      const title = normalizedText(sourceTitle);
      const intro = sourceIntro?.textContent?.replace(/\s+/g, ' ').trim();

      if (title) {
        const header = document.createElement('header');
        header.className = 'portal-page-header';

        const breadcrumb = document.createElement('nav');
        breadcrumb.className = 'portal-page-header__breadcrumb';
        breadcrumb.setAttribute('aria-label', 'Breadcrumb');
        const trail = document.createElement('ol');
        const items = [
          { label: 'Home', href: 'index.html' },
          ...(breadcrumbGroups[page] ? [{ label: breadcrumbGroups[page] }] : []),
          { label: title },
        ];
        items.forEach((item, index) => {
          const entry = document.createElement('li');
          if (index > 0) {
            const separator = document.createElement('span');
            separator.className = 'portal-page-header__separator';
            separator.setAttribute('aria-hidden', 'true');
            entry.append(separator);
          }
          if (item.href) {
            const link = document.createElement('a');
            link.href = item.href;
            link.textContent = item.label;
            entry.append(link);
          } else {
            const label = document.createElement('span');
            label.textContent = item.label;
            if (index === items.length - 1) {
              label.className = 'portal-page-header__current';
              label.setAttribute('aria-current', 'page');
            }
            entry.append(label);
          }
          trail.append(entry);
        });
        breadcrumb.append(trail);

        const heading = document.createElement('h1');
        heading.className = 'portal-page-header__title';
        heading.textContent = title;
        header.append(breadcrumb, heading);
        if (intro) {
          const description = document.createElement('p');
          description.className = 'portal-page-header__intro';
          description.textContent = intro;
          header.append(description);
          sourceIntro.classList.add('portal-source-intro');
        }
        firstPageSection.before(header);

        if (firstPageSection.matches('.header1, .header2, .content4')) {
          firstPageSection.classList.add('portal-source-hero');
        } else {
          sourceTitle.classList.add('portal-source-title');
        }
      }
    }
    document.body.insertAdjacentHTML('afterbegin', shell);
    document.body.insertAdjacentHTML('beforeend', footer);

    // Keep the project footer on exactly the same prism surface as the page hero.
    const hero = document.querySelector('.header1, .header2');
    const portalFooter = document.querySelector('.portal-footer');
    if (hero && portalFooter) {
      const heroStyle = window.getComputedStyle(hero);
      portalFooter.style.backgroundColor = heroStyle.backgroundColor;
      portalFooter.style.backgroundImage = heroStyle.backgroundImage;
    }

    // The external feed is useful project content; its vendor attribution is not.
    // The widget mounts after cookie consent, so observe it and mark every tweet
    // wrapper as a portal card as it arrives.
    const socialFeed = document.querySelector('.eb-twitter-feed');
    const prepareSocialFeed = () => {
      socialFeed?.querySelectorAll('a[href*="electricblaze.com/twitter-feed"]').forEach((promotion) => {
        const wrapper = promotion.parentElement;
        promotion.remove();
        if (wrapper && !wrapper.textContent.trim() && !wrapper.querySelector('img, svg, iframe')) wrapper.remove();
      });
      socialFeed?.querySelectorAll('iframe.twitter-tweet-rendered, blockquote.twitter-tweet').forEach((tweet) => {
        const card = tweet.closest('a') || tweet.parentElement;
        card?.classList.add('portal-feed-card');
      });
    };
    prepareSocialFeed();
    if (socialFeed && window.MutationObserver) {
      new MutationObserver(prepareSocialFeed).observe(socialFeed, { childList: true, subtree: true });
    }

    const menu = document.querySelector('.portal-links');
    const menuToggle = document.querySelector('.portal-menu-toggle');
    const menuGroups = menu?.querySelectorAll('.portal-menu-group');
    const closeGroups = (except) => menuGroups?.forEach((group) => {
      if (group === except) return;
      group.classList.remove('is-open');
      group.querySelector('.portal-menu-trigger')?.setAttribute('aria-expanded', 'false');
    });

    menu?.querySelectorAll('.portal-menu-trigger').forEach((trigger) => trigger.addEventListener('click', () => {
      const group = trigger.closest('.portal-menu-group');
      const open = !group.classList.contains('is-open');
      closeGroups(group);
      group.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    }));
    menuToggle?.addEventListener('click', () => {
      const open = menu?.classList.toggle('is-open') ?? false;
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      menuToggle.textContent = open ? '×' : '☰';
    });
    menu?.querySelectorAll('a').forEach((item) => item.addEventListener('click', () => {
      menu.classList.remove('is-open');
      closeGroups();
      menuToggle?.setAttribute('aria-expanded', 'false');
      if (menuToggle) menuToggle.textContent = '☰';
    }));
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.portal-menu-group')) closeGroups();
    });
    document.querySelectorAll('.portal-theme').forEach((toggle) => toggle.addEventListener('click', () => {
      const current = readThemePreference();
      setTheme(preferences[(preferences.indexOf(current) + 1) % preferences.length]);
    }));

    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
      if (readThemePreference() === 'system') setTheme('system');
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
