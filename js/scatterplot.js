function draw_scatter(data){
    console.log("rawdata",data);
    data=data.filter(function(d){return d.deathin8!=0;});
    var height=600;
    var width=800;
    var margin={top:20,bottom:45,left:150,right:30};
    var dotRadius=5;
    var xScale=d3.scale.linear()
        .range([margin.left,width-margin.left-margin.right]);
    var yScale=d3.scale.linear()
        .range([height-margin.bottom, margin.top]);
    var xAxis=d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickSize(2);
    var yAxis=d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickSize(2);
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
//add tooltip as a div to the page
    var tooltip = d3.select("#scatter")
        .append("div")
        .attr("class", "tooltipForScatter");
        xScale.domain(
            [d3.min(data,function(d){
                return +d["2008"];
            })-2,
                d3.max(data,function(d){
                    return +d["2008"];
                })+2]
        );
        yScale.domain(
            [d3.min(data,function(d){
                return +d.deathin8;
            })-2,
                d3.max(data,function(d){
                    return +d.deathin8;
                })+2]
        );
        var circles=svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle");
        circles.attr("cx", function(d) {
            return xScale(d["2008"]);
        })
            .attr("cy", function(d) {
                return yScale(d.deathin8);
            })
            .attr("r", dotRadius)
            .attr("fill",function(d){
                if(d.Region==="East Asia & Pacific") {return "#e25f82";}
                else if(d.Region==="South Asia") {return "#895881"}
                else if(d.Region==="Europe & Central Asia") {return "#ED7C31"}
                else if(d.Region==="Middle East & North Africa") {return "#82A5C0"}
                else if(d.Region==="Sub-Saharan Africa") {return "#6E9E75"}
                else if(d.Region==="Latin America & Caribbean") {return "#00BBD6"}
                else if(d.Region==="North America") {return "#be1932"}
            });

//tooltip with CSS
        function mouseoverfunc(d){
            return tooltip
                .style("display",null)
                .html("<p>Country: " + d.Country +
                    "<br>Deaths: " + d.deathin8 +
                    "<br>Mortality Rate: " + d["2008"]+
                    "<br>Region: " + d.Region+ "</p>");
        }
        function mousemovefunc(d){
            return tooltip
                .style("top", (d3.event.pageY - 3350) + "px")
                .style("left", (d3.event.pageX -600+ 10) + "px");
        }
        function mouseoutfunc(d){
            return tooltip.style("display", "none");
        }
        circles
            .on("mouseover",mouseoverfunc)
            .on("mousemove",mousemovefunc)
            .on("mouseout",mouseoutfunc);
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .call( xAxis);
        svg.append("text")
            .attr("class", "labelX")
            .attr("transform", "translate(" + (width / 2) + " ," + (height-13) + ")")
            .style("text-anchor", "middle")
            .text("Child mortality rate in 2008");

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(yAxis);
        svg.append("text")
            .attr("class", "labelY")
            .attr("y", margin.left-15)
            .attr("x",0-(height / 2))
            .attr("transform", "rotate(-90)")
            .attr("dy", "-1.5em")
            .style("text-anchor", "middle")
            .text("deaths caused by wars in 2008");

        // draw legend
        var color=[{name:"East Asia & Pacific",color:"#e25f82"},{name:"South Asia",color:"#895881"},{name:"Europe & Central Asia",color:"#ED7C31"}
            ,{name:"Middle East & North Africa",color:"#82A5C0"},{name:"Sub-Saharan Africa",color:"#6E9E75"},{name:"Latin America & Caribbean",color:"#00BBD6"},{name:"North America",color:"#be1932"}];
        var legend = svg.selectAll(".legend")
            .data(color)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // draw legend colored circles
        legend.append("circle")
            .attr("cx", width - 15)
            .attr("cy", 9)
            .attr("r",dotRadius)
            .style("fill", function(d){return d.color;});

        // draw legend text
        legend.append("text")
            .attr("x", width - 36)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d.name;})
    };
