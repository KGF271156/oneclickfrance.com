# OneClick France

Draft diaspora site for France (static HTML, GitHub Pages), part of the OneClick network.

- 13 metropolitan regions with maps, news feeds (`data/news/`), culture, gastronomy, savoir-vivre, events, sport, communities and a Visit France itinerary form.
- English / French switch (`js/i18n-fr.js`). The French is a first draft and should be reviewed by a native speaker.
- Region content: `data/regions/<slug>.json` (French overlay under `"fr"`).
- Itinerary form webhook: set `WEBHOOK_URL` in `js/itinerary-form.js` once a Make scenario exists.
- Domain: oneclickfrance.com (see `CNAME`).
