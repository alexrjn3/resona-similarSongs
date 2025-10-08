import defaultArtistImage from "../resource/default_artist.jpg";

async function getWikiImage(artistName) {
  try {
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
        artistName
      )}&limit=1&namespace=0&format=json&origin=*`
    );
    const searchData = await searchRes.json();
    const pageTitle = searchData[1][0];

    if (!pageTitle) return defaultArtistImage;

    const summaryRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        pageTitle
      )}`
    );
    const summaryData = await summaryRes.json();

    return summaryData.thumbnail?.source || defaultArtistImage;
  } catch (err) {
    console.error("Wikipedia fetch error:", err);
    return defaultArtistImage;
  }
}

export default getWikiImage;
