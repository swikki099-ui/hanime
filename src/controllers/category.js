import { client } from "../utils/client.js"
import * as cheerio from 'cheerio'

export const getCategory = async (req, res) => {
  try {
    const { category, type } = req.params
    const { page = 1 } = req.query

    const url = type ? `/${category}/${type}/page/${page}` : `/${category}/page/${page}`
    const response = await client.get(url);
    const $ = cheerio.load(response.data);

    const data = []

    $('.items article').each(function() {
      data.push({
        id: $(this).find('a').attr('href').split('es/').pop().replace('/', ''),
        img: $(this).find('img').attr('data-src'),
        title: $(this).find('.data h3 a').text().trim(),
        isUncensored: $(this).find('.buttonuncensured').length > 0,
        year: Number($(this).find('.buttonyear span').text().trim())
      })
    })

    return res.status(200).send(data)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}