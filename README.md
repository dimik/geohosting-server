Geohosting Server Application
=============================

This NodeJS+MongoDB application demonstrates how to create simple RESTful JSON-based API that operates with GeoSpatial data.

It shows implementation approaches to basic CRUD operations

and demonstrates methods of getting and grouping (clusterization) of large amount of GeoSpatial data on server side.

As a frontend part it uses highly efficient RemoteObjectManager module from Yandex.Maps API.

Getting Started
---------------

1. Fork your own copy of this git repository and clone it.

2. Install NodeJS, npm and MongoDB

3. Install all dependencies

    npm install

4. Write your config overrides in config/local.json

5. Run server.js

    node server.js

6. Run tests

    mocha test
