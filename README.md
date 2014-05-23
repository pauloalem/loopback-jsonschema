# Loopback JSON Schema [![Build Status](https://travis-ci.org/globocom/loopback-jsonschema.png?branch=master)](https://travis-ci.org/globocom/loopback-jsonschema)

Adds JSON Schema support to [LoopBack](https://github.com/strongloop/loopback).

## Installing

```
npm install loopback-jsonschema
```

## Setup

### Initializing

Add the following code after calling `app.boot();`

```js
var loopbackJsonSchema = require('loopback-jsonschema');
loopbackJsonSchema.init(app);
```

### Configuring a DataSource

Add a `loopbackJsonSchemaDb` entry to the `datasources.json` file with your data source configuration. If no `loopbackJsonSchemaDb` entry is found, we fallback to using the default memory data source.

### Overriding the default collection schema

It is possible to override the default collection schema by passing a custom `CollectionSchema` implementation to the `init` function:

```js
loopbackJsonSchema.init(app, { CollectionSchemaClass: MyCustomCollectionSchema });
```

```js
var util = require('util');
var CollectionSchema = require('loopback-jsonschema/lib/domain/collection-schema');

function MyCustomCollectionSchema() {
    CollectionSchema.apply(this, Array.prototype.slice.call(arguments));
};

util.inherits(MyCustomCollectionSchema, CollectionSchema);
// It's required to set the value of "pluralModelName". This value will be used on the headers. You can still use the default value (see below).
MyCustomCollectionSchema.pluralModelName = MyCustomCollectionSchema.super_.pluralModelName;

# Override functions to customize the default collection schema.
```

Have a look at https://github.com/globocom/loopback-jsonschema/blob/master/lib/domain/collection-schema.js for available functions to override.

## Using

### Dynamically defining Loopback models from a JSON Schema

To dynamically define a new Loopback model just create a new instance of the ItemSchema model provided by loopback-jsonschema. Doing this via the REST interface is as simples as POSTing a valid JSON Schema, as follows:

```
# person.json
{
  "type": "object",
  "title": "Person",
  "collectionTitle": "People",
  "modelName": "person",
  "collectionName": "people",
  "properties": {
    ...
  }
}
```

```
# Create a Person model from a JSON Schema
curl -i -XPOST -H "Content-Type: application/json" http://example.org/api/item-schemas -T person.json
```

The people collection will then be available at `http://example.org/api/people`.

### Item and Collection schemas

Once a Loopback model has been defined, Item and Collection schemas describing a single item and a collection of items, respectively, are automatically available.

#### Item Schema example

```
$ curl -i http://example.org/api/item-schemas/537530ea27f8870b63f2d886
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 577
ETag: "-912870715"
Date: Mon, 19 May 2014 19:07:14 GMT
Connection: keep-alive

{
  "id": "537530ea27f8870b63f2d886",
  "type": "object",
  "title": "Person",
  "collectionTitle": "People",
  "modelName": "person",
  "collectionName": "people",
  "links": [
    {
      "rel": "self",
      "href": "http://example.org/api/people/{id}"
    },
    {
      "rel": "item",
      "href": "http://example.org/api/people/{id}"
    },
    {
      "rel": "update",
      "method": "PUT",
      "href": "http://example.org/api/people/{id}"
    },
    {
      "rel": "delete",
      "method": "DELETE",
      "href": "http://example.org/api/people/{id}"
    }
  ],
  "$schema": "http://json-schema.org/draft-04/hyper-schema#"
}
```

#### Collection Schema example

```
$ curl -i http://localhost:5000/api/collection-schemas/537530ea27f8870b63f2d886
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 428
ETag: "64466323"
Date: Mon, 19 May 2014 19:11:55 GMT
Connection: keep-alive

{
  "$schema": "http://json-schema.org/draft-04/hyper-schema#",
  "type": "object",
  "title": "People",
  "properties": {
    "items": {
      "items": {
        "$ref": "http://example.org/api/item-schemas/537530ea27f8870b63f2d886"
      },
      "type": "array"
    },
    "previous_page": {
      "type": "integer"
    },
    "next_page": {
      "type": "integer"
    },
    "item_count": {
      "type": "integer"
    }
  },
  "links": []
}
```

### Default links

Item and collection schemas have a default set of links which correspond to the basic CRUD operations supported by Loopback.

### Including custom links

It is possible to include custom links in an item schema. To do so, just include them in the `links` property of the schema used to define a Loopback model:

```
{
  "type": "object",
  ...
  "properties": {
    ...
  },
  "links": [
    {
      "rel": "my-custom-link",
      "href": "http://example.org/my/custom/link"
    }
  ]
}
```

### Instance/Schema correlation

Every request for an instance is automatically correlated to its schema according to the [recommendation of the JSON Schema spec](http://json-schema.org/latest/json-schema-core.html#anchor33).

## Sample App

An example running LoopBack with this module: https://github.com/globocom/loopback-jsonschema-example

## Disclaimer

This project is very much in an alpha stage at the moment. But it is being actively developed. Contributions (code, documentation, issues, etc.) are very welcome.

## References

http://json-schema.org/
