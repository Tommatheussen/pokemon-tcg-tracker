const { db } = require('./database');

//****************//
//  IPC functions //
//****************//
const { handler, notify } = require('../communicate');

handler('collection:load', (event, args) => {
  db.collection.find({ setCode: args.setCode }, (err, docs) => {
    notify('collection:list', docs);
  });
});

handler('collection:count', (event, args) => {
  db.collection.count({ setCode: args.setCode }, (err, count) => {
    notify(`collection:count:${args.setCode}`, count);
  });
});

handler('collection:new', (event, args) => {
  db.collection.insert(
    {
      setCode: args.setCode,
      cardId: args.cardId,
      collectionDate: new Date()
    },
    (err, doc) => {
      console.log(err, doc);
      notify(`collection:added:${args.setCode}`, 'ok');
    }
  );
});
