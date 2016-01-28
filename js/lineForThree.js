var indexSeries1=
    [{"x":0,"y":40.8},
        {"x":1,"y":41.2},
        {"x":2,"y":42},
        {"x":3,"y":43.3},
        {"x":4,"y":46},
        {"x":5,"y":46.1},
        {"x":6,"y":45.4},
        {"x":7,"y":45.8},
        {"x":8,"y":45.6},
        {"x":9,"y":44},
        {"x":10,"y":42.3},
        {"x":11,"y":40.3},
        {"x":12,"y":38},
        {"x":13,"y":35.7},
        {"x":14,"y":33.4},
        {"x":15,"y":31.2},
        {"x":16,"y":29.5},
        {"x":17,"y":28},
        {"x":18,"y":26.7},
        {"x":19,"y":25.5},
        {"x":20,"y":24.3},
        {"x":21,"y":22.9},
        {"x":22,"y":21.6},
        {"x":23,"y":20.4},
        {"x":24,"y":19.5},
        {"x":25,"y":18.7}];//RWA
var indexSeries2=[{"x":0,"y":29.1},
    {"x":1,"y":29.3},
    {"x":2,"y":29.7},
    {"x":3,"y":30.2},
    {"x":4,"y":30.8},
    {"x":5,"y":31.5},
    {"x":6,"y":32.1},
    {"x":7,"y":32.7},
    {"x":8,"y":33.2},
    {"x":9,"y":33.3},
    {"x":10,"y":33.2},
    {"x":11,"y":32.7},
    {"x":12,"y":31.9},
    {"x":13,"y":30.9},
    {"x":14,"y":29.6},
    {"x":15,"y":28.4},
    {"x":16,"y":27.1},
    {"x":17,"y":25.7},
    {"x":18,"y":24.4},
    {"x":19,"y":23.1},
    {"x":20,"y":21.9},
    {"x":21,"y":20.9},
    {"x":22,"y":19.9},
    {"x":23,"y":19.2},
    {"x":24,"y":18.6},
    {"x":25,"y":18}];//COG
var indexSeries3=[{"x":0,"y":9.5},
    {"x":1,"y":11.1},
    {"x":2,"y":12.5},
    {"x":3,"y":12.8},
    {"x":4,"y":11.3},
    {"x":5,"y":9.3},
    {"x":6,"y":7.8},
    {"x":7,"y":6.8},
    {"x":8,"y":6.2},
    {"x":9,"y":5.8},
    {"x":10,"y":5.5},
    {"x":11,"y":5.3},
    {"x":12,"y":5.2},
    {"x":13,"y":5.2},
    {"x":14,"y":5.2},
    {"x":15,"y":5.1},
    {"x":16,"y":4.8},
    {"x":17,"y":4.4},
    {"x":18,"y":4.1},
    {"x":19,"y":3.7},
    {"x":20,"y":3.4},
    {"x":21,"y":3.2},
    {"x":22,"y":2.9},
    {"x":23,"y":2.7},
    {"x":24,"y":2.6},
    {"x":25,"y":2.5}];//LTU
var toolTipForThree = d3.select("body")
    .append("div")
    .attr("class", "toolTipForThree");
function getSmoothInterpolation(data,j,k) {
    return function (d, i, a) {
        var interpolate = d3.scale.linear()
            .domain([0,1])
            .range([1, data.length + 1]);

        return function(t) {
            var flooredX = Math.floor(interpolate(t));
            var interpolatedLine = data.slice(j, k);

            if(flooredX > j && flooredX < k) {
                var weight = interpolate(t) - flooredX;
                var weightedLineAverage = data[flooredX].y * weight + data[flooredX-1].y * (1-weight);
                interpolatedLine.push({"x":interpolate(t)-1, "y":weightedLineAverage});
            }

            return lineFunction(interpolatedLine);
        }
    }
}

    var x_scale = d3.scale.linear().domain([0,25]).range([0, 700]);
    var y_scale = d3.scale.linear().domain([0,50]).range([190,10]);
    var lineFunction = d3.svg.line()
        .x(function(d) { return x_scale(d.x) })
        .y(function(d) { return y_scale(d.y) });
    var example2 = d3.select("#chart2")
        .append("svg")
        .attr("width", 700)
        .attr("height", 200)
        .attr("id", "exampleTwo");
    example2
     .append("path")
     .attr("d", lineFunction(indexSeries2))
     .attr("id", "Series2")
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", 3);
    example2
    .append("path")
    .attr("id", "Series2s")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 3);
    d3.select("#button2")
        .on("click", function() {
            d3.select("#exampleTwo #Series2s")
                .attr("stroke","rgb(255, 127, 14)")
                .transition()
                .duration(3000)
                .attrTween("d", getSmoothInterpolation(indexSeries2,7,13));
        });
example2
    .append("path")
    .attr("d", lineFunction(indexSeries3))
    .attr("id", "Series3")
    .attr("fill", "none")
    .attr("stroke", "grey")
    .attr("stroke-width", 3);
example2
    .append("path")
    .attr("id", "Series3s")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 3);
d3.select("#button3")
    .on("click", function() {
        d3.select("#exampleTwo #Series3s")
            .attr("stroke","rgb(44, 160, 44)")
            .transition()
            .duration(3000)
            .attrTween("d", getSmoothInterpolation(indexSeries3,1,6));
    });
example2
    .append("path")
    .attr("d", lineFunction(indexSeries1))
    .attr("id", "Series1")
    .attr("fill", "none")
    .attr("stroke", "grey")
    .attr("stroke-width", 3);
example2
    .append("path")
    .attr("id", "Series1s")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 3);
d3.select("#button1")
    .on("click", function() {
        d3.select("#exampleTwo #Series1s")
            .attr("stroke","rgb(31, 119, 180)")
            .transition()
            .duration(3000)
            .attrTween("d", getSmoothInterpolation(indexSeries1,4,10))
    });
d3.select("#exampleTwo #Series2s")
    .on("mouseover",mouseover)
    .on("mouseout",mouseout);
d3.select("#exampleTwo #Series3s")
    .on("mouseover",mouseover)
    .on("mouseout",mouseout);
d3.select("#exampleTwo #Series1s")
    .on("mouseover",mouseover)
    .on("mouseout",mouseout);
function mouseover(d){
    var temp=d3.select(this).attr("id");
    console.log("id",d3.select(this).attr("id"));
    toolTipForThree
        .style("display", null)
        .style("top", (d3.event.pageY - 5) + "px")
        .style("left", (d3.event.pageX + 10) + "px")
        .html(function(d){if (temp == "Series1s") {return "<p>Even though the Rwandan genocide happended in 1994,<br> the negative effect of the war last until 2000</p>";}
            else if(temp=="Series2s") {return "<p>Even though the Congo civil war happended in 1997, <br>the negative effect of the war last until 2003</p>";}
            else if(temp=="Series3s"){return "<p>Even though the January Events happended in 1991, <br>the negative effect of the war last until 1996</p>";}});
}
function mouseout(){
    toolTipForThree.style("display", "none");
}

