const PythonShell = require('python-shell');
const pySent = new PythonShell('lib/sent.py', {mode: 'json'});
const sentiment = require('sentiment');
const Promise = require('bluebird');
const rp = require('request-promise');

module.exports = {
  pSentNode: (text) => {
    const promise = new Promise((resolve, reject) => {
      sentiment(text, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
    return promise;
  },
  fast: (tweets) => {
    const pTweets = tweets.map(pSentNode);
    Promise.all(pTweets).then(data => {
      const scores = [];
      for (var i = 0; i < data.length; i++) {
        scores.push({text: tweets[i], score: data[i].score});
      }
    });
  },
  slow: (tweets, callback) => {
    const results = [];
    const options = {
      method: 'POST',
      uri: 'http://127.0.0.1:5000',
      body: tweets,
      json: true
    }

    rp(options).then(response => {
      for (var i = 0; i < response.length; i++) {
        results[i] = {tweet: tweets[i], score: response[i]}
      }
      callback(results);
    }).catch(err => {
      console.log(err);
    });
  }
}
