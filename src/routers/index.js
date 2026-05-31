import { Router } from "express";
import { getSpotlight } from "../controllers/spotlight.js";
import { getCategory } from "../controllers/category.js";
import { getSearch } from "../controllers/search.js";
import { getRecentEpisodes } from "../controllers/recentEpisodes.js";
import { getInfo } from "../controllers/info.js";
import { getRelated } from "../controllers/related.js";
import { getEpisodes } from "../controllers/episodes.js";
import { getSource } from "../controllers/source.js";
import { getTrending } from "../controllers/trending.js";
import { mp4Proxy } from "../proxy/mp4Proxy.js";
import { downloadMp4 } from "../controllers/downloadMp4.js";

export const router = Router();

router.get("/download-mp4", downloadMp4);

router.get('/mp4-proxy', mp4Proxy)

router.get('/spotlight', getSpotlight)

router.get('/recent-episodes', getRecentEpisodes)

router.get('/trending', getTrending)

router.get('/category/:category{/:type}', getCategory)

router.get('/search', getSearch)

router.get('/related/:id', getRelated)

router.get('/info/:id', getInfo)

router.get('/episodes/:id', getEpisodes)

router.get('/source/:episodeId', getSource)
