const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'fi-re-act',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

