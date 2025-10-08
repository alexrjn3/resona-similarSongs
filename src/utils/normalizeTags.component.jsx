const normalizeTag = (tag) => {
  const t = tag.toLowerCase().replace(/[-\s]/g, "");
  if (["hiphop", "rap"].includes(t)) return "rap";
  return tag;
};

export default normalizeTag;
