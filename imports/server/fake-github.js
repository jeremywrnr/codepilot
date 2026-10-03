// in-memory stand-in for the github rest api, used when settings.public.devMode
// is on. it implements only the routes this app calls (see server/github.js),
// as a tiny git object store: blobs, trees, commits, and branch refs.
// state resets when the server restarts.

import { Random } from "meteor/random";

const OWNER = "dev";
const REPO = "demo";

const blobs = {};   // sha -> content
const trees = {};   // sha -> [{ path, mode, type, sha }]
const commits = {}; // sha -> raw commit { message, author, parents, tree }
const refs = {};    // branch name -> commit sha
const issues = [];

const sha = () => Random.hexString(40);

const repoJson = {
  id: 424242,
  name: REPO,
  full_name: `${OWNER}/${REPO}`,
  owner: { login: OWNER },
  private: false,
  default_branch: "main",
  html_url: `https://github.com/${OWNER}/${REPO}`,
  description: "fake repo for local development",
};

const addBlob = content => { const s = sha(); blobs[s] = content; return s; };

const addTree = (entries, base) => {
  const byPath = {};
  (trees[base] || []).forEach(e => { byPath[e.path] = e; });
  entries.forEach(e => {
    byPath[e.path] = {
      path: e.path, mode: e.mode || "100644", type: "blob",
      sha: e.sha || addBlob(e.content || ""),
    };
  });
  const s = sha();
  trees[s] = Object.values(byPath);
  return s;
};

const addCommit = ({ message, author, parents, tree }) => {
  const s = sha();
  commits[s] = { message, author, parents, tree };
  return s;
};

// shape a commit like GET /repos/{owner}/{repo}/commits/{ref}
const commitJson = s => {
  const c = commits[s];
  return {
    sha: s,
    html_url: `https://github.com/${OWNER}/${REPO}/commit/${s}`,
    author: { login: c.author.name },
    parents: c.parents.map(p => ({ sha: p })),
    commit: {
      message: c.message,
      author: c.author,
      committer: c.author,
      tree: { sha: c.tree },
    },
  };
};

const branchJson = name => ({ name, commit: commitJson(refs[name]) });

const history = s => { // commits reachable from s, newest first
  const out = [];
  while (s) { out.push(commitJson(s)); s = commits[s].parents[0]; }
  return out;
};

// seed the repo with the simple website the app expects
refs.main = addCommit({
  message: "initial commit",
  author: { name: OWNER, email: `${OWNER}@example.com`, date: new Date().toISOString() },
  parents: [],
  tree: addTree([
    { path: "site.html", content: "<h1>hello from the fake repo</h1>\n<p>edit me!</p>\n" },
    { path: "site.css", content: "h1 { color: tomato; }\n" },
    { path: "site.js", content: "console.log('hello');\n" },
  ]),
});

const notFound = route => {
  throw new Meteor.Error("github-404", `fake github: no ${route}`);
};

// same signature as the real client: (route, params, { raw })
export const fakeGithub = user => async (route, params = {}, { raw = false } = {}) => {
  const { owner, repo, ...p } = params;
  switch (route) {
    case "GET /user":
      return { login: user.services.github.username || OWNER, name: "Dev User",
        avatar_url: "", url: "", email: `${OWNER}@example.com`, html_url: "" };
    case "GET /user/repos":
      return [repoJson];
    case "GET /repos/{owner}/{repo}":
    case "POST /repos/{owner}/{repo}/forks":
      return repoJson;
    case "GET /repos/{owner}/{repo}/branches":
      return Object.keys(refs).map(name => ({ name, commit: { sha: refs[name] } }));
    case "GET /repos/{owner}/{repo}/branches/{branch}":
      return refs[p.branch] ? branchJson(p.branch) : notFound(route);
    case "GET /repos/{owner}/{repo}/commits":
      return refs[p.sha] ? history(refs[p.sha]) : [];
    case "GET /repos/{owner}/{repo}/commits/{ref}":
      return commits[p.ref] ? commitJson(p.ref) : notFound(route);
    case "GET /repos/{owner}/{repo}/git/trees/{sha}":
      return trees[p.sha] ? { sha: p.sha, tree: trees[p.sha] } : notFound(route);
    case "GET /repos/{owner}/{repo}/git/blobs/{sha}":
      return raw ? blobs[p.sha] : { sha: p.sha, content: blobs[p.sha] };
    case "POST /repos/{owner}/{repo}/git/trees":
      return { sha: addTree(p.tree, p.base_tree) };
    case "POST /repos/{owner}/{repo}/git/commits":
      return { sha: addCommit(p) };
    case "POST /repos/{owner}/{repo}/git/refs":
      refs[p.ref.replace("refs/heads/", "")] = p.sha;
      return { ref: p.ref, object: { sha: p.sha } };
    case "PATCH /repos/{owner}/{repo}/git/refs/{ref}":
      refs[p.ref.replace("heads/", "")] = p.sha;
      return { ref: p.ref, object: { sha: p.sha } };
    case "GET /repos/{owner}/{repo}/issues":
      return issues.filter(i => i.state === "open");
    case "POST /repos/{owner}/{repo}/issues": {
      const issue = { id: issues.length + 1, number: issues.length + 1, state: "open", ...p };
      issues.push(issue);
      return issue;
    }
    case "PATCH /repos/{owner}/{repo}/issues/{issue_number}": {
      const issue = issues.find(i => i.number === p.issue_number);
      if (issue) Object.assign(issue, p);
      return issue;
    }
    default:
      return notFound(route);
  }
};
