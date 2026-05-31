import { client } from "../utils/client.js"
import * as cheerio from 'cheerio'

export const getEpisodes  = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`Fetching episodes for ID: ${id}`);

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
        
        // Now fetch episodes with the extracted series ID
        response = await client.get(`/series/${seriesId}`);
      } catch (episodeError) {
        console.error(`Error fetching episode page:`, episodeError.message);
        throw episodeError;
      }
    }
    
    console.log(`Response status: ${response.status}`);
    const $ = cheerio.load(response.data)

    const data = []

    $('#episodes .episodios li').each(function() {
      const href = $(this).find('a').attr('href');
      const episodeId = href?.split('os/').pop()?.replace('/', '') || '';
      const img = $(this).find('img').attr('data-src')?.trim() || '';
      const title = $(this).find('a').text().trim() || 'Unknown';
      const uploaded = $(this).find('.episodiotitle span.date').text().trim() || '';
      
      if (episodeId) {
        data.push({
          id: episodeId,
          img,
          title,
          uploaded
        })
      }
    })

    console.log(`Found ${data.length} episodes`);
    return res.status(200).send(data)
  } catch (error) {
    console.error('Error in getEpisodes:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ message: error.message })
  }
}
