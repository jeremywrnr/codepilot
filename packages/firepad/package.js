Package.describe({
  version: "1.0.0",
  name: "jeremywrnr:firepad",
  summary: "Interface for using firepad easily.",
  git: "https://github.com/jeremywrnr/git-sync",
});


Package.onUse(function(api) {
  api.export("FirepadAPI");
  api.versionsFrom("METEOR@1.3");
  api.addFiles(["firepad.js"]);
});


Package.onTest(function (api) {
  api.use(["tinytest", "jeremywrnr:firepad"]);
  api.addFiles("firepad-tests.js");
});

