const API_URL = "http://localhost:8000";

export async function getGithubAnalytics(username: string) {
  const response = await fetch(
    `${API_URL}/github_analytics/${username}`,
    {
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return response.json();
}