const { SETS } = require('./sets');

const { db } = require('./database');

db.updates.insert({ key: 'sets', date: 'now' }, function(err, newDoc) {
  console.log(err, newDoc);
});

db.updates.findOne({ key: 'sets' }).exec((err, lastUpdate) => {
  console.log(err, lastUpdate);
  // if (lastUpdate) {
  //   console.log(`Last update was: ${lastUpdate.date}`);
  // } else {
  //   db.updates
  //     .add({ date: '2018-03-28', key: 'sets' })
  //     .then(result => {
  //       console.log(result);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     })
  //     .finally(() => {
  //       console.log(done);
  //     });
  // }
});

// const db = require('./database');

// require('./settings');

// db.open();

// console.log(db);

// console.log(db.settings.toArray());

// const { notify, handler } = require('../communicate');

// handler('get-sets', () => {
//   db.sets.toArray(function(sets) {
//     console.log(sets);
//   });
// });

// const pokemon = require('pokemontcgsdk');

// const emitter = pokemon.set.all({ pageSize: 1000, updatedSince: '03-05-2018' });

// emitter.on('data', result => {
//   console.log(`Set received: ${result.code}`);
// });
// emitter.on('end', () => {
//   console.log('end');
// });
// emitter.on('error', err => {
//   console.log(err);
// });

const { notify, handler } = require('../communicate');

handler('count', (event, args) => {
  notify(
    `count-${args.code}`,
    Math.floor(Math.random() * Math.floor(args.max))
  );
});

handler('load-sets', () => {
  db.sets.count({}, function(err, count) {
    console.log(`Count:`);
    console.log(err, count);
  });

  notify('sets', SETS);
});

handler('load-cards', (event, args) => {
  console.log(args.setCode);
  notify('cards', SETS);
});
