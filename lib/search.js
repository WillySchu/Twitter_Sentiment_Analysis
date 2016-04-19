const Twitter = require('twitter');

require('dotenv').load();

function error(err, response, body) {
  console.log(err);
}

function success(err, tweets, response) {
  // console.log(err);
  console.log(tweets);
  // console.log(response);
}

const config = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
}

module.exports = (text, callback) => {
  console.log(config);
  const twit = new Twitter(config);

  twit.get('search/tweets', {q: text}, success);
}
