//Source : http://bl.ocks.org/mbostock/1305337

// définir les dimension
var m = 15,
    r = 80,
    z = d3.scale.ordinal()
        .range(["#6395FF", "#54CCE8"]);


var pie = d3.layout.pie()
    .value(function(d) { return +d.count; })
    .sort(function(a, b) { return b.count - a.count; });


var arc = d3.svg.arc()
    .innerRadius(r / 2)
    .outerRadius(r);



var radius = d3.scale.linear()
	.range([10,r]) // range = la taille minimum-maximum en pixels du rayon de ton donut chart
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) { return d.data.genre + ": " + d.data.count;})
.direction('s');

//Animation
var arcHighlight = d3.svg.arc()
    .innerRadius(r / 2)
    .outerRadius(r*1.05);



d3.csv("../CSV/genreHameau.csv", function(error, hameau) {
    if (error) throw error;

    // Order par origine
    var datas = d3.nest()
        .key(function(d) { return d.origine; })
        .entries(hameau);


    datas.forEach(function (d) {
    	totalOrigin = d3.sum(d.values, function(d) {return +d.count;})
        console.log(totalOrigin)
    	d.values.forEach(function (dd) {
    		dd.totalOrigin = totalOrigin

    	})
    });



    //Triage
    datas.sort(function(a,b) {return d3.descending(a.values[0].totalOrigin, b.values[0].totalOrigin)})

    // définir le radius / rayon des arcs (rendre fonction de 'count')
    var max = d3.max(datas, function(d) {return d.values[0].totalOrigin})
    var min = d3.min(datas, function(d) {return d.values[0].totalOrigin})
   	radius.domain([min, max])


   	arc
   		.innerRadius(function(d) {return radius(d.data.totalOrigin)/2})
   		.outerRadius(function(d) {return radius(d.data.totalOrigin) })


    arcHighlight
        .innerRadius(function(d) {return radius(d.data.totalOrigin)/2})
        .outerRadius(function(d) {return radius(d.data.totalOrigin)*1.1})


    function size(d) {
   		return radius(d.values[0].totalOrigin) + m
   	}

    // Insérer un element svg
    var div = d3.select("body").selectAll("div")
        .data(datas)
        .enter().append("div") // http://code.google.com/p/chromium/issues/detail?id=98951
        .style("display", "inline-block")
        .style("width", function(d) { return 2*size(d)+"px" })
        .style("height", function(d) { return 2*size(d)+"px" })
        .style("min-width","80px")
        .style("min-height","80px")

    // ajout d'un label
    div.append("span")
    	.attr("class","nomhameau")
        .text(function(d) { return d.key; })
        .append("span")
        	.attr("class","nombrehameau")
        	.text(function(d) { return  " (" + d.values[0].totalOrigin +")" });


    var svg = div.append("svg")
        //.attr("width", (r + m) * 2)
        //.attr("height", (r + m) * 2)
        .attr("width", function(d) { return 2*size(d) })
        .attr("height", function(d) { return 2*size(d) })
        .append("g")
        .attr("transform", function(d) { return "translate (" + size(d)  + "," + size(d) + ")" });

    svg.call(tip);

    var g = svg.selectAll("g")
        .data(function (d) {
            return pie(d.values);
        })
        .enter().append("g")


    //Ajout des couleurs au path
    //+ Ajout animation et tip
    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return z(d.data.genre);
        })
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
        .text(function(d){return d.data.genre + " : " + d.data.count})


});

