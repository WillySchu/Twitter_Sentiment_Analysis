const Twitter = require('twitter');

require('dotenv').load();

const config = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
}

module.exports = (text, num, callback) => {
  const twit = new Twitter(config);

  twit.get('search/tweets', {q: text, count: num}, (error, tweets, response) => {
    const tweetTexts = [];
    for (var i = 0; i < tweets.statuses.length; i++) {
      tweetTexts.push(tweets.statuses[i].text);
    }
    callback(tweetTexts);
  });
}
