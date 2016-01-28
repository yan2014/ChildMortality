function draw_scatter(data){
    console.log("rawdata",data);
    data=data.filter(function(d){return d.deathin8!=0;});
    var height=600;
    var width=800;
    var margin={top:20,bottom:45,left:50,right:30};
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
    var tooltip = d3.select("body")
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
            .attr("r", function(d) {
                return d["2008"]/5;
            })
            .attr("fill",function(d){
                if(d.Region==="East Asia & Pacific") {return "#e6007d";}
                else if(d.Region==="South Asia") {return "#9d9d9c"}
                else if(d.Region==="Europe & Central Asia") {return "#ffd500"}
                else if(d.Region==="Middle East & North Africa") {return "#009641"}
                else if(d.Region==="Sub-Saharan Africa") {return "#95c11f"}
                else if(d.Region==="Latin America & Caribbean") {return "#1c9cd8"}
                else if(d.Region==="North America") {return "#f39200"}
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
                .style("top", (d3.event.pageY) + "px")
                .style("left", (d3.event.pageX+ 10) + "px");
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
        var color=[{name:"East Asia & Pacific",color:"#e6007d"},{name:"South Asia",color:"#9d9d9c"},{name:"Europe & Central Asia",color:"#ffd500"}
            ,{name:"Middle East & North Africa",color:"#009641"},{name:"Sub-Saharan Africa",color:"#95c11f"},{name:"Latin America & Caribbean",color:"#1c9cd8"},{name:"North America",color:"#f39200"}];
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

        //draw dot size
        var dotscale=[{number:30,r:30},{number:60,r:60},{number:100,r:100}]
        var dotscale=svg.selectAll(".dotscale")
            .data(dotscale)
            .enter()
            .append("g")
            .attr("class","dotscale")
            .attr("transform", function(d,i){ return "translate(0," + d.r/5 + ")"; });
        dotscale.append("circle")
            .attr("cx",width-75)
            .attr("cy",500)
            .attr("r", function(d, i) { return d.r/5})
            .style("fill","none")
            .attr("stroke-width",2)
            .attr("stroke","gray");
        dotscale.append("text")
                .attr("x", width - 68)
                .attr("y", 503)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d.number;})
                .style("font-size","10px")
            .attr("transform", function(d,i){ return "translate(0," + d.r/5 + ")"; });
        //
    };
