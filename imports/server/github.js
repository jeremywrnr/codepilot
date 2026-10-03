// minimal github rest client, authenticated per user
// a new client is made per call so concurrent users never share a token

import { Meteor } from "meteor/meteor";
import { fakeGithub } from "./fake-github";

const API = "https://api.github.com";

// githubFor(user)("GET /repos/{owner}/{repo}", { owner, repo }) => json
// path {params} are filled from params; GET sends the rest as a query string,
// other methods send them as a json body. pass { raw: true } for raw blobs.
export const githubFor = user => Meteor.settings.public.devMode ? fakeGithub(user) : realGithub(user);

const realGithub = user => async (route, params = {}, { raw = false } = {}) => {
  const [method, template] = route.split(" ");
  const rest = { ...params };
  const path = template.replace(/{(\w+)}/g, (_, key) => {
    const value = rest[key];
    delete rest[key];
    return encodeURIComponent(value).replace(/%2F/g, "/"); // refs keep slashes
  });

  const query = method === "GET" ? `?${new URLSearchParams(rest)}` : "";
  const res = await fetch(`${API}${path}${query}`, {
    method,
    headers: {
      Accept: raw ? "application/vnd.github.raw+json" : "application/vnd.github+json",
      Authorization: `Bearer ${user.services.github.accessToken}`,
      "User-Agent": "CodePilot",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: method === "GET" ? undefined : JSON.stringify(rest),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Meteor.Error(`github-${res.status}`, `${route} failed: ${detail}`);
  }
  return raw ? res.text() : res.json();
};

// a user's github client and their active owner/repo
export const contextFor = user => ({
  user,
  prof: user.profile,
  gh: githubFor(user),
  target: { owner: user.profile.repoOwner, repo: user.profile.repoName },
});

// the same, for the logged in user
export const ghContext = async () => {
  const user = await Meteor.userAsync();
  if (!user) throw new Meteor.Error("not-logged-in");
  return contextFor(user);
};

// a user's files, for their active repo + branch
export const userFiles = prof => Files.find({ repo: prof.repo, branch: prof.repoBranch });
