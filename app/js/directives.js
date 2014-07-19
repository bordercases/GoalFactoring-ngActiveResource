'use strict';

/* Directives */


angular.module('myApp.directives', ['d3'])
    .directive('appVersion', ['version', function(version) {
        return function(scope, ele, attrs) {
            ele.text(version);
        };
    }])
    // Commented D3 Bars
    .directive('d3Bars', ['d3Service', '$window', function(d3Service, $window){ // the tutorial expected $window to be imported, but I've had to do it manually. Why?
        return {
            restrict:'EA',
            scope:{
                data: '=', // set data binding to controller (not applied/digested yet)
                onClick:'&'
            },
            link: function(scope, ele, attrs) {
                d3Service.d3().then(function(d3) {
                    // d3 is the raw d3 object
                    // begin coding visualization

                    // tag attribute calls || defaults
                    var margin = parseInt(attrs.margin) || 20,
                        barHeight = parseInt(attrs.barHeight) || 20,
                        barPadding = parseInt(attrs.barPadding) || 5;

                    var svg = d3.select(ele[0])
                        .append("svg")
                        .style('width','100%');

                    // Browser onresize event
                    window.onresize = function(){
                        scope.$apply();
                    };

                    // hard-code data

                    /*
                    scope.data = [
                        {name:"Greg",score:98},
                        {name:"Ari",score:96},
                        {name:"Q",score:75},
                        {name:"Jeremy",score:48}
                    ];
                    */
                    // Watch for resize event
                    scope.$watch(function(){
                        return angular.element($window)[0].innerWidth;
                    }, function(){
                        scope.render(scope.data);
                    });

                    // watch for data changes and re-render ***
                    scope.$watch('data', function(newVals, oldVals) {
                        return scope.render(newVals);
                    }, true);

                    scope.render = function(data){
                        // our custom d3 code
                        // define code as if we weren't using angular anyway

                        // remove all previous items before render
                        svg.selectAll('*').remove();

                        // If we don't pass any data, return out of the element
                        if (!data) return;

                        // setup variables
                        var width = d3.select(ele[0]).node().offsetWidth - margin,
                            // calculate the height
                            height = scope.data.length * (barHeight + barPadding),
                            // Use the category20() scale function for multicolor support (?)
                            color = d3.scale.category20(),
                            // our xScale
                            xScale = d3.scale.linear()
                                .domain([0, d3.max(data, function(d){
                                    return d.score;
                                })])
                                .range([0, width]);

                        // set the height based on the calculations above
                        svg.attr('height',height);

                        // create the rectangles for the bar chart
                        svg.selectAll('rect')
                            .data(data).enter()
                            .append('rect')
                            .attr('height', barHeight)
                            .attr('width', 140)
                            .attr('x',Math.round(margin/2))
                            .attr('y',function(d,i){
                                return i * (barHeight + barPadding);
                            })
                            .attr('fill', function(d){ return color(d.score); })
                            .transition()
                            .duration(1000)
                            .attr('width', function(d){
                                return xScale(d.score);
                            });

                        svg.selectAll('text')
                            .data(data)
                            .enter()
                            .append('text')
                            .attr('fill', '#fff')
                            .attr('y', function(d,i) {
                                return i * (barHeight + barPadding) + 15;
                            })
                            .attr('x', 15)
                            .text(function(d) {
                                return d.name + " (scored: " + d.score + ")";
                            });
                        }
                });
            }};
    }])
    .directive('d3Graph', ['d3Service', '$window', function(d3Service, $window){ // the tutorial expected $window to be imported, but I've had to do it manually. Why?
        return {
            restrict:'EA',
            scope:{
                data: '=', // set data binding to controller (not applied/digested yet)
                onClick:'&'
            },
            link: function(scope, ele, attrs) {
                d3Service.d3().then(function(d3) {
                    // d3 is the raw d3 object
                    // begin coding visualization

                    // Browser onresize event
                    window.onresize = function(){
                        scope.$apply();
                    };

                    var width = 960,
                        height = 500;

                    var svg = d3.select("body").append("svg")
                        .attr("width", width)
                        .attr("height", height);

                    // Watch for resize event
                    scope.$watch(function(){
                        return angular.element($window)[0].innerWidth;
                    }, function(){
                        scope.render(scope.data);
                    });

                    // watch for data changes and re-render ***
                    scope.$watch('data', function(newVals, oldVals) {
                        return scope.render(newVals);
                    }, true);

                    scope.render = function(data){
                        // our custom d3 code
                        // define code as if we weren't using angular anyway

                        // remove all previous items before render
                        svg.selectAll('*').remove();

                        var color = d3.scale.category20();

                        var force = d3.layout.force()
                            .linkDistance(10)
                            .linkStrength(2)
                            .size([width, height]);

                        // TODO: Figure out how this works - it's the entry point for the data
                            // Firstly it looks like an XHR handler
                            // I want to reference the data var in the scope directly, while still using the functionality of the callback
                        d3.json("../models/goals-mis.json", function(error, graph) {
                            var nodes = graph.nodes.slice(),
                                edges = [],
                                bilinks = [];

                            graph.edges.forEach(function (edge) {
                                var s = nodes[edge.u],
                                    t = nodes[edge.v],
                                    i = {}; // intermediate node. TODO: what does this do?
                                nodes.push(i);
                                edges.push({source: s, target: i}, {source: i, target: t});
                                bilinks.push([s, i, t]);
                            });

                            force
                                .nodes(nodes)
                                .links(edges)
                                .start();

                            var link = svg.selectAll(".link")
                                .data(bilinks)
                                .enter().append("path")
                                .attr("class", "link");

                            var node = svg.selectAll(".node")
                                .data(graph.nodes)
                                .enter().append("circle")
                                .attr("class", "node")
                                .attr("r", 5)
                                .style("fill", function (d) {
                                    return color(d.group);
                                })
                                .call(force.drag);

                            node.append("title")
                                .text(function (d) {
                                    return d.name;
                                });

                            force.on("tick", function () {
                                link.attr("d", function (d) {
                                    return "M" + d[0].x + "," + d[0].y
                                        + "S" + d[1].x + "," + d[1].y
                                        + " " + d[2].x + "," + d[2].y;
                                });
                                node.attr("transform", function (d) {
                                    return "translate(" + d.x + "," + d.y + ")";
                                });
                            });
                        });
                    };
                });
            }};
    }]);
