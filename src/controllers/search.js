import { client } from "../utils/client.js";
import * as cheerio from "cheerio";

export const getSearch = async (req, res) => {
  try {
    const { s, page = 1 } = req.query;

    const response = await client.get(`/page/${page}/?s=${s}`);
    const $ = cheerio.load(response.data);

    const data = [];

    $(".result-item").each(function () {
      data.push({
        id: $(this).find("a").attr("href").split("es/").pop().replace("/", ""),
        img: $(this).find("img").attr("data-src"),
        title: $(this).find(".title > a").text().trim(),
        synopsis: $(this).find(".contenido").text().trim(),
        year: Number($(this).find(".year").text().trim()),
      });
    });

    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
