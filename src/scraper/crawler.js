export function buildCatalogueUrl(baseUrl, page) {
  return page === 1 ? baseUrl : `${baseUrl}catalogue/page-${page}.html`;
}
