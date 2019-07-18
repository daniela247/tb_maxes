//Source pie chart de base : https://bl.ocks.org/zanarmstrong/2f22eba1cb1b6b80e6595fadd81e7424
//Source transition + annotations : http://bl.ocks.org/nadinesk/99393098950665c471e035ac517c2224
var div = d3.select("body").append("div").attr("class", "toolTip");
var width = 500,
    height = 300,
    radius = Math.min(width, height) /3;

var lastIndex = -1;
var activeIndex = 0;

// When scrolling to a new section
// the activation function for that
// section is called.
var activateFunctions = [];
// If a section has an update function
// then it is called while scrolling
// through the section with the current
// progress through the section.
var updateFunctions = [];


// Sizing for the grid visualization
var squareSize = 6;
var squarePad = 2;
var numPerRow = width / (squareSize + squarePad);



var legendRectSize = 10; //taille écriture des légendes
var legendSpacing = 4; //espace entre les legendes

//Couleur des trancher
var color = d3.scale.ordinal()
    .range(["#6395FF", "#54CCE8", "#50FFC5", "#54E868"]);

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


d3.csv("../CSV/genrePie.csv", type, function(error, data) {
    if (error) throw error;


    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

         g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.genre); })





/*^^
var pat = svg.selectAll(".arc").selectAll("path");
pat.style("fill", function(d) {
    if(d.data.genre=="Couple") {
        return "red"
    }else
    return color(d.data.genre); });
*/
    g.append("text")
        .attr("transform", function(d){
            return "translate(" + labelArc.centroid(d) + ")";}
        )
        .text( function(d, i) {return d.data.count;})
        .attr("data-legend",function(d) { return d.data.genre})


    //Pour tooltip
    d3.selectAll("path").on("mousemove", function(d) {
        div.style("left", 490+"px");
        div.style("top", 80+"px");
        div.style("display", "inline-block");
        div.html((d.data.genre)+"<br>"+(d.data.count));



    });

    d3.selectAll("path").on("mouseout", function(d){

        div.style("display", "none");

    });


    path.on("mouseover", function(d){
        d3.select(this).transition()
            .duration(200)
            .attr("d", arc)
            .attr("stroke","white")
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


