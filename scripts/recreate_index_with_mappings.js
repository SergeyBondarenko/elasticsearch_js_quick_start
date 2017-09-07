const es = require('elasticsearch');
const chicagoCrimesMappings = require('./datasets/chicago_crimes_mappings');

const INDEX = 'chicago_crimes';
const TYPE = 'logs';
const HOST = 'localhost:9200';
const LOG = 'trace';

const client = new es.Client({
  host: HOST,
  log: LOG
});

client.indices.delete({
  index: INDEX,
  ignore: [404]
}).then(() => {
  return client.indices.create({
    index: INDEX
  });
}).then(() => {
  return client.indices.putMapping({
    index: INDEX,
    type: TYPE,
    body: chicagoCrimesMappings
  });
}).catch(err => {
  console.log('ERROR:');
  console.log(JSON.stringify(err, null, 2));
});
