Geohosting Server Application
=============================

This NodeJS+MongoDB application demonstrates how to create simple RESTful JSON-based API that operates with GeoSpatial data.

It shows implementation approaches to basic CRUD operations and demonstrates methods of getting and grouping (clusterization)

of large amount of GeoSpatial data on server side. Data is provided in [GeoJSON](http://geojson.org/) format.

As a frontend part it uses highly efficient [RemoteObjectManager](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/RemoteObjectManager-docpage/) module from Yandex.Maps API.

Getting Started
---------------

1. Fork your own copy of this git repository and clone it.

2. Install NodeJS, npm and MongoDB

3. Install all dependencies

```
    npm install
```

4. Write your config overrides in config/local.json

5. Run server.js

```
    node server.js
```

6. Run tests

```
    mocha test
```

API Examples
------------

API operates with GeoSpatial data using [GeoJSON](http://geojson.org/) format

### Create Feature ###

Use POST type of request and send [GeoJSON Feature object](http://geojson.org/geojson-spec.html#feature-objects)
Currently only "Point" [type](http://geojson.org/geojson-spec.html#point) of geometry supported and long-lat coordinates order
Provide special "properties" data fields as "balloonContent", "hintContent", "iconContent".
You are able to use own Feature identificator "id" or it will be assigned by Server.

POST /api/v1/features

```json
{
  "id": "1",
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [ 37.5, 55.7 ]
  },
  "properties": {
    "balloonContent": "The quick brown fox jumps over the lazy dog",
    "hintContent": "The quick brown fox jumps over the lazy dog"
  }
}
```

Server will reply with 201 status and return stored Feature data.

### Update Feature ###

Use PUT type of request to update existed Feature data using featureId on the end of request URL
Send the fields you want to update.

PUT /api/v1/features/1

```json
{
  "properties": {
    "balloonContent": "New content of Placemark Balloon'
  }
}
```

Server will reply with 204 status.

### Remove Feature ###

Use DELETE type of request to remove existed Feature using featureId on the end of request URL

DELETE /api/v1/features/1

Server will reply with 204 status.

### Get Feature ###

Use GET type of request to get existed Feature data using featureId on the end of request URL

GET /api/v1/features/1

Server will reply with 204 status and return Feature data.

### Search Features ###

Use GET type of request to search Features using URL path according to type of search.
Provide additional arguments from GeoJSON Feature schema to filter only necessary Features.

For getting Features within certain tile numbers provide *bbox* argument describes requested tiles area, zoom, and necessity in clusterization.
GET /api/v1/features/within/tiles?bbox=0,0,2,2?clusterize=1&zoom=5

Server will reply with 200 status and return found Features as [FeatureColection](http://geojson.org/geojson-spec.html#feature-collection-objects)
