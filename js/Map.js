var width = 930,
    height = 500,
    center = [width / 2, height / 2],
    defaultFill = "#e0e0e0";//between gray and white
var color = d3.scale.linear().range(["#deebf7", "#3182bd"]).interpolate(d3.interpolateLab);
var countryById = d3.map();
var projection = d3.geo.mercator()
    .scale(200)
    .translate([width / 2, height / 2]);
var path = d3.geo.path()
    .projection(projection);
var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", move);
var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .call(zoom);
svg.on("wheel.zoom", null);
svg.on("mousewheel.zoom", null);
var g = svg.append("g");
var tooltip = d3.select("#tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);
var CURR_SELECT = "urban";
var flexible="Y2015";
function draw_map(world, stunting) {
    console.log(world);
    color.domain([0,73.1]);
    g.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.units).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class",function(d){return d.id;})
        .on("mouseover", mouseover)
        .on("mouseout", function() {
            d3.select(this).classed("selected", false);
            tooltip.transition().duration(300)
                .style("opacity", 0);
        })
        .attr("fill",function(d) {
            return color(getColor(d,flexible));
        });
    make_buttons(); // create the zoom buttons
    d3.selectAll("input").on("change", function change() {
        flexible = "Y"+this.value;
        updateMap(world, stunting,flexible);
    });
}
function updateMap(world, stunting,flexible){
    d3.selectAll("path")
        .attr("fill",function(d) {
            return color(getColor(d,flexible));
        });
}
function make_buttons() {
    // Zoom buttons actually manually constructed, not images
    svg.selectAll(".scalebutton")
        .data(['zoom_in', 'zoom_out'])
        .enter()
        .append("g")
        .attr("id", function(d){return d;})  // id is the zoom_in and zoom_out
        .attr("class", "scalebutton")
        .attr({x: 20, width: 20, height: 20})
        .append("rect")
        .attr("y", function(d,i) { return 20 + 25*i })
        .attr({x: 20, width: 20, height: 20})
    // Plus button
    svg.select("#zoom_in")
        .append("line")
        .attr({x1: 25, y1: 30, x2: 35, y2: 30 })
        .attr("stroke", "#fff")
        .attr("stroke-width", "2px");
    svg.select("#zoom_in")
        .append("line")
        .attr({x1: 30, y1: 25, x2: 30, y2: 35 })
        .attr("stroke", "#fff")
        .attr("stroke-width", "2px");
    // Minus button
    svg.select("#zoom_out")
        .append("line")
        .attr({x1: 25, y1: 55, x2: 35, y2: 55 })
        .attr("stroke", "#fff")
        .attr("stroke-width", "2px");
    svg.selectAll(".scalebutton")
        .on("click", function() {
            d3.event.preventDefault();
            var scale = zoom.scale(),
                extent = zoom.scaleExtent(),
                translate = zoom.translate(),
                x = translate[0], y = translate[1],
                factor = (this.id === 'zoom_in') ? 2 : 1/2,
                target_scale = scale * factor;
            var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
            if (clamped_target_scale != target_scale){
                target_scale = clamped_target_scale;
                factor = target_scale / scale;
            }
            // Center each vector, stretch, then put back
            x = (x - center[0]) * factor + center[0];
            y = (y - center[1]) * factor + center[1];
            // Transition to the new view over 350ms
            d3.transition().duration(350).tween("zoom", function () {
                var interpolate_scale = d3.interpolate(scale, target_scale),
                    interpolate_trans = d3.interpolate(translate, [x,y]);
                return function (t) {
                    zoom.scale(interpolate_scale(t))
                        .translate(interpolate_trans(t));
                    svg.call(zoom.event);
                };
            });
        });
}
function mouseover(d){
    d3.select(this).classed("selected", true);
    tooltip.transition().duration(100)
        .style("opacity", 1);
    tooltip
        .style("top", (d3.event.pageY - 10) + "px" )
        .style("left", (d3.event.pageX + 10) + "px");
    tooltip.selectAll(".symbol").style("opacity", "0");
    tooltip.selectAll(".val").style("font-weight", "normal");
    tooltip.selectAll(".val").style("color", "darkgray");
    tooltip.select(".symbol." + CURR_SELECT).style("opacity", "1");
    tooltip.select(".val." + CURR_SELECT).style({
        "font-weight": "bolder",
        "color": "black"
    });
    if (countryById.get(d.id)) {
        tooltip.select(".name").text(countryById.get(d.id)['Country']);
        tooltip.select(".urban.val").text(d3.round(countryById.get(d.id)[flexible])+"%");
    } else {
        tooltip.select(".name").text("No data for " + d.properties.name);
        tooltip.select(".urban.val").text("NA");
    }
} // end mouseover

function getColor(d,flexible) {
    var dataRow = countryById.get(d.id);
    if (dataRow) {
        return dataRow[flexible];
    } else {
        return 0;
    }
}
function zoomIn() {
    zoom.scale(zoom.scale()*2);
    move();
}
function move() {
    var t = d3.event.translate,
        s = d3.event.scale;
    t[0] = Math.min(width * (s - 1), Math.max(width * (1 - s), t[0]));
    t[1] = Math.min(height * (s - 1), Math.max(height * (1 - s), t[1]));
    zoom.translate(t);
    g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}
