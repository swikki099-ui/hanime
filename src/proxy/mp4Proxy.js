import { client } from "../utils/client.js"

export const mp4Proxy = async (req, res) => {
  try {
    const { url } = req.query
    const range = req.headers.range;

    if (!url) {
      return res.status(400).json({ message: "Missing URL parameter" });
    }

    const headers = {
      Referer: "https://watchhentai.net/",
      ...(range && { Range: range }) // Forward range header if present
    };

    const response = await client.get(url, {
      responseType: 'stream',
      headers,
      validateStatus: (status) => status < 500 // Allow 206 Partial Content
    })

    res.status(response.status);
    for (const [key, value] of Object.entries(response.headers)) {
      res.setHeader(key, value);
    }

    response.data.pipe(res)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}