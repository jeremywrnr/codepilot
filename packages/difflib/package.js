Package.describe({
  version: "1.0.0",
  name: "jeremywrnr:difflib",
  summary: "Difference generator for file contents.",
  git: "https://github.com/jeremywrnr/git-sync",
});


Package.onUse(function(api) {
  api.export("Difflib");

  api.versionsFrom("METEOR@1.3");
  api.addFiles(["difflib.js"]);
});


Package.onTest(function (api) {
  api.use(["tinytest", "jeremywrnr:difflib"]);
  api.addFiles("difflib-tests.js");
});

