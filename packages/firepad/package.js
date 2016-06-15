Package.describe({
  version: "1.0.0",
  name: "jeremywrnr:firepad",
  summary: "Interfacing for using firepad.",
});


Package.onUse(function(api) {
  api.export("Firepad");
  api.versionsFrom("METEOR@1.3");
  api.addFiles(["difflib.js", "firepad.js"]);
});


Package.onTest(function (api) {
  api.use(["tinytest", "jeremywrnr:firepad"]);
  api.addFiles("firepad-tests.js");
});

