'use strict'

const bubbleChart = () => {
  const width = 940;
  const height = 600;
  const tooltip = floatingTooltip('gates_tooltip', 240);

  const center = { x: width/2, y: height/2 };

  const yearCenters = {
    2006: { x: 156, y: height/2 } ,
    2007: { x: 312, y: height/2 },
    2008: { x: 468, y: height/2 },
    2009: { x: 624, y: height/2 },
    2010: { x: 780, y: height/2 }
  };

  const yearsTitleX = {
    2006: 156,
    2007: 312,
    2008: 468,
    2009: 628,
    2010: 780
  }

  const damper = 0.102;

  let svg = null;
  let bubbles = null;
  let nodes = [];

  const charge = (d) => {
    return -Math.pow(d.radius, 2.0)/8
  }

  const force = d3.layout.force()
  .size([width, height])
  .charge(charge)
  .gravity(-0.001)
  .friction(0.9);

  const fillColor = d3.scale.ordinal()
    .domain(['low', 'low2', 'medium', 'med2', 'high'])
    .range(['#DFE3E4', '#FA9E5F', '#D9213B', '#75203D','#62A88C']);

  const radiusScale = d3.scale.pow()
    .exponent(0.6)
    .range([2, 80]);

  const fetchData = (callback) => {
    // $.get('sdfsdf', data => {
    callback(createNodes());
    // })
  }
  const createNodes = (rawData) => {
    const myNodes = [];
    var org = ['low', 'low2', 'medium', 'med2', 'high'];
    for (var i = 0; i < 150; i++) {
      var myValue = (Math.random() * 10000000) + 10000000;
      var myYear = Math.floor(Math.random() * 5) + 2006;
      myNodes.push({
        id: i,
        radius: radiusScale(+myValue),
        value: myValue,
        year: myYear,
        group: org[Math.floor(Math.random() * org.length)],
        x: Math.random() * 900,
        y: Math.random() * 800
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

  const chart = (selector, rawData) => {
    const maxAmount = d3.max(rawData, (d) => { return +d.total_amount; });
    radiusScale.domain([0, maxAmount]);
    fetchData(function(nodes) {
      nodes = createNodes(rawData);
      force.nodes(nodes);

      svg = d3.select(selector)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      bubbles = svg.selectAll('.bubble')
        .data(nodes, (d) => { return d.id });

      bubbles.enter().append('circle')
        .classed('bubble', true)
        .attr('r', 0)
        .attr('fill', (d) => { return fillColor(d.group); })
        .attr('stroke', (d) => { return d3.rgb(fillColor(d.group)).darker(); })
        .attr('stroke-width', 1)
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

    force.on('tick', (e) => {
      bubbles.each(moveToCenter(e.alpha))
        .attr('cx', (d) => { return d.x })
        .attr('cy', (d) => { return d.y });
    });

    force.start();
  }

  const moveToCenter = (alpha) => {
    return (d) => {
      d.x = d.x + (center.x - d.x) * damper * alpha;
      d.y = d.y + (center.y - d.y) * damper * alpha;
    }
  };

  const splitBubbles = () => {
    showYears();

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

  const hideYears = () => {
    svg.selectAll('.year').remove();
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
