//Source pie chart de base : https://bl.ocks.org/zanarmstrong/2f22eba1cb1b6b80e6595fadd81e7424
//Source transition + annotations : http://bl.ocks.org/nadinesk/99393098950665c471e035ac517c2224

//GRAPHIQUE 1
var div = d3.select("body").append("div").attr("class", "toolTip");
var width = 500,
    height = 300,
    radius = Math.min(width, height) /3;



var legendRectSize = 10; //taille écriture des légendes
var legendSpacing = 4; //espace entre les legendes

//Couleur des trancher
var color = d3.scale.ordinal()
    .range(["#6395FF", "#54CCE8"]);


var arc = d3.svg.arc()
    .outerRadius(radius - 18)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .startAngle(1.1*Math.PI)
    .endAngle(3.1*Math.PI)
    .value(function(d) { return d.count; });

var svg = d3.select("#pie")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var arcHighlight = d3.svg.arc()
    .outerRadius ((radius - 12 )* 1.1);

//Lecture du CSV
d3.csv("../CSV/genrePie.csv", type, function(error, data) {
    if (error) throw error;

    //Avoir le pourcentage pour chaque tranche
    var total = d3.sum(data, function (d){
        return d.count
    });


    data.forEach(function(d){
        d.percentage = d.count / total;
    });

    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");


    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.genre); })


    //Pour tooltip
    d3.selectAll("path").on("mouseover", function(d) {

        div.style("left", 490+"px");
        div.style("top", 80+"px");
        div.style("display", "inline-block");
        div.html((d.data.genre)+"<br>"+(d.data.count)+"<br>"+( d3.format(".0%")(d.data.percentage )) );
        d3.select(this).transition().attr("d", arcHighlight)


    });

    d3.selectAll("path").on("mouseout", function(d){
        div.style("display", "none");
        d3.select(this)
            .transition()
            .attr("d",arc(d))

    });





    //Legent
    var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = + 12 * legendRectSize; //décaler la légende
            var vert = i * 19 - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d; });
});



function type(d) {
    d.count = +d.count;
    return d;
}
