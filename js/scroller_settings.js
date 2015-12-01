// function to move a selection to the front/top, from https://gist.github.com/trtg/3922684
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};
var settings = {
  // could be used to save settings for styling things.
};
var dataMap; // make this global
var dataRate;
var vis = d3.select("#vis");
function focus_country(country) {
    d3.selectAll("path").classed("focused", false);
    if (country) {
        var line = d3.select("." + country);
        line.classed("focused", true);
        line.moveToFront();
    }
}
var update = function(value) {
  var country = null;
  var localdata = dataMap;
  var localdataRate=dataRate;
  var show_vis = true;
  switch(value) {
    case 0:
      console.log("in case", value);
      show_vis = false;
      break;
    case 1:
      console.log("in case", value);
      localdata = dataMap;
      break;
    case 2:
      console.log("in case", value);
      localdata = dataMap;
      country = "HTI";
      break;
    case 3:
      console.log("in case", value);
      //yScale = d3.scale.sqrt().range([margin.top, height - margin.bottom]);
      localdata = dataMap;
      country = "RWA";
      break;
    default:
      country = null;
      show_vis = true;
      focus_country(country);
      draw_map(localdata,localdataRate);
      break;
  }
  console.log("show viz", show_vis);
  if (show_vis) {
    vis.style("display", "inline-block");
  } else {
    vis.style("display", "none");
  }
  draw_map(localdata,localdataRate); // we can update the data if we want in the cases. Draw before focus!
  focus_country(country); // this applies a highlight on a country.
};
// setup scroll functionality
function display(error, world,stunting) {
  if (error) {
    console.log(error);
  } else {
    console.log("load data successfully");
    var vis = d3.select("#vis");
      dataMap = world; // assign to global; call func in line_chart_refactor.js
      dataRate=stunting;
    //console.log("after makedata", dataMap);
    var scroll = scroller()
      .container(d3.select('#graphic'));
    // pass in .step selection as the steps
    scroll(d3.selectAll('.step'));
    // Pass the update function to the scroll object
    scroll.update(update);
    // This code hides the vis when you get past it.
    // You need to check what scroll value is a good cutoff.
    var oldScroll = 0;
    $(window).scroll(function (event) {
      var scroll = $(window).scrollTop();
      console.log("scroll", scroll);
      if (scroll >= 2000 && scroll > oldScroll) {
          vis.style("display", "none");
       } else if (scroll >= 2000 && scroll < oldScroll) {
        vis.style("display", "inline-block"); // going backwards, turn it on.
       }
      oldScroll = scroll;
    });

  }
} // end display
function typeAndSet(d) {
    d.Y1990=+d.Y1990;d.Y1991=+d.Y1991;d.Y1992=+d.Y1992;d.Y1993=+d.Y1993;d.Y1994=+d.Y1994;d.Y1995=+d.Y1995;d.Y1996=+d.Y1996;d.Y1997=+d.Y1997;d.Y1998=+d.Y1998;d.Y1999=+d.Y1999;
    d.Y2000=+d.Y2000;d.Y2001=+d.Y2001;d.Y2002=+d.Y2002;d.Y2003=+d.Y2003;d.Y2004=+d.Y2004;d.Y2005=+d.Y2005;d.Y2006=+d.Y2006;d.Y2007=+d.Y2007;d.Y2008=+d.Y2008;d.Y2009=+d.Y2009;
    d.Y2010=+d.Y2010;d.Y2011=+d.Y2011;d.Y2012=+d.Y2012;d.Y2013=+d.Y2013;d.Y2014=+d.Y2014;d.Y2015=+d.Y2015;
    countryById.set(d.ISO, d);
    return d;
}
queue()
    .defer(d3.json, "countries.json")
    .defer(d3.csv, "NeonatalRate.csv", typeAndSet)
    .await(display);

