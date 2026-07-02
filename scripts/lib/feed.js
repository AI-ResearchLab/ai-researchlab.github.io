function escapeXml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  }[c]));
}

function generateFeed(config, posts) {
  const entries = posts
    .slice(0, 20)
    .map(
      (p) => `
  <entry>
    <title>${escapeXml(p.data.title)}</title>
    <link href="${config.url}${p.url}"/>
    <id>${config.url}${p.url}</id>
    <updated>${new Date(p.data.date).toISOString()}</updated>
    <summary>${escapeXml(p.data.excerpt || '')}</summary>
  </entry>`
    )
    .join('');

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(config.title)}</title>
  <subtitle>${escapeXml(config.subtitle || '')}</subtitle>
  <link href="${config.url}/feed.xml" rel="self"/>
  <link href="${config.url}/"/>
  <updated>${new Date().toISOString()}</updated>
  <id>${config.url}/</id>${entries}
</feed>
`;
}

function generateSitemap(config, urls) {
  const items = urls.map((u) => `  <url><loc>${config.url}${u}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>
`;
}

module.exports = { generateFeed, generateSitemap };
