'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('D3BarCtrl', ['$scope', function($scope){
        $scope.greeting = "Resize the page to see the re-rendering";

        $scope.onClick = function(item){ // Notice that we need to use $scope.$apply() here. This is because the onClick event happens outside the current angular context.
            $scope.$apply(function(){
                if(!$scope.showDetailPanel) {
                    $scope.showDetailPanel = true;
                    $scope.detailItem = item;
                }
            });
        };

        $scope.data = [
            {name: "Greg", score: 98},
            {name: "Ari", score: 96},
            {name: 'Q', score: 75},
            {name: "Jeremy", score: 48}
        ];

    }])
    .controller('D3GraphCtrl', ['$scope', '$http', function($scope, $http){
        $scope.data = $http.get("./models/goals-mis.json");
    }])
    /*
     How about fetching data over XHR? Both AngularJS and D3 can support fetching data across the wire.
     By using the AngularJS method of fetching data, we get the power of the auto-resolving promises.
     That is to say, we don’t need to modify our workflow at all, other than setting our data in our controller to be fetched over XHR.
     */
    /*
    .controller('ESPNBarCtrl', ['$scope', '$http',
        function($scope, $http) {
            $http({
                method: 'JSONP',
                url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=JSON_CALLBACK&num=10&q=' +
                    encodeURIComponent('http://sports.espn.go.com/espn/rss/espnu/news')
            }).then(function(data, status) {
                var entries = data.data.responseData.feed.entries,
                    wordFreq = {},
                    data = [];

                angular.forEach(entries, function(article) {
                    angular.forEach(article.content.split(' '), function(word) {
                        if (word.length > 3) {
                            if (!wordFreq[word]) {
                                wordFreq[word] = {score: 0, link: article.link};
                            }
                            wordFreq[word].score += 1;
                        }
                    });
                });
                for (key in wordFreq) {
                    data.push({
                        name: key,
                        score: wordFreq[key].score,
                        link: wordFreq[key].link
                    });
                }
                data.sort(function(a,b) { return b.score - a.score; })
                $scope.data = data.slice(0, 5);
            });
        }])
    */
    .controller('GoalCtrl', ['$scope', '$route', '$routeParams', '$http', '$q', 'sharedSession', 'Restangular',
        function($scope, $route, $routeParams, $http, $q, sharedSession, Restangular) {

        setTimeout(function() {
            // TODO: Select graph by user
            /*
            Graph.find({title: $route.current.params.title}).then(function(post) {
                setScopes(post);
            });
            */
            // TODO: Select session by user
                // Define session
                // Migrate session factory to Resource model after figuring out graph

        }, 0);

        function setSessionScope() {
            $scope.sharedSession = sharedSession; // TODO: Replaced with system object and sensors?
        // Phase - what question and submissions we use
            $scope.$watch('sharedSession.getPhase()', function(){
                $scope.phase = sharedSession.getPhase();
            });
            $scope.setPhase = function(value){
                sharedSession.setPhase(value);
                $scope.phase = sharedSession.getPhase();
            };

        // Source Goal - what the entered goals will link to by default. Can be changed.
            $scope.$watch('sharedSession.getGetSourceGoal()', function(){
                $scope.sourceGoal = sharedSession.getSourceGoal();
            });
            $scope.setSourceGoal = function(value){
                sharedSession.setSourceGoal(value);
                $scope.sourceGoal = sharedSession.getSourceGoal();
            };
        };
            setSessionScope();

        function setGraphScope()   {
            // TODO: Migrate all of these to factory/providers

        // TODO: Node AJAX interface

            var baseNodes = Restangular.all('node');
             baseNodes.getList().then(function(response){
                 $scope.allNodes = response;
                 $scope.nodecount = response.length;
            });

            // Does a GET to /nodes
            // Retirms an empty array to default. Once a value is returned from the server
            // that array is filled with those values. So you can use this in your template
            $scope.nodes = baseNodes.getList().$object;

            $scope.newNode = function(nodeNum, goal){
                var nodeContent = {nodeNum: nodeNum, label: goal};

                baseNodes.post(nodeContent).then(function(newNd) {

                    // it looks like that I need to do databinding manually for these items.

                    $scope.nodes = baseNodes.getList().$object;
                    baseNodes.getList().then(function(response){
                        $scope.allNodes = response;
                        $scope.nodecount = response.length;
                        $scope.graph.nodes = $scope.nodes;
                    });

                }, function error(reason) {
                    // An error has occurred
                });

            };
            // TODO: Graph Passback Method

        // TODO: Edge AJAX interface

            var baseEdges = Restangular.all('edge');
            baseEdges.getList().then(function(response){
                $scope.allEdges = response;
                //$scope.edgecount = response.length;
            });

            // Does a GET to /edges
            // Retirms an empty array to default. Once a value is returned from the server
            // that array is filled with those values. So you can use this in your template
            $scope.edges = baseEdges.getList().$object;

            $scope.newEdge = function(node_in, node_out){
                var edgeContent = {u: node_in, v: node_out};

                baseEdges.post(edgeContent).then(function(newEdge) {

                    // it looks like that I need to do databinding manually for these items.

                    $scope.edges = baseEdges.getList().$object;
                    baseEdges.getList().then(function(response){
                        $scope.allEdges = response;
                        $scope.graph.edges = $scope.edges;
                    });

                }, function error(reason) {
                    // An error has occurred
                });
            };
            // TODO: Graph Passback Method

            // TODO: Label AJAX interface

            /* TODO: Replacing the AJAX interface for Graph temporarily - just using a basic json object to get to the money features faster
            // TODO: Graph AJAX interface
            var baseGraph = Restangular.all('graph');
            var thisGraph = Restangular.one('graph','12358'); // second param is userID

            var thisNodes = thisGraph.getList('nodes');
            var thisEdges= thisGraph.getList('edges');

            baseGraph.getList().then(function(response){
                $scope.allGraphs = response;
            });

            $scope.newGraph = function(nodes,edges){
                // expecting arrays of nodes and edges
            }
            $scope.updateGraph = function(nodes,edges){

            }
                // TODO: Graph model containing Node, Edge, Label, session properties
            */

            // GRAPH OBJECT
                // Can't be saved yet, not a REST object, but dead, dead simple.
            $scope.graph = {"nodes":$scope.nodes, "edges":$scope.edges};

        };
            setGraphScope();

    }])
    .controller('OmnibarCtrl', ['$scope', '$http', 'sharedSession', function($scope, $http, sharedSession){
        $scope.omnibar = '';
        // TODO: Is it possible just to describe the submissions in terms of event bindings?

        function setSessionScope() {
            $scope.sharedSession = sharedSession; // TODO: Replaced with system object and sensors?
            // Phase - what question and submissions we use
            $scope.$watch('sharedSession.getPhase()', function(){
                $scope.phase = sharedSession.getPhase();
            });
            $scope.setPhase = function(value){
                sharedSession.setPhase(value);
                $scope.phase = sharedSession.getPhase();
            };

            // Source Goal - what the entered goals will link to by default. Can be changed.
            $scope.$watch('sharedSession.getGetSourceGoal()', function(){
                $scope.sourceGoal = sharedSession.getSourceGoal();
            });
            $scope.setSourceGoal = function(value){
                sharedSession.setSourceGoal(value);
                $scope.sourceGoal = sharedSession.getSourceGoal();
            };
        };
            setSessionScope();

        $scope.submitForm = function(goal){
            // TODO: Redo submit logic to be sparser
                // i.e. sparsely create goal if it doesn't already exist, and then set; instead of only creating the goal if there is no source goal already.

            // CREATE GOAL LOGIC HERE
                // if new submission, make it and set as active goal
                // Otherwise, set query as active goal
                // check what phase it is and handle the active goal
                    // phase 0: set as source goal and end
                    // phase 1: connect active goal to source goal via an edge
                // clear all variables
            // this way I can create goals at any stage, instead of e.g. creating goals and then setting them as parents. lateral expansion
                // how will the d3 visualization handle this?
            // TODO: to prevent label duplication, enforce letter case

            if ($scope.phase == 0) {
                // What do you want to do?
                // if

                if (!$scope.sourceGoal) {

                    var newSourceGoal = { nodeNum: JSON.stringify($scope.nodecount), label: goal };
                    $scope.newNode      (JSON.stringify($scope.nodecount), goal);
                    $scope.setSourceGoal(newSourceGoal);

                } else {

                    $scope.setSourceGoal(goal); // get the result as a node and cache it

                }

                // TODO: Refuse to go to phase 1 until we have a sourceGoal
                $scope.setPhase(1);

            }

            else if ($scope.phase == 1) { // setting it as an 'else' clause otherwise posts occur twice with identical submissions
                // Why do you want to do SourceGoal?
                var connectNode;

                // If new label/entered field, create newGoal and set as our connectNode
                if (true){ // plain old new pojo code detection here
                    var newGoal = { nodeNum: JSON.stringify($scope.nodecount), label: goal };
                    connectNode = newGoal;
                    $scope.newNode(newGoal.nodeNum, newGoal.label);
                }
                // If not new/selected from autosuggestion, set connectNode to contain the nodeNum of the suggestion
                else if (true) { // autosuggestion submission detection code here
                    // autosuggestion handling code here
                }

                $scope.newEdge($scope.sourceGoal.nodeNum , connectNode.nodeNum);

            }

        };

        function setupQuestions() {
        /*DONE: Question Change based on Phase*/
        // Assign question its data and track changes to questionType
        // Externalize questions as data somewhere. JSON and express call?
        // Initialize question code
            var questions = [
                "What do you want to do",
                "Why do you want to do"
            ];

            $scope.$watch('sharedSession.getPhase()', function(){
                $scope.question = questions[$scope.phase];
            });
        }
            setupQuestions();

        function setupOmnibar()   {
            // Instantiate the bloodhound suggestion engine
            var initBar = function ($scope) {
                var goals = new Bloodhound({
                    datumTokenizer: function (d) {
                        return Bloodhound.tokenizers.whitespace(d.num);
                    },
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    // TODO: replace local with dynamic $http or resource call to current labels list.
                    local: [
                        { num: 'one' },
                        { num: 'two' },
                        { num: 'three' },
                        { num: 'four' },
                        { num: 'five' },
                        { num: 'six' },
                        { num: 'seven' },
                        { num: 'eight' },
                        { num: 'nine' },
                        { num: 'ten' }
                    ]
                });

                // initialize the bloodhound suggestion engine
                goals.initialize();

                // Allows the addition of local datum
                // values to a pre-existing bloodhound engine.
                $scope.addValue = function () {
                    goals.add({
                        num: 'twenty'
                    });
                };

                // Typeahead options object
                $scope.exampleOptions = {
                    highlight: true
                };

                // Single dataset example
                $scope.exampleData = {
                    displayKey: 'num',
                    source: goals.ttAdapter()
                };
            };
            initBar($scope);

            var initEventBinding = function ($scope) {

                $('.input#omnibar').keydown(function (e) {
                    e.preventDefault();
                }).keyup(function(e){
                    e.preventDefault();
                }).keypress(function(e){
                    e.preventDefault();
                });

                /*
                /* These events trigger submissions through REST routing to DataCtrl
                 * DataCtrl will update the bound items to it, like the Bloodhound stuff
                 * So somehow all of the following have to be encoded as route or state parameters
                 */

                /* TODO:
                 * Start with the jQuery-like event detection on css selector elements, for keypresses
                 * Combine with XHR services tutorial
                 * Start out by testing with alerts whether each event is recognized.
                 */

                // PARENT GOAL RELATED EVENTS

                // Submission on Enter & Need Parent is true
                // Test for having content or empty
                // Empty: Demand rootParent
                // Content: Assign submission as rootParent and currentParent in goals
                // Submission on Enter & Empty
                // Switch between goals in the same order
                // Submission on Enter and AltKey down & Empty
                // Cycle between Orders
                // Submission on Enter and AltKey down & Autosuggestion
                // Change current Parent to Selection

                /* ALTERNATELY: USE ARROW KEYS
                 * Alt-Shift-(Up-Down) for between Orders
                 * Alt-Shift-(Left-Right) for within Order
                 * */

                // CHILD GOAL RELATED EVENTS
                // These events only become active if we have a parent
                    // Submission on Enter & New
                        // Assume adding child
                        // Create label with unique numeric ID
                        // Create transient source-target object
                        // Add as diff to nodes for persistence
                        // Callback change in graph
                            // Wiring exists already handling
                            // Wiring doesn't exist handling
                    // Submission on Enter & Autosuggestion Selected
                        // Assume adding child
                        // Create transient source-target object
                        // Add as diff to nodes for persistence
                        // Callback change in graph
                           // Wiring exists already handling
                            // Wiring doesn't exist handling

                /* End Bar Code */

            };
            initEventBinding($scope);
        }
            setupOmnibar();

    }])
    .controller('DisplayCtrl',['$scope', 'sharedSession', function($scope, sharedSession){
    }]);
