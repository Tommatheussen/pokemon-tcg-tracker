const { db } = require('./database');

const { getLatestUpdate } = require('./updates');

const pokemon = require('pokemontcgsdk');

const request = require('request-promise');

function updateSets() {
  return new Promise((resolve, reject) => {
    getLatestUpdate('sets')
      .then(lastUpdate => {
        if (lastUpdate) {
          console.log(`There's an update here: ${lastUpdate.date}`);
        } else {
          console.log('Seeding database with sets');

          const setPromises = [];

          let setEmitter = pokemon.set.all({ pageSize: 1000 });

          setEmitter.on('data', set => {
            setPromises.push(createSet(set));
          });
          setEmitter.on('end', () => {
            Promise.all(setPromises).then(() => {
              return setLatestUpdate('sets').then(() => {
                resolve();
              }).catch(err => {
                reject(err);
              });
            });
          });
          setEmitter.on('error', error => {
            console.log(`Error! ${error}`);
            reject(error);
          });
        }
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
}

function createSet(set) {
  return new Promise(async (resolve, reject) => {
   db.sets.insert(
      {
        code: set.code,
        name: set.name,
        series: set.series,
        totalCards: set.totalCards,
        releaseDate: new Date(set.releaseDate),
        symbol: await getSymbol(set.symbolUrl)
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

async function getSymbol(symbolUrl) {
   return new Promise((resolve, reject) => {
    request({ uri: symbolUrl, encoding: null })
      .then(body => {
        resolve(body.toString('base64'));
      })
      .catch(error => {
        reject(error);
      });
  });
}

//  return new Promise((resolve, reject) => {
//     db.updates.findOne({ key: 'sets' }, (err, lastUpdate) => {
//       if (err) {
//         reject(err);
//       } else {
//         if (lastUpdate) {
//           console.log(lastUpdate);
//           const latestUpdateDate = +new Date(lastUpdate.date);
//           const weekAgo = new Date() - 604800000;
//           if (latestUpdateDate < weekAgo) {
//             console.log('should update');
//             resolve();
//           } else {
//             console.log('still good');
//             resolve();
//           }
//           console.log(latestUpdateDate);
//           console.log(weekAgo);
//         } else {
//           console.log('Should seed!');

//           let setEmitter = pokemon.set.all({ pageSize: 1000 });

//           setEmitter.on('data', set => {
//             console.log(`Set received: ${set.name}`);
//           });
//           setEmitter.on('end', () => {
//             db.updates.insert({ key: 'sets', date: new Date() }, (err, doc) => {
//               if (err) {
//                 reject(err);
//               } else {
//                 console.log(err, doc);

//                 console.log(`Sets finished`);
//                 resolve();
//               }
//             });
//           });
//           setEmitter.on('error', err => {
//             console.log(`Error received: ${err}`);
//             reject();
//           });
//         }
//       }
//     });
//   });
// }

module.exports = {
  updateSets
};
