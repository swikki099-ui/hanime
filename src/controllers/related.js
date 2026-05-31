import { client } from "../utils/client.js"
import * as cheerio from 'cheerio'

export const getRelated  = async (req, res) => {
  try {
    const { id } = req.params

    const response = await client.get(`/series/${id}`)
    const $ = cheerio.load(response.data)

    const data = []

    $('#single_relacionados article a').each(function() {
      data.push({
        id: $(this).attr('href').split('es/').pop().replace('/', ''),
        img: $(this).find('img').attr('data-src').trim(),
        title: $(this).find('img').attr('title').trim()
      })
    })

    return res.status(200).send(data)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}