[![Build Status](https://travis-ci.org/zpallin/friendship.svg?branch=master)](https://travis-ci.org/zpallin/friendship)

# Friendship!

Friendship is a distributed systems administration tool that allows you to manage asynchronous interactions between devices easily.

Friendship is not a configuration management provisioner. Instead, it is the framework that just makes sure you can easily keep track of all of your nodes, which in this case nodes are your "friends", and really they're probably your only friends (because you're in IT).

# Getting Started

## Dependencies

- nodejs
- npm

## Running the App

1. clone this repository: `git clone https://github.com/zpallin/friendship`
2. `cd friendship`
3. `npm install`
4. `nodejs friendship.js become -n <your computer's name here>`
5. profit???

That's it so far! :/

# Features

## Roles

Roles are how we know friends are supposed to interact with one another.

| Type    | Description                                       | Works? |
| ------- | ------------------------------------------------- | ------ |
| Friend  | A "basic" friend that does whatever it's told     | Yes... |
| Popular | Contains data, and everyone wants to know them    | No     | 
| Bully   | Always pushing other friends around (admin)       | No     |
| Gossip  | Runs a website with monitoring data               | No     |
| Heckler | Carries out the work of the Bullies               | No     |

### Popular  

Popular friends will store a database of all of the shared data between friends. They will also be able to to decide permissions for bullies.

Popular friends will also be able to be created incrementally and automatically handle replication, backups, etc.

### Bully

Bullies are the friends that have the ability to tell other friends what to do via a user. A user must register a Bully with a Popular friend before it can do any "bullying". 

A Bully can also dynamically load balance Gossipers to do work through Diaries.

### Heckler

Hecklers carry out the work of Bullies synchronously or asynchronously. Bullies can control them through Diaries.

### Gossip

A Gossiper is a normal friend in any way, but exposes a web page that reports information that comes from Popular friends.

## Diaries

These don't exist yet, but they are essentially config files that allow Bullies to orchestrate step-by-step distributed instructions to multiple friends. 

Other provisioning software will be allowed as "plugins". It is likely that tools like Chef and Puppet will get priority.

