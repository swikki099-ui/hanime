import { client } from "../utils/client.js"
import * as cheerio from 'cheerio'

export const getInfo = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`Fetching info for ID: ${id}`);

    // Try different URL patterns
    let response;
    let seriesId = id;
    
    try {
      // First try as series ID
      response = await client.get(`/series/${id}`);
    } catch (error) {
      console.error(`Error fetching with /series/${id}:`, error.message);
      
      // If that fails, try as episode ID and extract series ID
      console.log(`Trying as episode ID: ${id}`);
      try {
        const episodeResponse = await client.get(`/videos/${id}`);
        const $ = cheerio.load(episodeResponse.data);
        seriesId = $(".poster > a")
          .attr("href")
          ?.split("es/")
          ?.pop()
          ?.replace("/", "") || id;
        console.log(`Extracted series ID: ${seriesId}`);
        
        // Now fetch series info with the extracted series ID
        response = await client.get(`/series/${seriesId}`);
      } catch (episodeError) {
        console.error(`Error fetching episode page:`, episodeError.message);
        
        // Try alternative URL pattern
        try {
          response = await client.get(`/${id}`);
        } catch (altError) {
          console.error(`All URL patterns failed for ID: ${id}`);
          throw altError;
        }
      }
    }
    
    console.log(`Response status: ${response.status}`);
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
    if (selector.length === 0) {
      console.error('Selector #single .content.right not found');
      return res.status(404).json({ message: 'Series not found' });
    }

    data.title = $(selector).find('.sheader .data h1').text().trim() || 'Unknown'
    data.img = $(selector).find('img').attr('data-src') || ''
    data.isUncensored = $(selector).find('.buttonuncensured').length > 0
    data.aired = $(selector).find('.extra .date').text().trim() || ''
    $(selector).find('.data .sgeneros a').each(function() {
      const genre = $(this).attr('href')?.split('re/').pop()?.replace('/', '') || ''
      if (genre) data.genres.push(genre)
    })
    data.synopsis = $(selector).find('.sbox .wp-content > p').text().trim() || ''
    $(selector).find('.wp-tags > li > a').each(function() {
      const tag = $(this).attr('href')?.split('tag/').pop()?.replace('/', '') || ''
      if (tag) data.tags.push(tag)
    })
    $(selector).find('#dt_galery img').each(function() {
      const img = $(this).attr("data-src")?.trim()
      if (img) data.images.push(img)
    })

    $(selector).find('.custom_fields .variante').each(function() {
      const fields = $(this).text().trim()

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
            const studio = $(this).attr('href')?.split('studio/').pop()?.replace('/', '') || ''
            if (studio) data.about.studios.push(studio)
          })
      }
    })

    return res.status(200).send(data)
  } catch (error) {
    console.error('Error in getInfo:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ message: error.message })
  }
}
