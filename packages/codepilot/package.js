Package.describe({
  version: "1.0.0",
  name: "jeremywrnr:GitSync",
  summary: "Pair programming toolset.",
  git: "https://github.com/jeremywrnr/GitSync",
});


Package.onUse(function(api) {
  api.export("GitSync");
  api.export("Difflib");

  api.versionsFrom("METEOR@1.2");
  api.addFiles(["difflib.js", "GitSync.js"]);
});


Package.onTest(function (api) {
  api.use(["tinytest", "jeremywrnr:GitSync"]);
  api.addFiles("GitSync-tests.js");
});

