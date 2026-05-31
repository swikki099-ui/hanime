import { client } from '../utils/client.js'
import * as cheerio from 'cheerio'

export const getSpotlight = async (req, res) => {
  try {
    const response = await client('/');
    const $ = cheerio.load(response.data);

    const data = []

    $('#slider-movies-tvshows .image').each(function() {
      data.push({
        id: $(this).find('a').attr('href').split('es/').pop().replace('/', ''),
        img: $(this).find('img').attr('data-src'),
        title: $(this).find('.title').text().trim(),
        year: Number($(this).find('.data > span').text().trim())
      })
    });

    return res.status(200).send(data)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}