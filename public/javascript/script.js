'use strict'

const bubbleChart = () => {
  const width = 1000;
  const height = 700;
  const tooltip = floatingTooltip('gates_tooltip', 240);

  const center = { x: width/2, y: height/2 };

  const yearCenters = {
    2006: { x: 300, y: height/2 } ,
    2007: { x: 400, y: height/2 },
    2008: { x: 500, y: height/2 },
    2009: { x: 600, y: height/2 },
    2010: { x: 700, y: height/2 }
  };

  const yearsTitleX = {
    2006: width/7,
    2007: width/3,
    2008: width/2,
    2009: width/1.5,
    2010: width/1.2
  }

  const damper = 0.102;

  let svg = null;
  let bubbles = null;
  let nodes = [];

  const charge = (d) => {
    return -Math.pow(d.radius, 2.0)/9
  }

  const force = d3.layout.force()
  .size([width, height])
  .charge(charge)
  .gravity(-0.001)
  .friction(0.9);

  const fillColor = d3.scale.ordinal()
    .domain(['low', 'low2', 'medium', 'med2', 'high'])
    .range(['#FFEDBC', '#EC7263', '#A75265', '#D9213B','#FEBE7E']);

  const radiusScale = d3.scale.pow()
    .exponent(0.6)
    .range([2, 90]);

  const fetchData = (callback) => {
    // $.get('sdfsdf', data => {
    callback(createNodes());
    // })
  }
  const createNodes = (rawData) => {
    const myNodes = [];
    var org = ['low', 'low2', 'medium', 'med2', 'high'];
    for (var i = 0; i < 150; i++) {
      var myValue = (Math.random() * 10000000) + 1000000;
      var myYear = Math.floor(Math.random() * 5) + 2006;
      myNodes.push({
        id: i,
        radius: radiusScale(+myValue),
        value: myValue,
        year: myYear,
        group: org[Math.floor(Math.random() * org.length)],
        x: Math.random() * 900,
        y: Math.random() * 900
      });
    }
    // const myNodes = rawData.map((d) => {
    //   return {
    //     id: d.id,
    //     radius: radiusScale(+d.total_amount),
    //     value: d.total_amount,
    //     name: d.grant_title,
    //     org: d.organization,
    //     group: d.group,
    //     year: d.start_year,
    //     x: Math.random() * 900,
    //     y: Math.random() * 800
    //  };
  //  });
   myNodes.sort((a, b) => { return b.value - a.value })
   return myNodes;
  }

  const margin = {top: 20, right: 20, bottom: 30, left: 40};

  const x = d3.scale.linear()
    .range([0, width]);

  const xMap = (d) => { return x(d.value) }

  const y = d3.scale.linear()
    .range([height, 0]);

  const yMap = (d) => { return y(d.id) }

  const xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

  const yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

  const chart = (selector, rawData) => {
    const maxAmount = d3.max(rawData, (d) => { return +d.total_amount; });
    radiusScale.domain([0, maxAmount]);
    fetchData(function() {
      nodes = createNodes(rawData);
      force.nodes(nodes);

      svg = d3.select(selector)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      bubbles = svg.selectAll('.bubble')
        .data(nodes, (d) => { return d.id });

        x.domain(d3.extent(nodes.map(node => { return node.value }))).nice();
        y.domain(d3.extent(nodes.map(node => { return node.id }))).nice();

      bubbles.enter().append('circle')
        .classed('bubble', true)
        .attr('r', 0)
        .attr('fill', (d) => { return fillColor(d.group); })
        .attr('stroke', (d) => { return d3.rgb(fillColor(d.group)).darker(); })
        .attr('stroke-width', 0.3)
        .on('mouseover', showDetail)
        .on('mouseout', hideDetail);

       bubbles.transition()
        .duration(2000)
        .attr('r', (d) => { return d.radius; });

      groupBubbles();
    });
  };

  const groupBubbles = () => {
    hideYears();
    hideAxes();

    force.on('tick', (e) => {
      bubbles.each(moveToCenter(e.alpha))
        .attr('cx', (d) => { return d.x })
        .attr('cy', (d) => { return d.y });
    });

    force.start();
  }

  const moveToCenter = (alpha) => {
    return (d) => {
      d.x = d.x + (center.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (center.y - d.y) * damper * alpha * 1.1;
    }
  };

  const splitBubbles = () => {
    showYears();
    hideAxes();
    force.on('tick', (e) => {
      bubbles.each(moveToYears(e.alpha))
        .attr('cx', (d) => { return d.x; })
        .attr('cy', (d) => { return d.y; });
    });
    force.start();
  }

  const moveToYears = (alpha) => {
    return (d) => {
      const target = yearCenters[d.year];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  const scatterPlot = () => {
    hideYears();
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height +')')
      .call(xAxis)
      .attr('x', width)
      .attr('y', -6);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    force.on('tick', (e) => {
      bubbles.each(moveToAxes(e.alpha))
      .attr('cx', (d) => { console.log(d.x); return d.x; })
      .attr('cy', (d) => { console.log(d.y); return d.y; });

      // .attr('cx', (d) => { console.log(x(d.value)); return x(d.value) })
      // .attr('cy', (d) => { console.log(y(d.id)); return y(d.id) })
    });
    force.start();
  }

  const moveToAxes = (alpha) => {
    // x(d.value)
    // y(d.id)
    return (d) => {
      d.x = d.x + (x(d.value) - d.x) * damper * alpha * 1.1;
      d.y = d.y + (y(d.id) - d.y) * damper * alpha * 1.1;
    };
  }

  const hideYears = () => {
    svg.selectAll('.year').remove();
  }

  const hideAxes = () => {
    svg.selectAll('g').remove();
  }

  const showYears = () => {
    const yearsData = d3.keys(yearsTitleX);
    const years = svg.selectAll('.year')
      .data(yearsData);

      years.enter().append('text')
        .attr('class', 'year')
        .attr('x', (d) => { return yearsTitleX[d]; })
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text((d) => { return d; });
  }

  const showDetail = (d) => {
    // d3.select(this).attr('stroke', 'black');

    const content = '<span class="name">Title: </span><span class="value">' +
                  d.name +
                  '</span><br/>' +
                  '<span class="name">Amount: </span><span class="value">$' +
                  addCommas(d.value) +
                  '</span><br/>' +
                  '<span class="name">Year: </span><span class="value">' +
                  d.year +
                  '</span>';
    tooltip.showTooltip(content, d3.event);
  }

  const hideDetail = (d) => {
    // d3.select(this)
    //   .attr('stroke', d3.rgb(fillColor(d.group)).darker());

    tooltip.hideTooltip();
  }

  chart.toggleDisplay = (displayName) => {
    if (displayName === 'year') {
      splitBubbles();
    } else if (displayName === 'scatter') {
      scatterPlot();
    } else {
      groupBubbles();
    }
  };
  return chart;
}

const myBubbleChart = bubbleChart();

const display = (error, data) => {
  if (error) {
    console.log(error);
  }

  myBubbleChart('#vis', data);
}

const setupButtons = () => {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      d3.selectAll('.button').classed('active', false);
      const button = d3.select(this);

      button.classed('active', true);

      const buttonId = button.attr('id');

      myBubbleChart.toggleDisplay(buttonId);
    });
}

const addCommas = (nStr) => {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

d3.csv('data/gates_money.csv', display);

setupButtons();
