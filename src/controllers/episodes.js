import { client } from "../utils/client.js"
import * as cheerio from 'cheerio'

export const getEpisodes  = async (req, res) => {
  try {
    const { id } = req.params

    const response = await client.get(`/series/${id}`)
    const $ = cheerio.load(response.data)

    const data = []

    $('#episodes .episodios li').each(function() {
      data.push({
        id: $(this).find('a').attr('href').split('os/').pop().replace('/', ''),
        img: $(this).find('img').attr('data-src').trim(),
        title: $(this).find('a').text().trim(),
        uploaded: $(this).find('.episodiotitle span.date').text().trim()
      })
    })

    return res.status(200).send(data)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}