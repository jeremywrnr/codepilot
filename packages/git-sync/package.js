Package.describe({
  version: "1.0.2",
  name: "jeremywrnr:git-sync",
  summary: "Real-time pair programming toolset.",
  git: "https://github.com/jeremywrnr/git-sync",
});


Package.onUse(function(api) {
  api.export("GitSync");

  api.versionsFrom("3.0");
  api.use(["ecmascript", "mongo", "jquery"]);
  api.addFiles(["git-sync.js"]);
});


Package.onTest(function (api) {
  api.use(["tinytest", "ecmascript", "jeremywrnr:git-sync"]);
  api.addFiles("git-sync-tests.js");
});

