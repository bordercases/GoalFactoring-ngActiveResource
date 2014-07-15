'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('GoalCtrl', ['$scope', '$route', '$routeParams', '$http', '$q', 'sharedSession', 'Node',
        function($scope, $route, $routeParams, $http, $q, sharedSession, Node) {

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

        /* see legacy.js.dep to see what went here before */
        // TODO: Node AJAX interface
        // TODO: Edge AJAX interface
        // TODO: Label AJAX interface
        // TODO: Goal AJAX interface
            // TODO: GOAL model containing Node, Edge, Label, session properties

    }])
    .controller('OmnibarCtrl', ['$scope', '$http', 'sharedSession', 'Node', function($scope, $http, sharedSession, Node){

        $scope.actionURL_test = "http://www.google.com/search"; //TODO: Link actionURL to API
        $scope.omnibar = '';

        // TODO: Doing simple controller integration of resource provider for now; will eventually migrate this to the sharedSession factory
            // TODO: Linking providers and factories: http://weblogs.asp.net/dwahlin/using-an-angularjs-factory-to-interact-with-a-restful-service

        // sharedSession - transient values that get saved (when the session ends?)
        // TODO: might just have to turn this into database driven loading and setting, but use session to keep track of data-binding still
        // setting question type doesn't automatically update $scope.questionType.

        // TODO: Is it possible just to describe the submissions in terms of event bindings?
        $scope.submitForm = function(goal){
            if ($scope.phase == 0){
                // What do you want to do?
                console.log('submitForm chaged to "What"');
                // TODO: Only active on autoselection?
                if (!$scope.sourceGoal) {

                    $scope.setSourceGoal(goal);
                    // if a goal with the label given from 'goal' doesn't exist, create it (this method could execute anyway)
                        // TODO: Create Node

                        var newNode = Node.new({nodeNum:0, label:goal});
                        console.log('newNode :'+newNode.toJSON());
                        // todo: right now assuming that a sourceGoal has never previously existed 9otherwise would not be null), so will create it
                        // todo: however, what if it comes from the autosuggestion case? This assumption only makes sense if sourceGoal is stored somewhere between sessions, which it isn't

                } else {
                    $scope.setSourceGoal(goal);
                }
                $scope.setPhase(1);

            } else if ($scope.phase == 1) {
                // Why do you want to do SourceGoal?
                console.log('submitForm chaged to "Why"');

                // If New
                    // TODO: Create Node
                    var newNode = Node.new({nodeNum:0, label:goal});
                    console.log('newNode :'+newNode.toJSON());
                    // TODO: write callback of new node to get its properties for the rest of the submit
                        // http://stackoverflow.com/questions/18564603/angular-resource-and-use-of-interceptor-to-check-response-error-callback
                        // testing header function
                // If not new, just create edge

                // TODO: Have edges and labels be created here as well
                //$scope.createEdge(goal);
                    // Is there a way eo ensure this?
            }
        };

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

        /* Bar Code */
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

        $('.input#omnibar').keydown(function (e) {
            e.preventDefault();
        }).keyup(function(e){
            e.preventDefault();
        }).keypress(function(e){
            e.preventDefault();
        });

        var initEventBinding = function ($scope) {

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

    }])
    .controller('DisplayCtrl',['$scope', 'sharedSession', function($scope, sharedSession){
    }]);
