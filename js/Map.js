var mapWidth = 930,
    mapHeight = 500,
    center = [mapWidth / 2, mapHeight / 2],
    defaultFill = "#e0e0e0";//between gray and white
var mapColor = d3.scale.linear().range(["#deebf7", "#3182bd"]).interpolate(d3.interpolateLab);
var countryById = d3.map();
var projection = d3.geo.mercator()
    .scale(200)
    .translate([mapWidth / 2, mapHeight / 2]);
var path = d3.geo.path()
    .projection(projection);
var svg = d3.select("#vis").append("svg")
    .attr("width", mapWidth)
    .attr("height", mapHeight)
    .append("g");
var g = svg.append("g");
var flexible="2015";
function draw_map(world, stunting) {
    mapColor.domain([0,73.1]);
    g.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.units).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class",function(d){return d.id;})
        .on("mouseover", showCountryLine)
        .on("mouseout", showCountryLineout)
        .attr("fill",function(d) {
            return mapColor(getColor(d,flexible));
        });
    d3.selectAll("input").on("change", function change() {
        flexible =this.value;
        updateMap(world, stunting,flexible);
    });
    // inside so we can use data from the parent function
    function showCountryLine(d) {
        d3.select(".col-md-6")
            .style("display", null)
            .style("top", (d3.event.pageY - 5) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
        var id = d.id;
        update_lines(id, dataset);
        d3.selectAll("path.countries").style("stroke", "white");
        d3.select(this).style("stroke", "gray");
        d3.select(this).moveToFront();
    }
    function showCountryLineout(){
        d3.select(".col-md-6")
            .style("display", "none");
    }

}
function updateMap(world, stunting,flexible){
    d3.selectAll("path")
        .attr("fill",function(d) {
            return mapColor(getColor(d,flexible));
        });
}
// Line Chart globals
var lineWidth = 350;
var lineHeight = 150;
var margin = {top: 10, right: 10, bottom: 30, left: 50};
//Set up date formatting and years
var dateFormat = d3.time.format("%Y");
// My shortcut for the scale is to list the first and last only - will set the extents.
// Also, I set the earlier year to 1999 to get a little spacing on the X axis.
//Set up scales - I already know the start and end years, not using data for it.
var xScale = d3.time.scale()
    .range([ margin.left, lineWidth - margin.right]);
// don't know the yScale domain yet. Will set it with the data.
var yScale = d3.scale.linear()
    .range([ margin.top, lineHeight - margin.bottom ]);
//Configure axis generators
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(26)
    .tickFormat(function(d) {
        return dateFormat(d);
    })
    .innerTickSize([0])
    .outerTickSize([0]);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .innerTickSize([0])
    .outerTickSize([0]);
//Configure line generator
// each line dataset must have an x and y for this to work.
var line = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) {
        return xScale(dateFormat.parse(d.year));
    })
    .y(function(d) {
        return yScale(+d.amount);
    });

//Create the empty SVG image
var linechart = d3.select(".subvis")
    .append("svg")
    .attr("width", lineWidth)
    .attr("height", lineHeight);
function draw_lines(country, data) {
    console.log("haha",data);
    var linedata=data.filter(function(d) { return d.ISO ==country;});
    console.log("hahahahha",linedata);
    xScale.domain(
        d3.extent(years, function(d) {
            return dateFormat.parse(d);
        }));
    yScale.domain([
        d3.max(linedata, function(d) {
            return d3.max(d.Deaths, function(d) {
                return +d.amount;
            });
        }),
        0]);
    linechart.selectAll("path")
        .data(linedata)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("d", function(c) {
            return line(c.Deaths);
        });
    //Axes
    linechart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (lineHeight - margin.bottom) + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-65)"
        });
    linechart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis);
    d3.select(".col-md-6")
        .style("display", "none")
        .style("top", "325px")
        .style("left", "316px");
    update_lines(country, dataset); // this is for the transitions if any, and headings

} // end draw_lines
function update_lines(country, data) {
    var linedata=data.filter(function(d) { return d.ISO ==country;});
    yScale.domain([
        d3.max(linedata, function(d) {
            return d3.max(d.Deaths, function(d) {
                return +d.amount;
            });
        }),
        0]);
    var lines = linechart.select("path.line").data(linedata);
    lines
        .transition()
        .attr("d", function(c) {
            return line(c.Deaths);
        });
    d3.select(".y.axis").transition().call(yAxis);
    if (data.length> 0) {
        d3.select(".subhead").html("Child Mortality Rate for " + countryById.get(country).Country);
    } else if (!data.length) {
        d3.select(".subhead").html("No data for this country.");
    }
    if (countryForHighlight==="HTI"){

    }
    else if(countryForHighlight==="RWA"){

    }
}
function getColor(d,flexible) {
    var dataRow = countryById.get(d.id);
    if (dataRow) {
        return dataRow[flexible];
    } else {
        return 0;
    }
}
