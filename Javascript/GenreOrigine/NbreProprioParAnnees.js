
//source : https://bl.ocks.org/hydrosquall/7966e9c8e8414ffcd8b5
//Highlight : https://bl.ocks.org/bricedev/0d95074b6d83a77dc3ad
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600,
    height = 250 ;

var divTooltip = d3.select("body").append("div").attr("class", "toolTip");

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#1C215A", "#5276D8", "#6FA8F5", "#89BEF4","#9FD8F2"]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .tickSize(0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left+ margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("../CSV/NbreProprioParAnnees.csv", function(error, data) {
    if (error) throw error;


    var origineNames = d3.keys(data[0]).filter(function(key) { return key !== "Annee"; });

    data.forEach(function(d) {
        //Valeur pour chacune des origines par rapport au genre
        d.origines = origineNames.map(function(name) { return {name: name, value: +d[name]}; });

    });



    x0.domain(data.map(function(d) { return d.Annee; }));
    x1.domain(origineNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.origines, function(d) { return d.value; }); })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0.8)
        .attr("dy", ".91em")
        .style("text-anchor", "end")
        .text("Nombre de personnes");

//Creation des groupes
    var Annee = svg.selectAll(".Annee")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x0(d.Annee) + ",0)"; });

    Annee.selectAll("rect")
        .data(function(d) { return d.origines; })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.name); })
        .style("fill", function(d) { return color(d.name) })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        //Highlight
        .on("mouseover", function(d) {
            d3.select(this).style("fill", d3.rgb(color(d.name)).darker(3))

        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", color(d.name))
        });

//Tooltip : https://bl.ocks.org/Jimimimi/a7b8964880a347fbde19de2de2fdd5d5
    Annee.on("mousemove", function(d){
        divTooltip.style("left", d3.event.pageX+10+"px");
        divTooltip.style("top", d3.event.pageY-25+"px");
        divTooltip.style("display", "inline-block");
        var x = d3.event.pageX, y = d3.event.pageY
        var elements = document.querySelectorAll(':hover');
        l = elements.length
        l = l-1
        elementData = elements[l].__data__;
        var activeBar = window.activeBar = elements[l];
        divTooltip.html(elementData.name + " : " +elementData.value);
    });
    Annee.on("mouseout", function(d){
        divTooltip.style("display", "none");
    });



    var legend = svg.selectAll(".legend")
        .data(origineNames.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .style("font-size","12px")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

    //Highlight
    d3.select('#inds')
        .on("change", function () {
            var sect = document.getElementById("inds");
            var section = sect.options[sect.selectedIndex].value;

            if(section !== 'Origine') {
                d3.selectAll("rect")
                    .attr('opacity', function(d) {
                        if(d.name !== section) {
                            return 0.1;
                        } else {
                            return 1;
                        }
                    })

            } else
            {
                d3.selectAll('rect')
                    .attr('opacity', 1)
            }
        });



});
