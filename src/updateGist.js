import "dotenv/config";

const GITHUB_GIST_TOKEN = process.env.GITHUB_GIST_TOKEN;
const GIST_ID = process.env.GIST_ID;

export const updateGist = async (currentData) => {
  console.log("GIST_ID:", GIST_ID, "GITHUB_GIST_TOKEN:", GITHUB_GIST_TOKEN);
  const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: "PATCH",
    headers: {
      Authorization: `token ${GITHUB_GIST_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: {
        "projectsData.json": {
          content: JSON.stringify({lastUpdate: new Date, currentData}),
        },
      },
    }),
  });

  const result = await response.json();
  if (response.ok) {
    console.log("✅ Gist updated successfully:", result.html_url);
  } else {
    console.error("❌ Error updating Gist:", result);
  }
};