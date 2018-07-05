'use strict';

const uuidv1 = require('uuid/v1');
const Hapi=require('hapi');

const images = new Map();

// Create a server with a host and port
const server=Hapi.server({
    port: process.env.port
});

// Add the route
server.route({
    method:'GET',
    path:'/hello',
    handler:function(request,reply) {
      
        return'hello world';
    }
});

server.route({
  method:'POST',
  path:'/images',
  handler:function(request,h) {
    var value = request.payload.value;
    var id = uuidv1();
    images[id] = value
    var data = {
      id: id,
      expired: 60000 // ms
    }
    return data;
  }
});

server.route({
  method:'GET',
  path:'/images/{id}',
  handler:function(request,h) {
    var id = request.params.id;
    var value = images[id];
    if (!!id && !!value) {
      var data = {
        id: id,
        value: value
      }
      return data;
    } else {
      return h.response().code(404)
    }
  }
});

// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();