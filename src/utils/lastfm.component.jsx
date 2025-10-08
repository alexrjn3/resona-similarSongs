export async function getTrackInfo(artist, track) {
  const res = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${
      process.env.REACT_APP_LASTFM_API_KEY
    }&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(
      track
    )}&format=json`
  );
  if (!res.ok) throw new Error("Failed to fetch track info");
  return res.json();
}

export async function getArtistInfo(artist) {
  const res = await fetch(
    `${`https://ws.audioscrobbler.com/2.0/`}?method=artist.getInfo&api_key=${
      process.env.REACT_APP_LASTFM_API_KEY
    }&artist=${encodeURIComponent(artist)}&format=json`
  );
  if (!res.ok) throw new Error("Failed to fetch artist info");
  return res.json();
}

export async function getTags(artist, track) {
  try {
    const trackData = await getTrackInfo(artist, track);
    const trackTags = trackData?.track?.toptags?.tag || [];
    const artistData = await getArtistInfo(artist);
    console.log(artistData);
    console.log(trackTags);
    if (trackTags.length > 0) return trackTags;

    return artistData?.artist || [];
  } catch (err) {
    console.error("Error fetching tags:", err);
    return [];
  }
}
