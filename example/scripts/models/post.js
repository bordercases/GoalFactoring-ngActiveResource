angular.module('app')
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
  });
