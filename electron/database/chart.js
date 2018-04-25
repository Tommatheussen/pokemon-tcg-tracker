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

handler('chart:series:load', async (event, args) => {
  let sets = await loadSets(args);

  let setCodes = sets.map(set => {
    return set.code;
  });

  let collections = await loadCollections(setCodes);

  let seriesInfo = sets.map(set => {
    let setCollection = collections.filter(
      collection => set.code === collection.setCode
    );
    return {
      name: set.name,
      value: (setCollection.length / set.totalCards * 100).toFixed(2)
    };
  });

  notify(`chart:series:data:${args}`, seriesInfo);
});

handler('chart:load:series', async () => {
  let seriesCall = loadSeries();
  let collectionCall = loadCollection();

  let results = await Promise.all([seriesCall, collectionCall]);

  let allSeries = results[0];
  let collectionCount = results[1];

  let seriesData = [];

  for (let series in allSeries) {
    let seriesInfo = {
      name: series,
      series: allSeries[series].map(set => {
        return {
          name: set.name,
          value: (
            (collectionCount[set.code] || 0) /
            set.totalCards *
            100
          ).toFixed(2)
        };
      })
    };
    seriesData.push(seriesInfo);
  }

  notify('chart:data:series', seriesData);
});

function loadSets(seriesName) {
  return new Promise((resolve, reject) => {
    db.sets.find({ series: seriesName }, (err, sets) => {
      if (err) {
        reject(err);
      } else {
        resolve(sets);
      }
    });
  });
}

function loadCollections(setCodes) {
  return new Promise((resolve, reject) => {
    db.collection.find(
      {
        setCode: {
          $in: setCodes
        }
      },
      (err, collection) => {
        if (err) {
          reject(err);
        } else {
          resolve(collection);
        }
      }
    );
  });
}

function loadCollection() {
  return new Promise((resolve, reject) => {
    db.collection.find({}, (err, collection) => {
      if (err) {
        reject(err);
      } else {
        let setCount = collection.reduce((setCounts, currentCollection) => {
          if (!setCounts[currentCollection.setCode]) {
            setCounts[currentCollection.setCode] = 0;
          }
          setCounts[currentCollection.setCode]++;
          return setCounts;
        }, {});
        resolve(setCount);
      }
    });
  });
}

function loadSeries() {
  return new Promise((resolve, reject) => {
    db.sets.find({}, (err, sets) => {
      if (err) {
        reject(err);
      } else {
        let series = sets.reduce((allSeries, currentSet) => {
          if (!allSeries[currentSet.series]) {
            allSeries[currentSet.series] = [];
          }
          allSeries[currentSet.series].push(currentSet);
          return allSeries;
        }, {});

        resolve(series);
      }
    });
  });
}

function countCollection() {
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

function countTotal() {
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
