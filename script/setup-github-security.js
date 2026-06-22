#!/usr/bin/env bun
const { $ } = require("bun");

async function setupGithubSecurity() {
  const token = process.env.GITHUB_PAT;
  if (!token) {
    console.error("Error: GITHUB_PAT environment variable is missing.");
    console.error("Please set it before running this script.");
    console.error("Example: $env:GITHUB_PAT='your-pat'; bun run script/setup-github-security.js");
    process.exit(1);
  }

  // Extract repo name from git origin
  const originUrl = await $`git config --get remote.origin.url`.text();
  let repoPath = "";
  
  if (originUrl.includes("github.com")) {
    // Handle both https://github.com/Owner/Repo.git and git@github.com:Owner/Repo.git
    const match = originUrl.match(/github\.com[:/](.+?)\.git/);
    if (match) repoPath = match[1];
  }

  if (!repoPath) {
    console.error("Error: Could not determine GitHub repository path from origin URL.");
    process.exit(1);
  }

  console.log(`Setting up branch protection for ${repoPath}...`);

  const response = await fetch(`https://api.github.com/repos/${repoPath}/branches/main/protection`, {
    method: "PUT",
    headers: {
      "Accept": "application/vnd.github.v3+json",
      "Authorization": `token ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      required_status_checks: {
        strict: true,
        contexts: ["Analyze (javascript)"]
      },
      enforce_admins: true,
      required_pull_request_reviews: {
        dismiss_stale_reviews: true,
        require_code_owner_reviews: true,
        required_approving_review_count: 1
      },
      restrictions: null
    })
  });

  if (response.ok) {
    console.log("Success! Branch protection rules applied to 'main' branch.");
    console.log("Security scanning (CodeQL) is also configured via GitHub Actions.");
  } else {
    const errorBody = await response.text();
    console.error(`Failed to set branch protection: ${response.status} ${response.statusText}`);
    console.error(errorBody);
    process.exit(1);
  }
}

setupGithubSecurity().catch(console.error);
