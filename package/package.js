Package.describe({
  name: "jeremywrnr:codepilot",
  summary: "Pair programming.",
  version: "1.0.0",
  git: "https://github.com/jeremywrnr/codepilot"
});

Package.onUse(function(api) {
  api.export('MeteorCamera');
  api.versionsFrom("METEOR@1.2");
  api.use("isobuild:cordova@5.2.0");

  api.addFiles('photo.html');
  api.addFiles('photo.js');
  api.addFiles("camera.less", ["web.browser"]);
  api.addFiles('photo-browser.js', ['web.browser']);
  api.addFiles('photo-cordova.js', ['web.cordova']);
});
