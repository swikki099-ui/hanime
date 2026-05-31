import { client } from "../utils/client.js";
import * as cheerio from "cheerio";
import vm from "vm";

export const getSource = async (req, res) => {
  try {
    const { episodeId } = req.params;

    let response = await client.get(`/videos/${episodeId}`);
    let $ = cheerio.load(response.data);
    const id = $(".poster > a")
      .attr("href")
      .split("es/")
      .pop()
      .replace("/", "");
    const prevEpisode = $(".pag_episodes .item:nth-child(1) a")
      .attr("href")
      .split("os/")
      .pop()
      .replace("/", "");
    const nextEpisode = $(".pag_episodes .item:nth-child(3) a")
      .attr("href")
      .split("os/")
      .pop()
      .replace("/", "");
    const iframeSrc = $("#search_iframe").attr("data-litespeed-src");

    response = await client.get(iframeSrc);
    $ = cheerio.load(response.data);
    const script = $('.jwplayer [type="text/javascript"]');
    const scriptHtml = script.html();

    const sourcesMatch = scriptHtml.match(/sources\s*:\s*(\[[\s\S]*?\])/);
    if (!sourcesMatch)
      return res.status(404).json({ message: "Sources block not found" });

    const sourcesRaw = sourcesMatch[1];
    const wrapped = `(${sourcesRaw})`;

    let sources;
    try {
      sources = vm.runInNewContext(wrapped);
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Failed to evaluate sources", error: e.message });
    }

    return res.status(200).json({
      id,
      prevEpisode: prevEpisode === "#" ? null : prevEpisode,
      nextEpisode: nextEpisode === "#" ? null : nextEpisode,
      sources,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
