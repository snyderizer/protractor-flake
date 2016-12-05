'use strict';

var JOB_NAME = 'Flake';

exports.config = {
  specs: [
    '../passing-test.js',
    '../failing-test.js'
  ],

  capabilities: {
    browserName: process.platform === 'darwin' ? 'chrome' : 'firefox',
    name: JOB_NAME,
    shardTestFiles: true,
    maxInstances: 2
  },

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  baseUrl: 'http://localhost:3000/',

  directConnect: true,

  framework: 'jasmine',

  allScriptsTimeout: 10000,

  getPageTimeout: 3000,

  jasmineNodeOpts: {
    defaultTimeoutInterval: 5000
  },

  onPrepare: function () {
    // let protractor know it doesn't need to look for angular on the page
    browser.ignoreSynchronization = true;
  }
};

