const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

const URL = 'https://whosnext.com/en/press';

app.get('/articles', async (req, res) => {
  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    const articles = [];

    $('.grid-item').each((i, el) => {
      const title = $(el).find('.title').text().trim();
      const date = $(el).find('.date').text().trim();
      const img = $(el).find('img').attr('src');
      const link = $(el).find('a').attr('href');

      articles.push({
        title,
        date,
        image: img ? (img.startsWith('http') ? img : `https://whosnext.com${img}`) : null,
        link: link ? (link.startsWith('http') ? link : `https://whosnext.com${link}`) : null,
      });
    });

    res.json(articles);
  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
    res.status(500).json({ error: 'Something went wrong during scraping.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
