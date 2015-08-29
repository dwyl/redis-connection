var redis = require('redis');
var url   = require('url');
var redisClient;
var redisSub;

var rc; // redis config
if (process.env.REDISCLOUD_URL) {
  var redisURL = url.parse(process.env.REDISCLOUD_URL);
  rc = {
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

function redis_connection (type) {
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

module.exports = redis_connection;
