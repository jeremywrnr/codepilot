Package.describe({
  version: "1.0.2",
  name: "jeremywrnr:git-sync",
  summary: "Real-time pair programming toolset.",
  git: "https://github.com/jeremywrnr/git-sync",
});


Package.onUse(function(api) {
  api.export("GitSync");

  api.versionsFrom("METEOR@1.3");
  api.addFiles(["git-sync.js"]);
});


Package.onTest(function (api) {
  api.use(["tinytest", "ecmascript", "jeremywrnr:git-sync"]);
  api.addFiles("git-sync-tests.js");
});

