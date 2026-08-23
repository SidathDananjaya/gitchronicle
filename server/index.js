require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini with your server-side key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: Fetch commits (same as before)
async function fetchRepoCommits(owner, repo, token) {
  let page = 1;
  let allCommits = [];
  while (page <= 5) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&page=${page}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });
      if (response.data.length === 0) break;
      allCommits = [...allCommits, ...response.data];
      page++;
    } catch {
      break;
    }
  }
  return allCommits;
}

// MAIN ENDPOINT
app.post("/api/analyze", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  try {
    console.log(`🔍 Fetching data for ${username}...`);

    // 1. Fetch repositories
    const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
    const reposResponse = await axios.get(reposUrl, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
    });
    const repos = reposResponse.data;

    // 2. Process languages and commits
    const languageCount = {};
    let totalCommits = 0;
    let commitMessages = [];
    let commitDates = [];

    for (const repo of repos) {
      if (repo.fork) continue;
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
      try {
        const commits = await fetchRepoCommits(
          username,
          repo.name,
          process.env.GITHUB_TOKEN,
        );
        commits.forEach((c) => {
          if (
            c.commit &&
            c.commit.message &&
            !c.commit.message.startsWith("Merge")
          ) {
            commitMessages.push(c.commit.message);
            commitDates.push(c.commit.author?.date || "");
            totalCommits++;
          }
        });
      } catch {
        /* skip empty repos */
      }
    }

    const topLanguage = Object.keys(languageCount).reduce(
      (a, b) => (languageCount[a] > languageCount[b] ? a : b),
      "N/A",
    );
    const uniqueDays = new Set(commitDates.map((d) => d.split("T")[0])).size;
    const avgCommitsPerDay =
      uniqueDays > 0 ? (totalCommits / uniqueDays).toFixed(1) : 0;

    // 3. 🧠 Generate Narrative using FREE Gemini (No OpenAI!)
    console.log("🤖 Asking Google Gemini to write a narrative...");
    const sampleMessages = commitMessages.slice(0, 30).join("\n- ");
    const aiPrompt = `
        You are a space-mission log writer. 
        Based on these commit messages from a developer named "${username}":
        - ${sampleMessages}
        
        Write a short, exciting, futuristic 3-sentence narrative summarizing their coding journey. 
        Mention their top language (${topLanguage}) and total commits (${totalCommits}). 
        Make it sound like they are piloting a starship through the "Git Galaxy".
        Return ONLY the narrative, no extra text.
        `;

    let narrative =
      "This explorer is charting the unknown corners of the code universe.";
    try {
      // Use the Gemini 2.0 Flash model (fast and free)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(aiPrompt);
      const response = await result.response;
      narrative = response.text().trim();
    } catch (aiError) {
      console.log("AI skipped, using fallback narrative.", aiError.message);
    }

    // 4. Send response
    res.json({
      username,
      totalRepos: repos.length,
      totalCommits,
      topLanguage,
      avgCommitsPerDay,
      narrative,
      languageData: Object.entries(languageCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value })),
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res
      .status(500)
      .json({
        error: "Failed to fetch GitHub data. Check username or rate limits.",
      });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`),
);
