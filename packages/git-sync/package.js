Package.describe({
  version: "1.0.0",
  name: "jeremywrnr:git-sync",
  summary: "Real-time pair programming toolset.",
  git: "https://github.com/jeremywrnr/git-sync",
});


Package.onUse(function(api) {
  api.export("GitSync");
  api.export("Difflib");

  api.versionsFrom("METEOR@1.2");
  api.addFiles(["difflib.js", "git-sync.js"]);
});


Package.onTest(function (api) {
  api.use(["tinytest", "jeremywrnr:git-sync"]);
  api.addFiles("git-sync-tests.js");
});

