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
var lineForThree=d3.select("#lineForThree");
var scatter=d3.select("#scatter");
var area=d3.select("#area");

function focus_country(country) {
    d3.selectAll("path").classed("focused", false);
    if (country) {
        var line = d3.select("." + country);
        line.classed("focused", true);
        line.moveToFront();
    }
}
var countryForHighlight = null;
var update = function(value) {
    var localdata = dataMap;
    var localdataRate=dataRate;
    var show_vis = true;
    var show_vis_three=true;
    var show_vis_scatter=true;
    var show_vis_area=true;
    switch(value) {
        case 0:
            console.log("in case", value);
            show_vis = false;
            show_vis_three=false;
            show_vis_scatter=false;
            show_vis_area=false;
            countryForHighlight = null
            break;
        case 1:
            console.log("in case", value);
            localdata = dataMap;
            show_vis_three=false;
            show_vis_scatter=false;
            show_vis_area=false;
            countryForHighlight = null
            break;
        case 2:
            console.log("in case", value);
            localdata = dataMap;
            show_vis_three=false;
            show_vis_scatter=false;
            show_vis_area=false;
            countryForHighlight = "HTI";
            break;
        case 3:
            console.log("in case", value);
            localdata = dataMap;
            show_vis_three=false;
            show_vis_scatter=false;
            show_vis_area=false;
            countryForHighlight = "RWA";
            break;
        case 4:
            console.log("in case", value);
            localdata = dataMap;
            show_vis=false;
            show_vis_scatter=false;
            show_vis_area=false;
            countryForHighlight = null;
            break;
        case 5:
            console.log("in case", value);
            show_vis = false;
            show_vis_three=false;
            show_vis_area=false;
            countryForHighlight = null
            break;
        case 6:
            console.log("in case", value);
            show_vis = false;
            show_vis_three=false;
            show_vis_scatter=false;
            countryForHighlight = null
            break;
        default:
            countryForHighlight = null;
            show_vis = false;
            show_vis_three=false;
            show_vis_scatter=false;
            show_vis_area=false;
            break;
    }
    console.log("show viz", show_vis);
    if (show_vis) {
        vis.style("display", "inline-block");
    } else {
        vis.style("display", "none");
    }
    if (show_vis_three) {
        lineForThree.style("display", "inline-block");
    } else {
        lineForThree.style("display", "none");
    }
    if (show_vis_scatter) {
        scatter.style("display", "inline-block");
    } else {
        scatter.style("display", "none");
    }
    if (show_vis_area) {
        area.style("display", "inline-block");
    } else {
        area.style("display", "none");
    }
    focus_country(countryForHighlight); // this applies a highlight on a country.
};
// setup scroll functionality
var countryForIS0="HTI"
var dataset = [];
var years = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"];
function display(error, world,stunting,seven) {
    if (error) {
        console.log(error);
    } else {
        console.log("load data successfully");
        console.log("test",stunting);
        //dataset
        stunting.forEach(function (d, i) {
            var NDeaths = [];
            years.forEach(function (y) {
                if (d[y]) {
                    NDeaths.push({
                        year: y,
                        amount: d[y]
                    });
                }
            });
            dataset.push( {
                ISO: d.ISO,
                Deaths: NDeaths
            } );
        });
        //end of dataset
        draw_lines(countryForIS0,dataset);
        draw_scatter(stunting);
        draw_area(seven);
        var vis = d3.select("#vis");
        dataMap = world; // assign to global; call func in line_chart_refactor.js
        dataRate=stunting;
        //console.log("after makedata", dataMap);
        draw_map(dataMap,dataRate); // we can update the data if we want in the cases. Draw before focus!
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
            if (scroll >= 3000 && scroll > oldScroll) {
                vis.style("display", "none");
            }// else if (scroll >= 3000 && scroll < oldScroll) {
              //  vis.style("display", "inline-block"); // going backwards, turn it on.
           // }
        oldScroll=scroll;

        });
    }
} // end display

function typeAndSet(d) {
    countryById.set(d.ISO, d);
    return d;
}
queue()
    .defer(d3.json, "countries.json")
    .defer(d3.csv, "NeonatalRate.csv",typeAndSet)
    .defer(d3.csv, "seven.csv")
    .await(display);
