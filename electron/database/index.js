const { initDatabases } = require('./database');
const { updateSets } = require('./sets');
const { notify, handler } = require('../communicate');

module.exports = {
  initDatabases,
  updateSets
};

handler('cards:load', (event, args) => {
  console.log(args.setCode);
  notify('cards:list');
});
