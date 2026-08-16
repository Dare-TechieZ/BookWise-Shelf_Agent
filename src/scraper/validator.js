export function validateRecord(record) {
  return Boolean(record?.title && Number.isFinite(Number(record.price)) &&
    Number(record.rating) >= 0 && Number(record.rating) <= 5 && record.url);
}
export function validateRecords(records) {
  return records.filter(validateRecord);
}
