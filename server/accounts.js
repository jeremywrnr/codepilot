// setting up a new account with github api

Accounts.onCreateUser((options, user) => {
  const accessToken = user.services.github.accessToken;
  var result;
  let profile;
  var result = Meteor.http.get('https://api.github.com/user', {
    headers: { 'User-Agent': 'GitSync' },
    params: { access_token: accessToken }
  });

  if (result.error) throw result.error;
  profile = _.pick(
    result.data, 'login', 'name', 'avatar_url', 'url', 'email', 'html_url');
  user.profile = profile

  // use default address if none publicly available
  if(!user.profile.email)
    user.profile.email = `${user.profile.login}@users.noreply.github.com`;

  // use login as name if none publicly available
  if(!user.profile.name)
    user.profile.name = user.profile.login;

  // set default target repo
  user.profile.repoBranch = 'master'
  user.profile.repoName = 'Click here to select your repo!'
  user.profile.repoOwner = ''
  user.profile.role = 'pilot'
  user.profile.repo = ''
  return user;
});

