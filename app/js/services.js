'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
    .value('version', '0.1');// temporarily using ngResource over Express to avoid Express configuration, and to just get prototype running. (Lessons Learned)

// d3 Module - based on http://www.ng-newsletter.com/posts/d3-on-angular.html
angular.module('d3',[])
    .factory('d3Service', ['$document', '$q', '$rootScope',
        function($document, $q, $rootScope) {
            var d = $q.defer();
            function onScriptLoad() {
                // Load client in the browser
                $rootScope.$apply(function() { d.resolve(window.d3); });
            }
            // Create a script tag with d3 as the source
            // and call our onScriptLoad callback when it
            // has been loaded
            var scriptTag = $document[0].createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.src = 'http://d3js.org/d3.v3.min.js';
            scriptTag.onreadystatechange = function () {
                if (this.readyState == 'complete') onScriptLoad();
            }
            scriptTag.onload = onScriptLoad;

            var s = $document[0].getElementsByTagName('body')[0];
            s.appendChild(scriptTag);

            return {
                d3: function() { return d.promise; }
            };
        }])
        /*
         Extending your own d3 directives

         Lastly, if we’re going to use d3 for any longer period of time, it’s inevitable that we’ll want to provide easier methods of creating extensions on our d3 object.

         We can extend our own d3 service by applying commonly used functions on to it using the decorator pattern. AngularJS makes this easy to do using the $provide service.
         */
        .config(['$provide', function($provide) {

            var customDecorator = function($delegate) {
                var d3Service = $delegate;
                d3Service.d3().then(function(d3) {
                    // build our custom functions on the d3
                    // object here
                });

                return d3Service; // important to return the service
            };

            $provide.decorator('d3Service', customDecorator);
        }]);
angular.module('myApp.data',[])
    /* Restangular
    .provider('Node', function(){
        function Node(){
            var nodes = Restangular.all('nodes');
        }
        return Node;
    })
    */
    // TODO: ngAngularResource implementation. Phasing our for Restangular.
    /*
    .provider('Post', function() {
        this.$get = ['ActiveResource', function(ActiveResource) {
            function Post(data) {
                this.title = data.title;
                this.body  = data.body;

                this.hasMany('comments');
            };

            Post = ActiveResource.Base.apply(Post);
            Post.primaryKey = '_id';
            Post.api.set('http://localhost:3000/api');
            Post.api.showURL   = 'http://localhost:3000/api/post/[:params]';
            Post.api.createURL = 'http://localhost:3000/api/post';

            return Post;
        }];
    })
    .provider('Comment', function() {
        this.$get = ['ActiveResource',
            function(ActiveResource) {

                function Comment(data) {
                    this.body   = data.body;
                    this.author = data.author;
                    this.belongsTo('post');

                    this.validates({
                        body:   { presence: true, length: { in: _.range(1, 140) } },
                        author: { presence: true }
                    });
                };

                Comment = ActiveResource.Base.apply(Comment);
                Comment.primaryKey    = "_id";
                Comment.api.set('http://localhost:3000/api');
                Comment.api.indexURL = 'http://localhost:3000/api/comment';
                Comment.api.showURL = 'http://localhost:3000/api/comment';
                Comment.api.deleteURL = 'http://localhost:3000/api/comment/:_id';
                Comment.api.createURL = 'http://localhost:3000/api/comment';

                return Comment;
            }];
    })
    .provider('Node', function(){

        // TODO: Linking providers and factories: http://weblogs.asp.net/dwahlin/using-an-angularjs-factory-to-interact-with-a-restful-service
        // TODO: Doing simple controller integration of resource provider for now; will eventually migrate this to the sharedSession factory
        // TODO: Write provider based on ActiveResource - https://github.com/FacultyCreative/ngActiveResource

        // NOTE: After much trouble, I think the difficulty was somehow related to providers not having dependencies, but I was giving them arrays.
        // Also there was trouble with the dependencies for active resource which would have stopped it from running.

        this.$get = ['ActiveResource', function(ActiveResource) {

            function Node(data) {
                this.count = true; // hack to make sure I can count the number of nodes successfully until I can get Node.all() to work
                this.nodeNum = data.nodeNum;
                this.label = data.label;
                //this.hasMany
                //this.belongsTo('graph');
            }
            Node = ActiveResource.Base.apply(Node);
            Node.primaryKey = '_id';
            Node.api.set('http://localhost:3000/api');
            Node.api.whereURL = 'http://localhost:3000/api/node'
            Node.api.indexURL = 'http://localhost:3000/api/node';
            Node.api.showURL   = 'http://localhost:3000/api/node/[:params]';
            Node.api.createURL = 'http://localhost:3000/api/node';

            return Node;
        }];

    })
    */
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
