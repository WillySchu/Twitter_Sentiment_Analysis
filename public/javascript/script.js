'use strict'
var dataset;

const svg = d3.select('body').append('svg')

d3.json('twitter.json', (json) => {
  console.log(json);
})

d3.body.selectAll('p')
  .data(dataset)
  .enter()
  .p
  .text(function(d) {return d})
