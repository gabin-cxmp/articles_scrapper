const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🔎 Use /articles to get the latest press releases from Who\'s Next');
});

app.get('/articles', async (req, res) => {
  try {
    const url = 'https://whosnext.com/en/press';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const articles = [];

    $('ul li a').each((i, el) => {
      const title = $(el).find('h2').text().trim();
      const date = $(el).find('span').text().trim();
      const img = $(el).find('img').attr('src');
      const link = $(el).attr('href');

      if (title && date && link && img) {
        articles.push({
          title,
          date,
          img,
          link
        });
      }
    });

    res.json(articles);
  } catch (error) {
    console.error('Scraping failed:', error);
    res.status(500).send('Error occurred while scraping articles');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
