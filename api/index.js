const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json());

function formatDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  let formattedDuration = '';

  if (hours > 0) {
    formattedDuration += `${hours}h `;
  }

  if (minutes > 0) {
    formattedDuration += `${minutes}m `;
  }

  if (seconds > 0) {
    formattedDuration += `${seconds}s`;
  }

  return formattedDuration.trim();
}

function calculateTotalDuration(durations) {
  let totalDuration = 0;

  for (const duration of durations) {
    const timeComponents = duration.split(' ');

    for (const component of timeComponents) {
      if (component.includes('h')) {
        totalDuration += parseInt(component) * 3600;
      } else if (component.includes('m')) {
        totalDuration += parseInt(component) * 60;
      } else if (component.includes('s')) {
        totalDuration += parseInt(component);
      }
    }
  }

  return totalDuration;
}

function extractPlaylistId(link) {
  const playlistIdRegex = /[?&]list=([a-zA-Z0-9_-]+)/;
  const match = link.match(playlistIdRegex);
  return match && match[1] ? match[1] : null;
}


app.post('/submit', async (req, res) => {
  const { playlist } = req.body;
  const playlistId = extractPlaylistId(playlist);

  if (!playlistId) {
    return res.status(400).json({ error: 'Invalid playlist link' });
  }

  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YT_API_Key
  });

  try {
    const playlistItems = await youtube.playlistItems.list({
      part: 'snippet',
      playlistId,
      maxResults: 50
    });

    const videos = playlistItems.data.items;
    const durations = [];
    let count = 0;

    for (const video of videos) {
      count++;
      const videoId = video.snippet.resourceId.videoId;
      const videoDetails = await youtube.videos.list({
        part: 'contentDetails',
        id: videoId
      });

      const duration = videoDetails.data.items[0].contentDetails.duration;
      const formattedDuration = formatDuration(duration);
      durations.push(formattedDuration);
    }

    const totalDuration = calculateTotalDuration(durations);
    res.json({ totalDuration, count });
  } catch (error) {
    console.error("Error fetching video details:", error);
    res.status(500).json({ error: 'Error fetching video details' });
  }
});



app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
