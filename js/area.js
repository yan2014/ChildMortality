function draw_area(data){
    console.log("seven",data);
    var years = ["1990","1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"];
    var dataset = [];
    data.forEach(function (d, i) {
        var NDeaths = [];
        years.forEach(function (y) {
            if (d[y]) {
                NDeaths.push({
                    x: y,
                    y: +d[y]
                });
            }
        });
        dataset.push( {
            type: d.RegionName,
            values: NDeaths  // we just built this!
        } );
    });
    console.log("structured data", dataset);
    var dataset1=dataset;
    var margin = {
        top: 20,
        bottom: 20,
        right: 20,
        left: 50
    };
    var dateFormat = d3.time.format("%Y");

    var tooltipForArea = d3.select("body")
        .append("div")
        .attr("class", "tooltipForArea");
    var width = 800 - margin.left - margin.right;
    var height = 700 - margin.top - margin.bottom;
    var stackType = true;
 //   var color=[{name:"East Asia & Pacific",color:"#e6007d"},{name:"South Asia",color:"#9d9d9c"},{name:"Europe & Central Asia",color:"#ffd500"}
 //       ,{name:"Middle East & North Africa",color:"#009641"},{name:"Sub-Saharan Africa",color:"#95c11f"},{name:"Latin America & Caribbean",color:"#1c9cd8"},{name:"North America",color:"#f39200"}];

    var colors = d3.scale.ordinal().range(["#95c11f", " #009641", "#9d9d9c","#e6007d","#1c9cd8","#ffd500","#f39200","#e9be7c","#42bff9"])
        .domain(["Sub-Saharan Africa", "Middle East and North Africa", "South Asia","East Asia and Pacific","Latin America and the Caribbean","Central and Eastern Europe","Developed regions","Developing regions","World"]);
    var stackZero = d3.layout.stack()
        .values(function (d) {return d.values;})
        .offset("zero");

    stackZero(dataset);
    console.log(dataset);

    var xScale = d3.time.scale()
        .domain(
            d3.extent(years, function(d) {
                return dateFormat.parse(d);
            }))
        .range([0, width]);

    var yScale = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(dataset, function (d) {
            return d3.max(d.values, function (d) {
                return d.y0 + d.y;
            });
        })]);

    var area = d3.svg.area()
        .x(function (d) {
            return xScale(dateFormat.parse(d.x));
        })
        .y0(function (d) {
            return yScale(d.y0);
        })
        .y1(function (d) {
            return yScale(d.y0 + d.y);
        });

    var svg = d3.selectAll("#area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll(".layers")
        .data(dataset)
        .enter()
        .append("path")
        .attr("class", function(d){return d.type;})
        .attr("d", function (d) {
            return area(d.values);
        })
        .style("fill", function (d, i) {
            return colors(i)
        })
        .on("mouseover", function(d){
            d3.select(this).attr("stroke","blue").attr("stroke-width",0.8);
            tooltipForArea
                .style("display", null)
                .style("top", (d3.event.pageY - 5) + "px")
                .style("left", (d3.event.pageX + 10) + "px")
                .html(d.type);

        })
        .on("mouseout",function(){
            svg.select(".tooltipForArea").remove();
            d3.select(this).attr("stroke","pink").attr("stroke-width",0.2);
            tooltipForArea.style("display", "none");
        });

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(10)
        .tickFormat(function(d) {
            return dateFormat(d);
        })
        .innerTickSize([0]);
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)")
        .call(yAxis);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.bottom+21) + ")")
        .call(xAxis);

    d3.select(".special") //now we start to interact with the chart
        .on("click", function () {

            console.log("entering variable is " + stackType);
            if(stackType){
                $(".special").text("Mortality rate by absolute percentage");
            }
            else{
                $(".special").text("Mortality rate by absolute value");

            }
            svg.selectAll("path").data([]).exit().remove();
            svg.selectAll(".y.axis").data([]).exit().remove();

            if (stackType) { //enter true, or expanded data
                var stackExpand = d3.layout.stack()
                    .values(function (d) {
                        return d.values;
                    })
                    .offset("expand");

                stackExpand(dataset);

                console.log(dataset);

                var yScale = d3.scale.linear()
                    .range([height, 0])
                    .domain([0, d3.max(dataset, function (d) {
                        return d3.max(d.values, function (d) {
                            return d.y0 + d.y;
                        });
                    })]);

                var area = d3.svg.area()
                    .x(function (d) {
                        return xScale(dateFormat.parse(d.x));
                    })
                    .y0(function (d) {
                        return yScale(d.y0);
                    })
                    .y1(function (d) {
                        return yScale(d.y0 + d.y);
                    });

                svg.selectAll(".layers")
                    //.data(stackZero(data))
                    .data(stackExpand(dataset))
                    .enter()
                    .append("path")
                    .attr("class", function(d){return d.type;})
                    .attr("d", function (d) {
                        return area(d.values);
                    })
                    .style("fill", function (d, i) {
                        return colors(i)
                    })
                    .on("mouseover", function(d){
                        d3.select(this).attr("stroke","blue").attr("stroke-width",0.8);
                        tooltipForArea
                            .style("display", null)
                            .style("top", (d3.event.pageY - 5) + "px")
                            .style("left", (d3.event.pageX + 10) + "px")
                            .html(d.type);

                    })
                    .on("mouseout",function(){
                        svg.select(".tooltipForArea").remove();
                        d3.select(this).attr("stroke","pink").attr("stroke-width",0.2);
                        tooltipForArea.style("display", "none");
                    });

                formatter = d3.format(".0%");

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .tickFormat(formatter);

                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(0,0)")
                    .call(yAxis);


                stackType = false;
                console.log("exiting variable is " + stackType);

            } else { //enter false, or zero data
                data.forEach(function (d, i) {
                    var NDeaths = [];
                    years.forEach(function (y) {
                        if (d[y]) {
                            NDeaths.push({
                                x: y,
                                y: +d[y]
                            });
                        }
                    });
                    dataset.push( {
                        type: d.RegionName,
                        values: NDeaths  // we just built this!
                    } );
                });
                var stackZero = d3.layout.stack()
                    .values(function (d) {
                        return d.values;
                    })
                    .offset("zero");

                stackZero(dataset);

                console.log("false",dataset);

                var yScale = d3.scale.linear()
                    .range([height, 0])
                    .domain([0, d3.max(dataset, function (d) {
                        return d3.max(d.values, function (d) {
                            return d.y0 + d.y;
                        });
                    })]);

                var area = d3.svg.area()
                    .x(function (d) {
                        return xScale(dateFormat.parse(d.x));
                    })
                    .y0(function (d) {
                        return yScale(d.y0);
                    })
                    .y1(function (d) {
                        return yScale(d.y0 + d.y);
                    });

                svg.selectAll(".layers")
                    .data(stackZero(dataset))
                    //.data(stackExpand(data))
                    .enter()
                    .append("path")
                    .attr("class", function(d){return d.type;})
                    .attr("d", function (d) {
                        return area(d.values);
                    })
                    .style("fill", function (d, i) {
                        return colors(i)
                    })
                    .on("mouseover", function(d){
                        d3.select(this).attr("stroke","blue").attr("stroke-width",0.8);
                        tooltipForArea
                            .style("display", null)
                            .style("top", (d3.event.pageY - 5) + "px")
                            .style("left", (d3.event.pageX + 10) + "px")
                            .html(d.type);

                    })
                    .on("mouseout",function(){
                        svg.select(".tooltipForArea").remove();
                        d3.select(this).attr("stroke","pink").attr("stroke-width",0.2);
                        tooltipForArea.style("display", "none");
                    });

                stackType = true;
                console.log("exiting variable is" + stackType);

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");

                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(0,0)")
                    .call(yAxis);

            };

        });
}

