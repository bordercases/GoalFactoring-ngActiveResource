'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
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
                    });

                }, function error(reason) {
                    // An error has occurred
                });

            }

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
                        //$scope.edgecount = response.length;
                    });

                }, function error(reason) {
                    // An error has occurred
                });

            }

        // TODO: Label AJAX interface
        // TODO: Graph AJAX interface
            // TODO: Graph model containing Node, Edge, Label, session properties

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

            if ($scope.phase == 0) { // TODO: Phase 0 goal additions are adding goals twice to the database
                // What do you want to do?

                if (!$scope.sourceGoal) {

                    var newSourceGoal = { nodeNum: JSON.stringify($scope.nodecount), label: goal };
                    $scope.newNode      (JSON.stringify($scope.nodecount), goal);
                    $scope.setSourceGoal(newSourceGoal);

                } else {
                    $scope.setSourceGoal(goal); // get the result as a node and cache it
                }
                $scope.setPhase(1);
            }

            else if ($scope.phase == 1) { // setting it as an 'else' clause otherwise posts occur twice with identical submissions
                // Why do you want to do SourceGoal?

                // If new label/entered field

                console.log(JSON.stringify($scope.nodecount));

                var newGoal = { nodeNum: JSON.stringify($scope.nodecount), label: goal };
                $scope.newNode(newGoal.nodeNum, newGoal.label);

                    // TODO: write callback of new node to get its properties for the rest of the submit
                        // http://stackoverflow.com/questions/18564603/angular-resource-and-use-of-interceptor-to-check-response-error-callback
                        // testing header function
                // If not new/selected from autosuggestion just create edge

                // TODO: Have edges and labels be created here as well
                console.log($scope.sourceGoal, $scope.sourceGoal.nodeNum);
                $scope.newEdge($scope.sourceGoal.nodeNum , newGoal.nodeNum);
                    // Is there a way eo ensure this?
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
