const db = require('./database');


db.on('populate', () => {
  console.log('pop');
  db.settings.add({ key: 'auto_update', value: true });
});
