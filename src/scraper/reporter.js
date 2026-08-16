export function buildReport({ pages, requested, valid, failed }) {
  return {
    catalogue_pages: pages,
    requested_books: requested,
    valid_records: valid,
    failed_records: failed,
    completed_at: new Date().toISOString()
  };
}
