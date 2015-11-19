var redis = require('redis');
var url   = require('url');

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
    auth: '' // Error: The password has to be of type "string"
  }
}

var redisClient; // global (avoids duplicate connections!)
var redisSub;    // global (avoids duplicates!)

function new_connection () {
  var redis_con = redis.createClient(rc.port, rc.host);
  redis_con.auth(rc.auth);
  return redis_con;
}

function redis_connection (type) {
  if(type === 'subscriber'){
    if(redisSub && redisSub.connected) {  // create a subscriber connection:
      return redisSub;
    }
    else {
      redisSub = new_connection();
      return redisSub;
    }
  }
  else if(!redisClient) {
    redisClient = new_connection();
    return redisClient;
  }
}

module.exports = redis_connection;
