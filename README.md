# Redis Connection

A ***Global Redis Connection*** that can be used anywhere in your app
and closed ***once*** at the end of tests.

## Why?

At ***dwyl*** *we* ***use Redis everywhere*** *because its* ***fast***!

> If you're *new* to Redis, checkout our *beginners tutorial*:
https://github.com/dwyl/learn-redis

Given that we modularise our apps and we
don't want each *file* opening multiple connections to the Redis datastore
(*because* ***Redis connections*** *are a* ***scarce resource*** - [RedisCloud](https://addons.heroku.com/rediscloud) is *30 connections* - *and
  each connection needs to be closed for tape tests to exit*...)

We decided it made sense to use a global connection.
