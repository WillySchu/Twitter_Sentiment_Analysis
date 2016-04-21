const PythonShell = require('python-shell');
const pySent = new PythonShell('lib/sent.py', {mode: 'json'});
const sentiment = require('sentiment');
const Promise = require('bluebird');

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
    pySent.send(tweets);
    pySent.on('message', (message) => {
      for (var i = 0; i < tweets.length; i++) {
        results[i] = {tweet: tweets[i], score: message[i]};
      }
    });
    pySent.end((err) => {
      if (err) throw err;
      console.log('finished');
      callback(results);
    });
  }
}
