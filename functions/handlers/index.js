'use strict';

const request = require('request');

require('dotenv').load();

/**
 * Utility function for making request.
 * @param {String} reqUrl request url
 * @param {Object} res response
 */
function handleRequest(reqUrl, res) {
  const options = {
    url: reqUrl,
    headers: {
      'User-Agent': 'Portfolio-App'
    }
  };
  request(options, (error, response, body) => {
    /*
    console.log('error', error);
    console.log('response', response);
    console.log('body', body);
    */
    if (error) {
      res.status(error.statusCode).json(error);
    }
    if (body) {
      res.status(response.statusCode).json(JSON.parse(body));
    }
  });
}

/**
 * Github API base url.
 */
const githubApiBaseUrl = 'https://api.github.com';

/**
 * Github API access token.
 */
const githubApiAccessToken = process.env.GITHUB_ACCESS_TOKEN;

/**
 * Github API endpoints.
 */
const githubApiEndpoints = {
  user: (username) => `${githubApiBaseUrl}/users/${username}?access_token=${githubApiAccessToken}`,
  repos: (username) => `${githubApiBaseUrl}/users/${username}/repos?access_token=${githubApiAccessToken}`,
  languages: (username, reponame) => `${githubApiBaseUrl}/repos/${username}/${reponame}/languages?access_token=${githubApiAccessToken}`
};

/**
 * Server http handlers module.
 * For usage in express server and in cloud functions.
 */
module.exports = {

  /**
   * Github urls config object.
   */
  github: {
    apiBaseUrl: githubApiBaseUrl,
    apiAccessToken: githubApiAccessToken,
    apiEndpoints: githubApiEndpoints
  },

  githubAccessToken: (req, res) => {
    const token = process.env.GITHUB_ACCESS_TOKEN;
    res.json({ token });
  },

  /**
   * Handles github user details request.
   */
  githubUser: (req, res) => {
    const username = req.query.username || '';
    if (username) {
      const reqUrl = githubApiEndpoints.user(username);
      handleRequest(reqUrl, res);
    } else {
      res.status(400).json({error: 'Missing mandatory request parameters: username'});
    }
  },

  /**
   * Handles github user repos request.
   */
  githubUserRepos: (req, res) => {
    const username = req.query.username || '';
    if (username) {
      const reqUrl = githubApiEndpoints.repos(username);
      handleRequest(reqUrl, res);
    } else {
      res.status(400).json({error: 'Missing mandatory request parameters: username'});
    }
  },

  /**
   * Handles github repos languages request.
   */
  githubUserReposLanguages: (req, res) => {
    const username = req.query.username || '';
    const reponame = req.query.reponame || '';
    if (username && reponame) {
      const reqUrl = githubApiEndpoints.languages(username, reponame);
      handleRequest(reqUrl, res);
    } else {
      let missing = [];
      if (!username) {
        missing.push('username');
      }
      if (!reponame) {
        missing.push('reponame');
      }
      res.status(400).json({error: 'Missing mandatory request parameters: ' + missing.join(', ')});
    }
  }

};
