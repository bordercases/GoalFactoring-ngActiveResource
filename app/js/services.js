'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
    .value('version', '0.1');// temporarily using ngResource over Express to avoid Express configuration, and to just get prototype running. (Lessons Learned)

angular.module('myApp.data',['ActiveResource'])
    .provider('Node', function(){

        // TODO: Linking providers and factories: http://weblogs.asp.net/dwahlin/using-an-angularjs-factory-to-interact-with-a-restful-service
        // TODO: Doing simple controller integration of resource provider for now; will eventually migrate this to the sharedSession factory
        // TODO: Write provider based on ActiveResource - https://github.com/FacultyCreative/ngActiveResource

        // NOTE: After much trouble, I think the difficulty was somehow related to providers not having dependencies, but I was giving them arrays.
        // Also there was trouble with the dependencies for active resource which would have stopped it from running.

        this.$get = ['ActiveResource', function(ActiveResource) {

            function Node(data) {
                this.number('nodeNum');
                this.string('label');

                //this.hasMany

                //this.belongsTo('graph');
            }
            Node.inherits(ActiveResource.Base);
            Node.api.set('http://api.faculty.com');
            //Node.dependentDestroy() <- label?
            return Node;
        }];

    })
    .provider('Edge', function(){
        this.$get = ['ActiveResource', function(ActiveResource) {
            function Edge(data) {
                this.number('u');
                this.number('v');

                //this.hasMany

                //this.belongsTo('graph');
            }
            Edge.inherits(ActiveResource.Base);
            Edge.api.set('/api/');
            //Node.dependentDestroy() <- label?
            return Edge;
        }];
    })
    .factory('sharedSession', function(){
        // http://onehungrymind.com/angularjs-communicating-between-controllers/
        // I'll start out without any reference to scope.

        // Encapsulate some configuration values, read from somewhere as defaults
        /* Values
         * phase - keeps track of what kind of question is needed to be asked based off of where I am in the goalfactoring process
         * thisGoal
         */

        // load/create shared session properties
        // TODO: These will eventually come from the express api to session parameters from a user
        var phase = 0; // 0 - "What do you want to do?"; 1 - "Why do you do [parent]?"; TODO: other questions to follow
        var sourceGoal; // Initialize as null. Will be a getter API link to specific node?

        // TODO: integrate session properties into cache, and have return properties of sharedSession reference the cache.
            // TODO: Make it work without reference to the cache first.

        // create shared session object
        var sharedSession = {
            getPhase: function(){
                return phase;
            },
            setPhase: function(value){
                // TODO: Exception handler for non-numeric values.
                phase = value;
            },
            getSourceGoal: function(){
                return sourceGoal;
            },
            setSourceGoal: function(goal){
                // TODO: General exception handler on goals somewhere in the code (maybe at the REST API) for JSON validation
                sourceGoal = goal;
            }
        };

        return sharedSession;

    });
