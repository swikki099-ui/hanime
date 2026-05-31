import { client } from "../utils/client.js"
import * as cheerio from 'cheerio'

export const getTrending = async (req, res) => {
  try {
    const { page = 1 } = req.query
    console.log(`Fetching trending page: ${page}`);

    const response = await client.get(`/trending/page/${page}`);
    console.log(`Response status: ${response.status}`);
    const $ = cheerio.load(response.data);

    const data = []

    // Try different selectors for trending content
    const items = $('#archive-content article').length > 0 
      ? $('#archive-content article') 
      : $('.items article');

    items.each(function() {
      const href = $(this).find('a').attr('href');
      const id = href?.split('es/').pop()?.replace('/', '') || '';
      const img = $(this).find('img').attr('data-src') || '';
      const title = $(this).find('.data h3 a').text().trim() || 
                   $(this).find('.data > a > strong > span').text().trim() || 
                   'Unknown';
      const isUncensored = $(this).find('.buttonuncensured').length > 0;
      const yearText = $(this).find('.buttonyear span').text().trim();
      const year = yearText ? Number(yearText) : null;

      if (id) {
        data.push({
          id,
          img,
          title,
          isUncensored,
          year
        })
      }
    })

    console.log(`Found ${data.length} trending items`);
    return res.status(200).send(data)
  } catch (error) {
    console.error('Error in getTrending:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ message: error.message })
  }
}
