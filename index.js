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

var CON = {}; // store redis connections as Object

function new_connection () {
  var redis_con = redis.createClient(rc.port, rc.host);
  redis_con.auth(rc.auth);
  return redis_con;
}

function redis_connection (type) {
  type = type || 'DEFAULT'; // allow infinite types of connections

  if(!CON[type] || !CON[type].connected){
    CON[type] = new_connection();
  }
  return CON[type];
}

module.exports = redis_connection;

module.exports.kill = function(type) {
  type = type || 'DEFAULT'; // kill specific connection or default one
  CON[type].end();
  delete CON[type];
}

module.exports.killall = function() {
  var keys = Object.keys(CON);
  keys.forEach(function(k){
    CON[k].end();
    delete CON[k];
  })
}
