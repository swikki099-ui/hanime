# Hanime API

A Node.js Express API that scrapes anime content from watchhentai.net. This API provides endpoints to access anime series information, episodes, video sources, and more through web scraping.

## Features

- Get spotlight/featured anime content
- Browse recent episodes
- Search anime by title
- Get detailed information about anime series
- Retrieve episode lists for series
- Get video streaming sources
- Download MP4 files
- Stream videos through proxy with range support
- Browse by category
- Find related anime

## Installation

1. Clone the repository:
```bash
git clone https://github.com/swikki099-ui/hanime
cd hanime-main
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (if needed for future configuration)

## Usage

### Development Mode
Start the server with auto-reload on file changes:
```bash
npm run dev
```

### Production Mode
Start the server:
```bash
npm start
```

The server will start on port 5050. Access the API at ``

## API Endpoints

### GET /spotlight
Get featured/spotlight anime content from the homepage.

**Response:**
```json
[
  {
    "id": "string",
    "img": "string",
    "title": "string",
    "year": number
  }
]
```

**Example:**
```bash
curl /spotlight
```

---

### GET /recent-episodes
Get the most recently uploaded episodes.

**Query Parameters:**
- `page` (optional, default: 1) - Page number for pagination

**Response:**
```json
[
  {
    "id": "string",
    "img": "string",
    "title": "string",
    "isUncensored": boolean,
    "tagged": "string",
    "uploaded": "string",
    "episode": "string"
  }
]
```

**Example:**
```bash
curl /recent-episodes?page=1
```

---

### GET /category/:category/:type?
Browse anime by category.

**URL Parameters:**
- `category` (required) - Category name (e.g., "hentai", "3d", etc.)
- `type` (optional) - Sub-type within the category

**Query Parameters:**
- `page` (optional, default: 1) - Page number for pagination

**Response:**
```json
[
  {
    "id": "string",
    "img": "string",
    "title": "string",
    "isUncensored": boolean,
    "year": number
  }
]
```

**Examples:**
```bash
curl /category/hentai
curl /category/hentai/3d?page=2
```

---

### GET /search
Search for anime by title.

**Query Parameters:**
- `s` (required) - Search query string
- `page` (optional, default: 1) - Page number for pagination

**Response:**
```json
[
  {
    "id": "string",
    "img": "string",
    "title": "string",
    "synopsis": "string",
    "year": number
  }
]
```

**Example:**
```bash
curl /search?s=keyword&page=1
```

---

### GET /info/:id
Get detailed information about a specific anime series.

**URL Parameters:**
- `id` (required) - Series ID

**Response:**
```json
{
  "title": "string",
  "img": "string",
  "isUncensored": boolean,
  "aired": "string",
  "genres": ["string"],
  "synopsis": "string",
  "tags": ["string"],
  "images": ["string"],
  "about": {
    "alternativeTitle": "string",
    "firstAirDate": "string",
    "lastAirDate": "string",
    "seasons": number,
    "episodes": number,
    "averageDuration": "string",
    "studios": ["string"]
  }
}
```

**Example:**
```bash
curl /info/series-id
```

---

### GET /episodes/:id
Get the list of episodes for a specific anime series.

**URL Parameters:**
- `id` (required) - Series ID

**Response:**
```json
[
  {
    "id": "string",
    "img": "string",
    "title": "string",
    "uploaded": "string"
  }
]
```

**Example:**
```bash
curl /episodes/series-id
```

---

### GET /related/:id
Get related anime recommendations for a specific series.

**URL Parameters:**
- `id` (required) - Series ID

**Response:**
```json
[
  {
    "id": "string",
    "img": "string",
    "title": "string"
  }
]
```

**Example:**
```bash
curl /related/series-id
```

---

### GET /source/:episodeId
Get video streaming sources for a specific episode.

**URL Parameters:**
- `episodeId` (required) - Episode ID

**Response:**
```json
{
  "id": "string",
  "prevEpisode": "string | null",
  "nextEpisode": "string | null",
  "sources": [
    {
      "file": "string",
      "label": "string",
      "type": "string"
    }
  ]
}
```

**Example:**
```bash
curl /source/episode-id
```

---

### GET /download-mp4
Download an MP4 video file directly.

**Query Parameters:**
- `url` (required) - Direct URL to the MP4 file
- `fileName` (required) - Name for the downloaded file

**Response:** Binary file stream (video/mp4)

**Example:**
```bash
curl "/download-mp4?url=https://example.com/video.mp4&fileName=video.mp4" --output video.mp4
```

---

### GET /mp4-proxy
Proxy endpoint for streaming MP4 videos with range support (for video players).

**Query Parameters:**
- `url` (required) - Direct URL to the MP4 file

**Headers:**
- `Range` (optional) - Byte range for partial content (e.g., "bytes=0-1023")

**Response:** Binary stream with appropriate headers for video streaming

**Example:**
```bash
curl "/mp4-proxy?url=https://example.com/video.mp4" --output video.mp4
```

## Dependencies

- `axios` (^1.11.0) - HTTP client for making requests
- `cheerio` (^1.1.2) - HTML parsing and web scraping
- `cors` (^2.8.5) - Cross-Origin Resource Sharing middleware
- `dotenv` (^17.2.1) - Environment variable management
- `express` (^5.1.0) - Web framework
- `nodemon` (^3.1.10) - Development tool for auto-reload

## Configuration

- **Server Port:** 5050
- **Base URL:** https://watchhentai.net (configured in `src/utils/client.js`)
- **Environment:** Uses dotenv for environment variable management

## Project Structure

```
hanime-main/
├── src/
│   ├── controllers/       # Route handlers
│   │   ├── category.js
│   │   ├── downloadMp4.js
│   │   ├── episodes.js
│   │   ├── info.js
│   │   ├── recentEpisodes.js
│   │   ├── related.js
│   │   ├── search.js
│   │   ├── source.js
│   │   └── spotlight.js
│   ├── proxy/            # Proxy endpoints
│   │   └── mp4Proxy.js
│   ├── routers/          # Route definitions
│   │   └── index.js
│   ├── utils/            # Utility functions
│   │   └── client.js
│   └── server.js         # Express server setup
├── package.json
└── package-lock.json
```

## Error Handling

All endpoints return error responses in the following format:

```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (missing parameters)
- `404` - Not Found
- `500` - Internal Server Error

## Notes

- This API scrapes content from watchhentai.net
- The scraping logic depends on the HTML structure of the target website
- Changes to the target website's structure may break the API
- The API includes proper Referer headers for video requests
- Video streaming supports range requests for better playback performance
- All IDs are extracted from URLs and cleaned of path separators

## License

ISC
