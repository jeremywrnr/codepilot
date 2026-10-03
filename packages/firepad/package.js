Package.describe({
  version: "1.0.0",
  name: "jeremywrnr:firepad",
  summary: "Interface for using firepad easily.",
  git: "https://github.com/jeremywrnr/git-sync",
});


Package.onUse(function(api) {
  api.export("FirepadAPI", "client");
  api.versionsFrom("3.0");
  api.use(["ecmascript", "mongo", "jeremywrnr:git-sync"]);
  api.addFiles(["firepad.js"], "client");
});


Package.onTest(function (api) {
  api.use(["tinytest", "ecmascript", "jeremywrnr:firepad"]);
  api.addFiles("firepad-tests.js");
});

