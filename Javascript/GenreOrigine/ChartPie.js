//Source pie chart de base : https://bl.ocks.org/zanarmstrong/2f22eba1cb1b6b80e6595fadd81e7424
//Source transition + annotations : http://bl.ocks.org/nadinesk/99393098950665c471e035ac517c2224
var div = d3.select("body").append("div").attr("class", "toolTip");
var width = 500,
    height = 100,
    radius = Math.min(width, height) /3;

var legendRectSize = 10; //taille écriture des légendes
var legendSpacing = 4; //espace entre les legendes

//Couleur des trancher
var color = d3.scale.ordinal()
    .range(["#1187FF", "#419FFF", "#64B1FF", "#82C0FF"]);



//Aide pour le texte
var arc = d3.svg.arc()
    .outerRadius(radius - 18)
    .innerRadius(0);

//Label
var labelArc = d3.svg.arc()
    .outerRadius(radius + 15)
    .innerRadius(radius );

var pie = d3.layout.pie()
    .sort(null)
    .startAngle(1.1*Math.PI)
    .endAngle(3.1*Math.PI)
    .value(function(d) { return d.count; });

var svg = d3.select("#pie").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("../CSV/genrePie.csv", type, function(error, data) {
    if (error) throw error;

    console.log(pie(data))

    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.genre); })
        //Mouvement
        .transition().delay(function(d,i){
        return i * 500; })
        .duration(500)
        .attrTween('d', function(d) {
            var i = d3.interpolate(d.startAngle+0.1, d.endAngle );
            return function(t) {
                d.endAngle = i(t);
                return arc(d)
            }
        });


    g.append("text")
        .attr("transform", function(d){
            return "translate(" + labelArc.centroid(d) + ")";}
        )
        .text( function(d, i) {return d.data.count;})
        .attr("data-legend",function(d) { return d.data.genre})

    d3.selectAll("path").on("mousemove", function(d) {
        div.style("left", d3.event.pageX+10+"px");
        div.style("top", d3.event.pageY-25+"px");
        div.style("display", "inline-block");
        div.html((d.data.genre)+"<br>"+(d.data.count));
    });

    d3.selectAll("path").on("mouseout", function(d){
        div.style("display", "none");
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



