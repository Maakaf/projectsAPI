import { Octokit } from "@octokit/rest";
import { readFile } from "fs/promises";
import { updateGist } from "./updateGist.js";
import "dotenv/config";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GIST_URL = process.env.GIST_URL;

const fileData = await readFile("./public/projects.json", "utf8");
const projectData = JSON.parse(fileData);

const getUpdatedData = async () => {
  try {
    const octokit = new Octokit({
      auth: GITHUB_TOKEN,
    });

    async function getLastCommitDate(owner, repo, defaultBranch) {
      try {
        const commits = await octokit.rest.repos.listCommits({
          owner,
          repo,
          sha: defaultBranch,
          per_page: 1, // Only fetch the latest commit
        });

        if (commits.data.length > 0) {
          const lastCommitDate = commits?.data[0]?.commit?.committer?.date;
          return lastCommitDate;
        } else {
          throw new Error("No commits found in the default branch.");
        }
      } catch (error) {
        console.error("Error fetching commit data:", error);
        throw error;
      }
    }

    const repositoriesData = await Promise.all(
      projectData.map(async ({ githubLink, discordLink }) => {
        try {
          const [owner, repo] = githubLink.split("/").slice(-2);
          const { data } = await octokit.repos.get({ owner, repo });

          return {
            name: data.name,
            language: data.language || "N/A",
            html_url: data.html_url,
            description: data.description || "",
            stargazers_count: data.stargazers_count || 0,
            last_commit: await getLastCommitDate(
              owner,
              repo,
              data.default_branch
            ),
            short_description: data.description
              ? data.description.split("\n")[0]
              : "",
            discord_link: discordLink || "",
          };
        } catch (error) {
          console.error("Error fetching repository data:", error);
          return {
            name: "N/A",
            language: "N/A",
            html_url: "N/A",
            description: "N/A",
            stargazers_count: 0,
            last_commit: "N/A",
            short_description: "N/A",
            discord_link: "N/A",
          };
        }
      })
    );

    console.log("Data fetched from GitHub:", repositoriesData);
    return repositoriesData;
  } catch (error) {
    console.error("Error fetching data from GitHub:", error);
  }
};

// Fetch data from GitHub API
export const getGithubData = async () => {
  const {lastUpdate, currentData} = await fetch(GIST_URL).then((response) => response.json());
  if (new Date() - new Date(lastUpdate) > 1000 * 60 * 60 * 24) {
    const updatedData = await getUpdatedData();
    await updateGist(updatedData);
    return updatedData;
  }
  return currentData;
};
