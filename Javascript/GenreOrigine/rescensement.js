//Source : https://gist.github.com/mbostock/3888852
var radius = 65,
    padding = 10;

var color = d3.scale.ordinal()
    .range(["#164FC2", "#47C0EC"]);

var arc = d3.svg.arc()
    .outerRadius(radius/2)
    .innerRadius(radius - 15);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return  d.count; });

var arcHighlight = d3.svg.arc()
    .innerRadius(radius /2)
    .outerRadius ((radius - 12 )* 1.1);


var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function (d) {
        return d.data.name+ ": " + "<br/>"+ d.count;
    })
    .direction('s');

var labelArc = d3.svg.arc()
    .outerRadius(radius + 15)
    .innerRadius(radius  );

d3.csv("../CSV/rescensement.csv", function(error, data) {
    if (error) throw error;
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "origine"; }));
    data.forEach(function(d) {
        d.ages = color.domain().map(function(name) {
            return {name: name, count: +d[name]};
        });
    });



    var total = d3.sum(data, function (d){
        return d.count
    });


    data.forEach(function(d){
        d.percentage = d.count / total;
    });

    var legend = d3.select("body").append("svg")
        .attr("class", "legend")
        .attr("width", radius * 2)
        .attr("height", radius * 2)
        .selectAll("g")
        .data(color.domain().slice().reverse())
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);


    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) { return d; });

    var svg = d3.select("body").selectAll(".pie")
        .data(data)
        .enter().append("svg")
        .attr("class", "pie")
        .attr("width", radius * 2 + 10 + "px")
        .attr("height", radius * 2 )
        .append("g")
        .attr("transform", "translate(" + radius  + "," + radius + ")");

    svg.call(tip);


    var g =  svg.selectAll(".arc")
        .data(function(d) { return pie(d.ages); })
        .enter().append("path")
        .attr("class", "arc")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.name); })
        .on("mouseover", function(d){
            d3.select(this)
                .transition()
                .attr("d",arcHighlight(d))
        })
        .on("mouseout", function(d){
            d3.select(this)
                .transition()
                .attr("d",arc(d))
        })
        .append("title")
        .text(function(d){return d.data.name + " : " + d.data.count});

    svg.append("text")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.origine; });




    // Computes the label angle of an arc, converting from radians to degrees.
    function angle(d) {
        var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
        return a > 90 ? a - 180 : a;
    }

});
