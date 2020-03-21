'use strict';

const handlers = require('../../functions/handlers/index');

/**
 * Server Routes module
 * @module server/routes/index
 * @param {object} app Express application
 */
module.exports = app => {
  app.get('/api/githubAccessToken', handlers.githubAccessToken);

  /**
   * Github user.
   */
  app.get('/api/githubUser', handlers.githubUser);

  /**
   * Github user repos.
   */
  app.get('/api/githubUserRepos', handlers.githubUserRepos);

  /**
   * Github user repo languages.
   */
  app.get('/api/githubUserReposLanguages', handlers.githubUserReposLanguages);
};
