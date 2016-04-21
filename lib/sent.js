const PythonShell = require('python-shell');
const test = new PythonShell('python-sa.py', {mode: 'json'});
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
    }
  },
  slow: (tweets) => {
    test.send(tweets);
    test.on('message', (message) => {
      for (var i = 0; i < tweets.length; i++) {
        results[i] = {tweet: tweets[i], score: message[i]};
      }
      console.log(results);
    });
    test.end((err) => {
      if (err) throw err;
      console.log('finished');
      res.render('index', {results});
    });
  }
}
