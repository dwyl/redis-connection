# Redis Connection

A ***Global Redis Connection*** that can be used anywhere in your app
and closed ***once*** at the end of tests.

[![Build Status](https://travis-ci.org/dwyl/redis-connection.svg)](https://travis-ci.org/dwyl/redis-connection)
[![HitCount](https://hitt.herokuapp.com/nelsonic/redis-connection.svg)](https://github.com/dwyl/redis-connection)
[![Code Climate](https://codeclimate.com/github/dwyl/redis-connection/badges/gpa.svg)](https://codeclimate.com/github/dwyl/redis-connection)
[![codecov.io](http://codecov.io/github/dwyl/redis-connection/coverage.svg?branch=master)](http://codecov.io/github/dwyl/redis-connection?branch=master)
[![Dependency Status](https://david-dm.org/dwyl/redis-connection.svg)](https://david-dm.org/dwyl/redis-connection)
[![devDependency Status](https://david-dm.org/dwyl/redis-connection/dev-status.svg)](https://david-dm.org/dwyl/redis-connection#info=devDependencies)


## Why?

At ***dwyl*** *we* ***use Redis everywhere*** *because its* ***fast***!

> If you're *new* to Redis, checkout our *beginners tutorial*:
https://github.com/dwyl/learn-redis

Given that Redis can handle ***millions of operations per second***,
it is *unlikely* to be the *bottleneck* in your application/stack.

Where you *can* (*unintentionally*) *create* an issue is by having
***too many*** **connections** to your Redis Datastore.
*Don't laugh*, we've seen this happen,
where people open a ***new connection*** to Redis
for ***each*** **incoming http request**
(*and forget to close them!*) and thus quickly run out
of available connections to Redis!

Most apps *really* only need ***one*** connection to Redis (*per node.js instance*)
Or, if you are using Redis' **Publish/Subscribe** feature, you will need ***two*** connections per node.js server; one for a "*standard*" connection (*the* "***Publisher***"") and another as a "***Subscriber***".


Given that we *modularise* our apps and we
don't want each *file* opening multiple connections to the Redis datastore
(*because* ***Redis connections*** *are a* ***scarce resource*** - e.g: [RedisCloud](https://addons.heroku.com/rediscloud) is *30 connections* - *and
  each connection needs to be closed for tape tests to exit*...)
we decided write a *little* script to *instantiate* a *single* connection
to Redis which can be re-used across multiple files.


## What?

An ***easy*** way to re-use your ***single*** Redis connection
(*or* ***pair*** of connections - when using Redis Publish/Subscribe)
across multiple files/handlers in your application
and *close once* at the end of your tests.


## *How*?

### Install from NPM

```sh
npm install redis-connection --save
```

### Use in your code

```js
var redisClient = require('redis-connection')(); // require & connect
redisClient.set('hello', 'world');
redisClient.get('hello', function (err, reply) {
  console.log('hello', reply.toString()); // hello world
});
```

### Using Redis Publish / Subscriber ?

You can use the *standard* `redisClient` for *publishing* but
will need to have a *separate* connection to subscribe on.

Create a *Subscriber* connection by supplying the word subscriber
when starting the `redis-connection`:

```js
var redisSub = require('redis-connection')('subscriber');
redisSub.subscribe("chat:messages:latest", "chat:people:new");
// see: https://github.com/dwyl/hapi-socketio-redis-chat-example ;-)
```

### Closing your Connection(s)

Closing your connections is easy.

```js
var redisClient = require('redis-connection')(); // require & connect
redisClient.set('hello', 'world');
redisClient.get('hello', function (err, reply) {
  console.log('hello', reply.toString()); // hello world
  redisClient.end();
});
```

If you have created *multiple* connections in your app
(*you would do this to use Redis' Publish/Subscribe feature*),
we have a simple method to "*Close All*" the connections
you have opened in a single command: `killall()`

e.g:

```js
var redisClient = require('redis-connection')(); // require & connect
var redisSub = require('redis-connection')('subscriber');

// do things with redisClient and redisSub in your app...
// when you want to close both connections simply call:
require('redis-connection').killall();
```

### Using `redis-connection` with `env2`

If you are using [**env2**](https://github.com/dwyl/env2) to load your configuration file, simply require `env2` before requiring `redis-connection`:

```js
require('env2')('.env'); // load the redis URL
var redisClient = require('redis-connection')();
// now use your redis connection
```

## Need More?

If you need us to support a different Redis-as-a-service provider
or want to have more configuration options, please let us know!
[![Join the chat at https://gitter.im/dwyl/chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dwyl/chat/?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## *Contributors*

As with all #**dwyl** projects
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/redis-connection/issues)

### Environment Variables

If you want to help improve/update/extend this module,
please ask us for access to the ***environment variables***
(`.env` file) with `REDISCLOUD_URL` so you can test your modifications *locally*.
