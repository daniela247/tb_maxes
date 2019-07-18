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

// Create a new scale for radius (based on count)
var radius = d3.scale.linear()
	.range([10,r]) // range = la taille minimum-maximum en pixels du rayon de ton donut chart 

// Load the flight data asynchronously.
d3.csv("../CSV/genreHameau.csv", function(error, hameau) {
    if (error) throw error;

    // Nest the flight data by origineating airport. Our data has the counts per
    // Nest the flight data by origineating airport. Our data has the counts per
    // airport and genre, but we want to group counts by aiport.
    var datas = d3.nest()
        .key(function(d) { return d.origine; })
        .entries(hameau);

    // calculer valeurs minimales-maximales dans les données du nombre de personnes (pour la taille du donut)
    // étendre "datas" pour ajouter, pour chaque origine, la somme des "count" des différents genres, 
    // nommé "totalOrigin"
    datas.forEach(function (d) {
    	totalOrigin = d3.sum(d.values, function(d) {return +d.count;})
    	d.values.forEach(function (dd) {
    		dd.totalOrigin = totalOrigin
    	})
    })

    //console.log(datas); // DEBUG

    // trier par nombre décroissant de "total origin"
    datas.sort(function(a,b) {return d3.descending(a.values[0].totalOrigin, b.values[0].totalOrigin)})

    // définir le radius / rayon des arcs (rendre fonction de 'count')
    var max = d3.max(datas, function(d) {return d.values[0].totalOrigin})
    var min = d3.min(datas, function(d) {return d.values[0].totalOrigin})
   	radius.domain([min, max])
   	
   	// appliquer la fonction radius dynqmieuement en fonction des données, au rayon des arcs
   	arc
   		.innerRadius(function(d) {return radius(d.data.totalOrigin)/2})
   		.outerRadius(function(d) {return radius(d.data.totalOrigin)})

   	// ajouter une fonction utilitaire pour fixer dynamiquement la taille du div, du svg, etc.
   	function size(d) {
   		return radius(d.values[0].totalOrigin) + m
   	}

    // Insert an svg element (with margin) for each airport in our dataset. A
    // child g element translates the origine to the pie center.
    var div = d3.select("body").selectAll("div")
        .data(datas)
        .enter().append("div") // http://code.google.com/p/chromium/issues/detail?id=98951
        .style("display", "inline-block")
        //.style("width", (r + m) * 2 + "px")
        //.style("height", (r + m) * 2 + "px")
        .style("width", function(d) { return 2*size(d)+"px" })
        .style("height", function(d) { return 2*size(d)+"px" })
        .style("min-width","80px")
        .style("min-height","80px")
        
    // Add a label for the airport. The `key` comes from the nest operator.
    div.append("span")
    	.attr("class","nomhameau")
        .text(function(d) { return d.key; })
        .append("span")
        	.attr("class","nombrehameau")
        	.text(function(d) { return " (" + d.values[0].totalOrigin +")" });

    // Add svg after the label
    var svg = div.append("svg")
        //.attr("width", (r + m) * 2)
        //.attr("height", (r + m) * 2)
        .attr("width", function(d) { return 2*size(d) })
        .attr("height", function(d) { return 2*size(d) })
        .append("g")
        // .attr("transform", "translate(" + (r + m )  + "," + (r + m) + ")");
        .attr("transform", function(d) { return "translate(" + size(d)  + "," + size(d) + ")" });

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
    g.filter(function(d) { return (d.endAngle - d.startAngle > .1) && d.data.totalOrigin > (max+min)/2; }).append("text")
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

