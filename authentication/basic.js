const elasticsearch = require('elasticsearch');
const bcrypt = require('bcrypt');

const login = 'trex';
const password = 'admin';

const config = {
  host: [
    {
      host: 'localhost',
      auth: `${login}:${password}`,
      protocol: 'https',
      port: 9200
    }
  ]
};

const client = new elasticsearch.Client(config);

const index = 'credit_card';
const type = 'logs';
const body = {
  query: {
    match_all: {}
  }
};

client.search({
  index,
  type,
  body
}).then(function (resp) {
  console.log(JSON.stringify(resp, null, 2));
}).catch(function (err) {
  console.log(JSON.stringify(err, null, 2));
});
