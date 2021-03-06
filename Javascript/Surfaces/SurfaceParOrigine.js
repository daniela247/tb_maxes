//Source pie chart de base : https://bl.ocks.org/zanarmstrong/2f22eba1cb1b6b80e6595fadd81e7424
//Source transition + annotations : http://bl.ocks.org/nadinesk/99393098950665c471e035ac517c2224
var div = d3.select("body").append("div").attr("class", "toolTip");
var width = 600,
    height = 300,
    radius = Math.min(width, height) /3;



var legendRectSize = 10; //taille écriture des légendes
var legendSpacing = 4; //espace entre les legendes

//Couleur des trancher
var color = d3.scale.ordinal()
    .range(["#1C215A", "#5276D8", "#6FA8F5", "#89BEF4","#9FD8F2"]);

//Aide pour le texte
var arc = d3.svg.arc()
    .outerRadius(radius - 18)
    .innerRadius(0);

//Label
var labelArc = d3.svg.arc()
    .outerRadius(radius + 15)
    .innerRadius(radius  );

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


d3.csv("../CSV/surfaceParOrigine.csv", type, function(error, data) {
    if (error) throw error;

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
        .style("fill", function(d) { return color(d.data.origine); })


    /*^^
    var pat = svg.selectAll(".arc").selectAll("path");
    pat.style("fill", function(d) {
        if(d.data.origine=="Couple") {
            return "red"
        }else
        return color(d.data.origine); });
    */
    g.append("text")
        .attr("transform", function(d){
            return "translate(" + labelArc.centroid(d) + ")";}
        )
        .attr("data-legend",function(d) { return d.data.origine})


    //Pour tooltip
    d3.selectAll("path").on("mouseover", function(d) {

        div.style("left", 490+"px");
        div.style("top", 80+"px");
        div.style("display", "inline-block");
        div.html((d.data.origine)+"<br>"+(d.data.count)+"<br>"+( d3.format(".0%")(d.data.percentage )) );
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
            var horz = + 18 * legendRectSize; //décaler la légende
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
