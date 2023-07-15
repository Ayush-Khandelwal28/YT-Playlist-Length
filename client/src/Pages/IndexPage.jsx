import React, { useState } from "react";

function IndexPage() {
    const [playlist, setPlaylist] = useState("");
    const [playlistData, setPlaylistData] = useState(null);

    function isValid(link) {
        const playlistLinkRegex =
            /^https?:\/\/(www\.)?youtube\.com\/playlist\?list=[a-zA-Z0-9_-]+$/;
        return playlistLinkRegex.test(link);
    }

    function formatDuration(durationInSeconds) {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = (durationInSeconds % 60).toFixed(0);
      
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
      

    async function submit(ev) {
        ev.preventDefault();
        if (isValid(playlist)) {
            try {
                const response = await fetch("http://localhost:4000/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ playlist: playlist }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setPlaylistData(data);
                } else {
                    console.error("Failed to submit playlist");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            alert("Invalid Link");
        }
    }

    return (
        <div className="index">
            <form onSubmit={submit}>
                <p>Paste the link of the Playlist in the box</p>
                <input
                    type="text"
                    placeholder="YT Playlist Link"
                    value={playlist}
                    onChange={(ev) => {
                        setPlaylist(ev.target.value);
                    }}
                />
                <button type="submit">Submit</button>
            </form>
            {playlistData && (
                <div className="result">
                    <p>No of videos: {playlistData.count}</p>
                    <p>Total length of playlist: {formatDuration(playlistData.totalDuration)}</p>
                    <p>Average length of video: {formatDuration((playlistData.totalDuration) / playlistData.count)}</p>
                    <p>At 0.25x: {formatDuration((playlistData.totalDuration) / 0.25)}</p>
                    <p>At 0.50x: {formatDuration((playlistData.totalDuration) / 0.5)}</p>
                    <p>At 0.75x: {formatDuration((playlistData.totalDuration) / 0.75)}</p>
                    <p>At 1.25x: {formatDuration((playlistData.totalDuration) / 1.25)}</p>
                    <p>At 1.50x: {formatDuration((playlistData.totalDuration) / 1.5)}</p>
                    <p>At 1.75x: {formatDuration((playlistData.totalDuration) / 1.75)}</p>
                    <p>At 2.00x: {formatDuration((playlistData.totalDuration) / 2)}</p>
                </div>
            )}
        </div>
    );
}
export default IndexPage;
