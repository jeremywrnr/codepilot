// setting up a new account with github api

import { githubFor } from "/imports/server/github";

Accounts.onCreateUser(async (options, user) => {
  const data = await githubFor(user)("GET /user");
  const { login, name, avatar_url, url, email, html_url } = data;
  user.profile = { login, name, avatar_url, url, email, html_url };

  // use default address if none publicly available
  if(!user.profile.email)
    user.profile.email = `${user.profile.login}@users.noreply.github.com`;

  // use login as name if none publicly available
  if(!user.profile.name)
    user.profile.name = user.profile.login;

  // set default target repo
  user.profile.repoBranch = 'master'
  user.profile.repoName = ' click to select your repo!'
  user.profile.repoOwner = ''
  user.profile.role = 'pilot'
  user.profile.repo = ''
  return user;
});
