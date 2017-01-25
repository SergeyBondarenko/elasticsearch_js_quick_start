'use strict';

const elasticsearch = require('elasticsearch');
const DOCUMENTS = require('./documents.json');

const ES_INDEX_NAME = 'spaceship_project';
const ES_PORT = 9200;
const ES_HOST = 'localhost';
const LOG_NAME = 'trace';
const DELETE_INDEX = true;

const client = new elasticsearch.Client({
  host: `${ES_HOST}:${ES_PORT}`,
  log: LOG_NAME
});

if (DELETE_INDEX) {
  client.indices.delete({
    index: ES_INDEX_NAME,
    ignore: [404]
  }).then(() => {

    createIndex(client, processDocuments(client, DOCUMENTS));

  }, (error) => {
    console.log(`DELETE INDEX: ${error}`);
  });
} else {
  processDocuments(client, DOCUMENTS);
}

function createIndex(client, callback) {
  client.indices.create({
    index: ES_INDEX_NAME,
  }, (error, response) => {
    if (error) {
      console.log(`CREATE INDEX: ${error}`);
    } else {
      console.log(response);

      if (callback) {
        callback();
      }
    }
  });
}

function indexDoc(client, doc, type, callback) {
  client.index({
    index: ES_INDEX_NAME,
    type: type,
    id: doc.id,
    body: doc
  }, (error, response) => {
    if (error) {
      console.log(`INDEX DOC: ${error}`);
    } else {
      console.log(response);

      if (callback) {
        callback();
      }
    }
  });
}

function processDocuments(client, docs) {
  for (const i in docs.spaceship_parts) {
    if (docs.spaceship_parts.hasOwnProperty(i)) {
      indexDoc(client, JSON.stringify(docs.spaceship_parts[i]), 'spaceship_parts');
    }
  }
  for (const i in docs.spaceship_service) {
    if (docs.spaceship_service.hasOwnProperty(i)) {
      indexDoc(client, JSON.stringify(docs.spaceship_service[i]), 'spaceship_service');
    }
  }
}

