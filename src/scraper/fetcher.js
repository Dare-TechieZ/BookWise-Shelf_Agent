export async function fetchPage(url) {
  const response = await fetch(url, { headers: { "User-Agent": "AutonomousResearchAgent/3.0" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}
