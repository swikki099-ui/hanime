import axios from "axios";

export const downloadMp4 = async (req, res) => {
  try {
    const url = req.query.url;
    const fileName = req.query.fileName;

    const response = await axios.get(url, {
      responseType: 'stream',
      headers: {
        Referer: "https://watchhentai.net/",
      }
    });
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "video/mp4");

    return response.data.pipe(res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}