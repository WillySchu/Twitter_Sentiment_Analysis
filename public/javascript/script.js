'use strict'
var dataset;

const body = d3.select('body');
const p = body.append('p');

d3.json('twitter.json', (json) => {
  console.log(json);
})
