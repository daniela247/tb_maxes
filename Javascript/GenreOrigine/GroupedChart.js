//Source code : https://gist.github.com/mbostock/3887051
//Gestion de la taille du graphique



var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40}, //Marge pour le graphique
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//Pour les taile des bandes au niveau du X
var x0 = d3.scaleBand() //Construction d'un scale
    .rangeRound([25, width]) //si on n'a pas ça, rien de s'affiche au niveau des barres
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);


//Gere axe y
var y = d3.scaleLinear()
    .rangeRound([height, 0]);

/*
Couleurs :

Femme violet -> 	#DDA0DD
Homme bleu ->	#87CEFA
Couple rouge -> 		#FA8072
Famille orange -> #FF7F50

 */

var z = d3.scaleOrdinal()
    .range(["#FF7F50", "#FA8072", "#87CEFA", "#DDA0DD"]);


d3.csv("../CSV/GenreOrigine.csv", function(d, i, columns) {
    //Prend chaque colonne
    for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
    return d;
}, function(error, data) {
    if (error) throw error;





    //Liste les sous groupes
    var subgroups = data.columns.slice(1);

    //Prend les origines
    x0.domain(data.map(function(d) { return d.Origine; }));

    x1.domain(subgroups).rangeRound([0, x0.bandwidth()]);

    //Met le chiffre maximum soit 450
    y.domain([0, d3.max(data, function(d) { return d3.max(subgroups, function(key) { return d[key]; }); })]).nice();


    //Gere les barres
    g.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d.Origine) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
        .enter().append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return z(d.key); }) //couleur



    //Axe X
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));


    //Axe Y
    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Nombre de personnes");


    //Legent
    var legend = g.append("g")
        .attr("font-family", "Arial")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(subgroups.slice().reverse())
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });




});

