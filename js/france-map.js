/* OneClickFrance — interactive region map
   Loads assets/france-map.svg into any element with id="france-map-mount",
   wires up hover tooltips and click-through to /regions/<slug>.html
   Map data: 13 regions of mainland France; outlines from gregoiredavid/france-geojson
*/
const FRANCE_REGIONS = [
  { slug: "auvergne-rhone-alpes", name: "Auvergne-Rhône-Alpes" },
  { slug: "bourgogne-franche-comte", name: "Burgundy-Franche-Comté" },
  { slug: "bretagne", name: "Brittany" },
  { slug: "centre-val-de-loire", name: "Centre-Val de Loire" },
  { slug: "corse", name: "Corsica" },
  { slug: "grand-est", name: "Grand Est" },
  { slug: "hauts-de-france", name: "Hauts-de-France" },
  { slug: "normandie", name: "Normandy" },
  { slug: "nouvelle-aquitaine", name: "Nouvelle-Aquitaine" },
  { slug: "occitanie", name: "Occitanie" },
  { slug: "pays-de-la-loire", name: "Pays de la Loire" },
  { slug: "provence-alpes-cote-d-azur", name: "Provence-Alpes-Côte d'Azur" },
  { slug: "ile-de-france", name: "Île-de-France" }
];

function regionHref(slug) {
  // From the homepage (root) the link is regions/<slug>.html
  // From inside /regions/ it should just be <slug>.html — handled via data-map-base on the mount element.
  // Note: an empty string is a valid, meaningful base (means "same folder"), so we
  // check whether the attribute was set at all rather than using `||`, which would
  // treat "" as missing and wrongly fall back to 'regions/'.
  const mount = document.getElementById('france-map-mount');
  const base = (mount && mount.dataset.mapBase !== undefined) ? mount.dataset.mapBase : 'regions/';
  return base + slug + '.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('france-map-mount');
  if (!mount) return;

  fetch(mount.dataset.mapSrc || 'assets/france-map.svg')
    .then(res => res.text())
    .then(svgText => {
      mount.innerHTML =
        '<div class="region-map-holder">' +
          '<div class="region-map-wrap">' + svgText + '</div>' +
          '<div class="region-tooltip" id="region-tooltip"></div>' +
        '</div>';

      const svg = mount.querySelector('svg');
      const tooltip = mount.querySelector('#region-tooltip');
      const holder = mount.querySelector('.region-map-holder');
      if (!svg) return;

      svg.querySelectorAll('path[id]').forEach(path => {
        const slug = path.getAttribute('id');
        const region = FRANCE_REGIONS.find(r => r.slug === slug);
        const rawLabel = region ? region.name : path.getAttribute('aria-label') || slug;
        const label = window.OCI_T ? window.OCI_T(rawLabel) : rawLabel;

        path.setAttribute('tabindex', '0');
        path.setAttribute('role', 'link');
        path.setAttribute('aria-label', label);

        path.addEventListener('mouseenter', (e) => {
          tooltip.textContent = label;
          tooltip.classList.add('is-visible');
        });
        path.addEventListener('mousemove', (e) => {
          const rect = holder.getBoundingClientRect();
          tooltip.style.left = (e.clientX - rect.left) + 'px';
          tooltip.style.top = (e.clientY - rect.top) + 'px';
        });
        path.addEventListener('mouseleave', () => {
          tooltip.classList.remove('is-visible');
        });
        path.addEventListener('click', () => {
          window.location.href = regionHref(slug);
        });
        path.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.location.href = regionHref(slug);
          }
        });
      });
    })
    .catch(() => {
      const base = (mount.dataset.mapBase !== undefined) ? mount.dataset.mapBase : 'regions/';
      const listHref = base === '' ? 'index.html' : base + 'index.html';
      mount.innerHTML = '<p style="color:var(--ink-soft);">Map unavailable right now — browse the <a href="' + listHref + '" style="color:var(--terracotta);font-weight:600;">full regions list</a> instead.</p>';
    });
});
