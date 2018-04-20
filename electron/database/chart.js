const { db } = require('./database');

//****************//
//  IPC functions //
//****************//
const { handler, notify } = require('../communicate');

handler('chart:load', async () => {
  let collectionCall = countCollection();
  let totalCall = countTotal();

  let results = await Promise.all([collectionCall, totalCall]);
  notify('chart:data', {
    collected: results[0],
    total: results[1]
  });
});

async function countCollection() {
  return new Promise((resolve, reject) => {
    db.collection.count({}, (err, count) => {
      if (err) {
        reject(err);
      } else {
        resolve(count);
      }
    });
  });
}

async function countTotal() {
  return new Promise((resolve, reject) => {
    db.sets.find({}, (err, sets) => {
      if (err) {
        reject(err);
      } else {
        let total = sets.reduce((allCards, current) => {
          return allCards + current.totalCards;
        }, 0);
        resolve(total);
      }
    });
  });
}
