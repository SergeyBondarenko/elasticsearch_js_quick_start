'use strict';

var elasticsearch = require('elasticsearch');

var ES_INDEX_NAME = 'other_places',
    ES_PORT = 9220,
    ES_HOST = 'localhost',
    ES_DOC_TYPE = 'my_city',
    LOG_NAME = 'trace',
    WITH_MAPPING = false;

var ES_DOCS = [
  {
    id: '1', 
    city: 'New York',
  },
  {
    id: '2', 
    city: 'York',
  }
];

var ES_MAPPINGS = {
  "mappings": {
    "my_city": {
      "properties": {
        "city": {
          "type": "string",
        }
      }
    }
  }
};

function indice_doc_into_es(client, doc, callback) {
  client.create({
    index: ES_INDEX_NAME,
    type: ES_DOC_TYPE,
    id: doc.id,
    body: doc 
  }, function (error, response) {
    if (error) {
      console.log('Error: ' + error);
    } else {
      console.log(response);
    }
  });

  if (callback) {
    callback();
  }
}

function search_index (client, query) {
  console.log('DOCUMENTS:');
  client.search({
    index: ES_INDEX_NAME,
    q: query
  }, function (error, response) {
    if (error) {
      console.log('Error: ' + error);
    } else {
      console.log(response);
    }
  });
}

// init ES client API
var client = new elasticsearch.Client({
  host: ES_HOST + ':' + ES_PORT,
  log: LOG_NAME
});

// delete index
client.indices.delete({
  index: ES_INDEX_NAME,
  ignore: [404]
}).then(function () {
  console.log('The index ' + ES_INDEX_NAME + ' was deleted!');
}, function (error) {
  console.log('Error: ' + error);
});

if (WITH_MAPPING) {
  // create index
  client.indices.putMapping({
    index: ES_INDEX_NAME,
    type: ES_DOC_TYPE,
    body: ES_MAPPINGS
  }, function () {
    console.log('The index ' + ES_INDEX_NAME + ' has been created!');

    var doc;
    // insert documents
    for (doc in ES_DOCS) {
      if (ES_DOCS.hasOwnProperty(doc)) {
        indice_doc_into_es(client, ES_DOCS[doc]);
      }
    }
  });
}

if (!WITH_MAPPING) {
  // create index
  client.indices.create({
    index: ES_INDEX_NAME,
    ignore: [404]
  }).then(function () {
    console.log('The index ' + ES_INDEX_NAME + ' has been created!');
  
    var doc;
    // insert documents
    for (doc in ES_DOCS) {
      if (ES_DOCS.hasOwnProperty(doc)) {
        indice_doc_into_es(client, ES_DOCS[doc]);
      }
    }
  }, function (error) {
    console.log('Error: ' + error);
  });
}
