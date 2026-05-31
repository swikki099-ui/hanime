import { client } from "../utils/client.js"
import * as cheerio from 'cheerio'

export const getCategory = async (req, res) => {
  try {
    const { category, type } = req.params
    const { page = 1 } = req.query

    // Try different URL patterns for categories
    let url;
    if (type) {
      url = `/genre/${category}/${type}/page/${page}`;
    } else {
      url = `/genre/${category}/page/${page}`;
    }
    
    console.log(`Fetching category: ${category}, type: ${type || 'none'}, page: ${page}`);
    console.log(`URL: ${url}`);

    const response = await client.get(url);
    console.log(`Response status: ${response.status}`);
    const $ = cheerio.load(response.data);

    const data = []

    // Try different selectors
    const items = $('.items article').length > 0 ? $('.items article') : $('.result-item');
    
    items.each(function() {
      const href = $(this).find('a').attr('href');
      const id = href?.split('es/').pop()?.replace('/', '') || '';
      const img = $(this).find('img').attr('data-src') || '';
      const title = $(this).find('.data h3 a').text().trim() || 'Unknown';
      const yearText = $(this).find('.buttonyear span').text().trim();
      const year = yearText ? Number(yearText) : null;

      if (id) {
        data.push({
          id,
          img,
          title,
          isUncensored: $(this).find('.buttonuncensured').length > 0,
          year
        })
      }
    })

    console.log(`Found ${data.length} items in category`);
    return res.status(200).send(data)
  } catch (error) {
    console.error('Error in getCategory:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ message: error.message })
  }
}
