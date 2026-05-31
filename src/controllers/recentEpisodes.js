import { client } from "../utils/client.js"
import * as cheerio from 'cheerio'

export const getRecentEpisodes = async (req, res) => {
  try {
    const { page = 1 } = req.query

    const response = await client.get(`/videos/page/${page}`);
    const $ = cheerio.load(response.data);

    const data = []

    $('#archive-content article').each(function() {
      data.push({
        id: $(this).find('a').attr('href').split('os/').pop().replace('/', ''),
        img: $(this).find('img').attr('data-src'),
        title: $(this).find('.data > a > strong > span').text().trim(),
        isUncensored: $(this).find('.buttonuncensured').length > 0,
        tagged: $(this).find('.buttonextra > span').text().trim(),
        uploaded: $(this).find('.videotext > div:nth-child(1)').text().trim(),
        episode: $(this).find('.data > a > h3').text().trim()
      })
    })

    return res.status(200).send(data)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}