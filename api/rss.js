const RSS = require('rss');

module.exports = async (req, res) => {
  const locale = req.query.locale || 'en-US';
  const apiUrl = `https://advertising.amazon.com/a20m-api/v1/pages?subpageType=Whats%20new&locale=${locale}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    const feed = new RSS({
      title: `Amazon Advertising - What's New (${locale.toUpperCase()})`,
      description: 'Latest updates and news from Amazon Advertising',
      feed_url: `${req.headers.host}/api/rss?locale=${locale}`,
      site_url: 'https://advertising.amazon.com',
      language: locale.split('-')[0],
      pubDate: new Date().toISOString(),
      ttl: 60
    });

    if (Array.isArray(data)) {
      data.forEach(item => {
        const marketplaces = item.relatedMarketplaces ?
          item.relatedMarketplaces.filter(m => !m.startsWith('sKey-')).join(', ') : '';
        const products = item.relatedProducts ?
          item.relatedProducts.filter(p => !p.startsWith('sKey-')).join(', ') : '';

        let descriptionHtml = `<p>${item.description || ''}</p>`;

        if (marketplaces) {
          descriptionHtml += `<p><strong>Marketplaces:</strong> ${marketplaces}</p>`;
        }

        if (products) {
          descriptionHtml += `<p><strong>Products:</strong> ${products}</p>`;
        }

        feed.item({
          title: item.title || 'Untitled',
          description: descriptionHtml,
          url: item.url ? `https://advertising.amazon.com${item.url}` : 'https://advertising.amazon.com',
          date: item.publishDateTimestamp || item.publishDate || new Date().toISOString(),
          guid: item.url || item.title
        });
      });
    }

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'max-age=3600, s-maxage=3600, stale-while-revalidate');
    res.status(200).send(feed.xml({ indent: true }));

  } catch (error) {
    console.error('Error fetching or processing data:', error);
    res.status(500).json({
      error: 'Failed to generate RSS feed',
      details: error.message
    });
  }
};