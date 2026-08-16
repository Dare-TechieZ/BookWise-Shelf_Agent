export function normalizeRecord(record) {
  return {
    title: String(record.title || "").trim(),
    price: Number(record.price || 0),
    rating: Number(record.rating || 0),
    category: String(record.category || "").trim(),
    availability: String(record.availability || "").trim(),
    url: String(record.url || "").trim()
  };
}
export function normalizeRecords(records) {
  return records.map(normalizeRecord);
}
