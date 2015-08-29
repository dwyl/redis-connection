var redis = require('redis');

var redisClient;
var redisSub;

function redis_connection (type) {
  var rc; // redis config
  if (process.env.REDISCLOUD_URL) {
    var redisURL = url.parse(process.env.REDISCLOUD_URL);
    config = {
      port: redisURL.port,
      host: redisURL.hostname,
      auth: redisURL.auth.split(":")[1]
    }
  }
  else {
    rc =  {
      port: 6379,
      host: '127.0.0.1',
      auth: null
    }
  }
  if(type === 'subscriber'){
    if(redisSub && redisSub.connected) {  // create a subscriber connection:
      return redisSub
    }
    else {
      redisSub = redis.createClient(rc.port, rc.host);
      redisSub.auth(rc.auth);
      return redisSub
    }
  }
  else if(redisClient && redisClient.connected) {
    return redisClient;
  } else { // create client and authenticate
    redisClient = redis.createClient(rc.port, rc.host);
    redisClient.auth(rc.auth);
    return redisClient
  }

}

// redis_connection(); // auto run!

module.exports = redis_connection;
