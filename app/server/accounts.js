// setting up a new account with github api

Accounts.onCreateUser(function(options, user){

  var accessToken = user.services.github.accessToken, result, profile;
  result = Meteor.http.get("https://api.github.com/user", {
    headers: { "User-Agent": "Code Pilot" },
    params: { access_token: accessToken }
  });
  if (result.error) throw result.error;
  profile = _.pick( result.data,
                   "login", "name", "avatar_url", "url", "blog", "email", "html_url");
  user.profile = profile;
  user.profile.role = "copilot"
  user.profile.repo = "testing"
  return user;

})
