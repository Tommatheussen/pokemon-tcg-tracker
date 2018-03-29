const DataStore = require('nedb');

const db = {};

function createDatabase(name) {
  return new Promise((resolve, reject) => {
    const datastore = new DataStore({
      autoload: true,
      filename: `./databases/${name}.db`,
      onload: error => {
        if (error) {
          console.log(`${name} database failed to load: ${error}`);
          reject(error);
        } else {
          resolve(datastore);
        }
      }
    });
  });
}

function initDatabases() {
  return new Promise((resolve, reject) => {
    Promise.all([
      createDatabase('sets'),
      createDatabase('cards'),
      createDatabase('updates')
    ])
      .then(datastores => {
        db.sets = datastores[0];
        db.cards = datastores[1];
        db.updates = datastores[2];

        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

// const relationships = require('dexie-relationships');

// const db = new Dexie('pokemon', { addons: [relationships] });

// db.version(1).stores({
//   sets: 'code,name,series,releaseDate,totalCards',
//   cards: 'id,name,number,rarity,series,set,setCode -> sets.code',
//   collections: '++,cardId -> cards.id,setCode -> sets.code,collectionDate',
//   settings: 'key,value',
//   updates: 'key,date'
// });

// db.open().catch(e => {
//   console.log(e);
// });

module.exports = {
  db,
  initDatabases
};
