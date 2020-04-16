

var mapContainer = $('.map');

d3.xml("/queensbound/assets/subwaymap.svg", function(error, subwayMap) {
  if (error) throw error;
  $('.map').append(subwayMap.documentElement);

  // const width = 975;
  // const height = 610;
  //
  // const svg = d3.select("svg");
  // const g = svg.select("g");
  // const elements = g.selectAll(".subwayline")
  //   .each(function() {
  //     d3.select(this).datum({})
  //   })
  //   .on("click", clicked);
  //
  // function clicked(d) {
  //   d.clicked = !d.clicked;
  //   const bounds = this.getBBox();
  //   console.log(this, bounds);
  //   const x0 = bounds.x;
  //   const x1 = bounds.x + bounds.width;
  //   const y0 = bounds.y;
  //   const y1 = bounds.y + bounds.height;
  //   g.transition().duration(1000).attr("transform", d.clicked ? "translate(" + (width / 2) + "," + (height / 2) + ") scale(" + (1 / Math.max((x1 - x0) / width, (y1 - y0) / height)) + ") translate(" + (-(x0 + x1) / 2) + "," + (-(y0 + y1) / 2) + ")" : "transform(0,0) scale(1)");
  // }
});
