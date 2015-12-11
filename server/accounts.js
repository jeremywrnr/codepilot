// setting up a new account with github api

Accounts.onCreateUser(function(options, user){

  var accessToken = user.services.github.accessToken, result, profile;
  var result = Meteor.http.get('https://api.github.com/user', {
    headers: { 'User-Agent': 'Code Pilot' },
    params: { access_token: accessToken }
  });
  if (result.error) throw result.error;
  profile = _.pick(
    result.data, 'login', 'name', 'avatar_url', 'url', 'email', 'html_url');
  user.profile = profile

  // use default address if none publicly available
  if(!user.profile.email)
    user.profile.email = user.profile.login + '@users.noreply.github.com';

  // use login as name if none publicly available
  if(!user.profile.name)
    user.profile.name = user.profile.login;

  // set default target repo
  user.profile.repoOwner = profile.login
  user.profile.repoBranch = 'master'
  user.profile.repoName = 'select a repo from the menu below!'
  user.profile.repo = 'choose a repo to get a project id!'
  user.profile.role = 'copilot'
  return user;

})
