Package.describe({
  name: "jeremywrnr:codepilot",
  summary: "Pair programming.",
  version: "1.0.0",
  git: "https://github.com/jeremywrnr/codepilot",
});


Package.onUse(function(api) {
  api.export('Codepilot');
  api.versionsFrom("METEOR@1.2");

  api.addFiles("difflib.js");
  api.addFiles("feedback.js");
  api.addFiles("global.js");
  api.addFiles("methods.js");
  api.addFiles("html2canvas.min.js");
});


Package.onTest(function (api) {
  api.use('jeremywrnr:codepilot');

  api.addFiles('my-mocha-tests.js');
});

