//Source : http://bl.ocks.org/mbostock/1305337

// Define the margin, radius, and color scale. Colors are assigned lazily, so
// if you want deterministic behavior, define a domain for the color scale.
var m = 15,
    r = 80,
    z = d3.scale.ordinal()
        .range(["#50FFC5", "#54E868", "#54CCE8","#6395FF"]);
// Define a pie layout: the pie angle encodes the count of flights. Since our
// data is stored in CSV, the counts are strings which we coerce to numbers.
var pie = d3.layout.pie()
    .value(function(d) { return +d.count; })
    .sort(function(a, b) { return b.count - a.count; });

// Define an arc generator. Note the radius is specified here, not the layout.
var arc = d3.svg.arc()
    .innerRadius(r / 2)
    .outerRadius(r);


// Load the flight data asynchronously.
d3.csv("../CSV/genreHameau.csv", function(error, hameau) {
    if (error) throw error;

    // Nest the flight data by origineating airport. Our data has the counts per
    // Nest the flight data by origineating airport. Our data has the counts per
    // airport and genre, but we want to group counts by aiport.
    var datas = d3.nest()
        .key(function(d) { return d.origine; })
        .entries(hameau);

    // Insert an svg element (with margin) for each airport in our dataset. A
    // child g element translates the origine to the pie center.
    var svg = d3.select("body").selectAll("div")
        .data(datas)
        .enter().append("div") // http://code.google.com/p/chromium/issues/detail?id=98951
        .style("display", "inline-block")
        .style("width", (r + m) * 2 + "px")
        .style("height", (r + m) * 2 + "px")
        .append("svg")
        .attr("width", (r + m) * 2)
        .attr("height", (r + m) * 2)
        .append("g")
        .attr("transform", "translate(" + (r + m )  + "," + (r + m) + ")");


    // Add a label for the airport. The `key` comes from the nest operator.
    svg.append("text")
        .attr("dy", ".35em")
        .attr("x", (m /2) - 15+"px")
        .attr("y", -90)
        .attr("text-anchor", "middle")
        .text(function(d) { return d.key; });

    // Pass the nested per-airport values to the pie layout. The layout computes
    // the angles for each arc. Another g element will hold the arc and its label.
    var g = svg.selectAll("g")
        .data(function(d) { return pie(d.values); })
        .enter().append("g");

    // Add a colored arc path, with a mouseover title showing the count.
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return z(d.data.genre); })
        .append("title")
        .html(function(d) { return d.data.genre + ": " + d.data.count;});




    // Add a label to the larger arcs, translated to the arc centroid and rotated.
    g.filter(function(d) { return d.endAngle - d.startAngle > .1; }).append("text")
        .attr("dy", ".20em")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
        .text(function(d) { return d.data.genre; });

    // Computes the label angle of an arc, converting from radians to degrees.
    function angle(d) {
        var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
        return a > 90 ? a - 180 : a;
    }


});

