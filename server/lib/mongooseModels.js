var mongoose = require('mongoose'),
  bcrypt = require('bcryptjs'),
  //Get the configuration from env or use defaults
  config = {
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS,
    host: process.env.MONGODB_HOST || 'localhost',
    port: process.env.MONGODB_PORT || '27017',
    db: process.env.MONGODB_DB || 'db'
  }, user = '';

if (process.env.MONGOLAB_URI) {
  mongoose.connect(process.env.MONGOLAB_URI);
} else {

  if (config.user && config.pass) {
    user = config.user + ':' + config.pass + '@';
  }
  mongoose.connect('mongodb://' + user + config.host + ':' + config.port + '/' + config.db);
}

var schema = {}, odmApi = {};

schema.system = new mongoose.Schema({
  placement: {
    type: String
  }
});

schema.sensor = new mongoose.Schema({
  name: {
    type: String
  },
  system_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});
/*
schema.post = new mongoose.Schema({
  title: {
    type: String
  },
  body: {
    type: String
  }
});

schema.comment = new mongoose.Schema({
  body: {
    type: String
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});
*/

schema.session = new mongoose.Schema({
    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'node'
    },
    phase: { type: Number }
});

schema.node = new mongoose.Schema({
    nodeNum: {
        type: Number
    },
    label: {
        type: String
    }
});

schema.edge = new mongoose.Schema({
    u: {
        type: Number
    },
    v: {
        type: Number
    }
});

schema.graph = new mongoose.Schema({
    nodes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'node'
    }],
    edges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'edge'
    }]
});

odmApi.schema   = schema;
odmApi.mongoose = mongoose;
for (var i in schema) {
  odmApi[i] = mongoose.model(i, schema[i]);
}
module.exports  = odmApi;
