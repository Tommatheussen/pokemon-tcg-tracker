const { db } = require('./database');

const { getLatestUpdate, setLatestUpdate } = require('./updates');

const pokemon = require('pokemontcgsdk');

const moment = require('moment');

function updateSets() {
  return new Promise(async (resolve, reject) => {
    try {
      const latestUpdate = await getLatestUpdate('sets');

      if (latestUpdate) {
        console.log(`Last update: ${latestUpdate.date}`);

        const latestUpdateDate = moment(latestUpdate.date);
        const now = moment();

        if (now.diff(latestUpdateDate, 'days') > 7) {
          console.log(`Wil update sets!`);

          await loadSets({
            updatedSince: latestUpdateDate.format('MM/DD/YYYY HH:MM:SS')
          });

          await setLatestUpdate('sets');

          resolve();
        } else {
          console.log(`Sets are good`);
          resolve();
        }
      } else {
        console.log(`No update date found, seeding database.`);

        // Load all sets
        await loadSets();

        // Set latest update key
        await setLatestUpdate('sets');

        resolve();
      }
    } catch (error) {
      console.error(`Something went wrong! ${error}`);

      reject(error);
    }
  });
}

async function loadSets(params) {
  return new Promise((resolve, reject) => {
    const setPromises = [];

    let setEmitter = pokemon.set.all(
      Object.assign({}, params, { pageSize: 1000 })
    );

    setEmitter.on('data', set => {
      setPromises.push(upsertSet(set));
    });
    setEmitter.on('end', () => {
      Promise.all(setPromises).then(() => {
        resolve();
      });
      setEmitter.on('error', error => {
        console.log(`Error! ${error}`);
        reject(error);
      });
    });
  });
}

function upsertSet(set) {
  return new Promise(async (resolve, reject) => {
    db.sets.update(
      {
        code: set.code
      },
      {
        $set: {
          name: set.name,
          series: set.series,
          totalCards: set.totalCards,
          releaseDate: set.releaseDate
          // symbol: await getSymbol(set.symbolUrl)
          // TODO: store symbol
        }
      },
      {
        upsert: true
      },
      (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      }
    );
  });
}

// async function getSymbol(symbolUrl) {
//   return new Promise((resolve, reject) => {
//     request({ uri: symbolUrl, encoding: null })
//       .then(body => {
//         resolve(body.toString('base64'));
//       })
//       .catch(error => {
//         reject(error);
//       });
//   });
// }

//****************//
//  IPC functions //
//****************//
const { handler, notify } = require('../communicate');

handler('sets:load', () => {
  db.sets.find({}, (err, docs) => {
    notify('sets:list', docs);
  });
});

handler('sets:count', (event, args) => {
  // TODO: Count!
  notify(`sets:count:${args.code}`, 0);
});

module.exports = {
  updateSets
};
