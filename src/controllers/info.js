import { client } from "../utils/client.js"
import * as cheerio from 'cheerio'

export const getInfo = async (req, res) => {
  try {
    const { id } = req.params

    const response = await client.get(`/series/${id}`);
    const $ = cheerio.load(response.data)

    const data = {
      title: null,
      img: null,
      isUncensored: false,
      aired: null,
      genres: [],
      synopsis: null,
      tags: [],
      images: [],
      about: {
        alternativeTitle: null,
        firstAirDate: null,
        lastAirDate: null,
        seasons: null,
        episodes: null,
        averageDuration: null,
        studios: []
      }
    }

    const selector = $('#single .content.right')

    data.title = $(selector).find('.sheader .data h1').text().trim()
    data.img = $(selector).find('img').attr('data-src')
    data.isUncensored = $(selector).find('.buttonuncensured').length > 0
    data.aired = $(selector).find('.extra .date').text().trim()
    $(selector).find('.data .sgeneros a').each(function() {
      data.genres.push($(this).attr('href').split('re/').pop().replace('/', ''))
    })
    data.synopsis = $(selector).find('.sbox .wp-content > p').text().trim()
    $(selector).find('.wp-tags > li > a').each(function() {
      data.tags.push($(this).attr('href').split('tag/').pop().replace('/', ''))
    })
    $(selector).find('#dt_galery img').each(function() {
      data.images.push($(this).attr("data-src").trim())
    })

    $(selector).find('.custom_fields .variante').each(function() {
      const fields = $(this).text()

      switch(fields) {
        case 'Alternative title':
          data.about.alternativeTitle = $(this).next().text().trim()
          break

        case 'First air date': 
          data.about.firstAirDate = $(this).next().text().trim()
          break

        case 'Last air date':
          data.about.lastAirDate = $(this).next().text().trim()
          break

        case 'Seasons': 
          data.about.seasons = Number($(this).next().text().trim())
          break

        case 'Episodes':
          data.about.episodes = Number($(this).next().text().trim())
          break

        case 'Average Duration':
          data.about.averageDuration = $(this).next().text().trim()
          break

        case 'Studio':
          $(this).next().find('a').each(function() {
            data.about.studios.push($(this).attr('href').split('studio/').pop().replace('/', ''))
          })
      }
    })

    return res.status(200).send(data)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}