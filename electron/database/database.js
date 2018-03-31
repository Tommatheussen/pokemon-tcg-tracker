const DataStore = require('nedb');

const db = {};

function initDatabases() {
  return new Promise(async (resolve, reject) => {
    try {
      await createDatabase('sets');
      await ensureIndex(db.sets, 'code', true);

      await createDatabase('cards');
      await ensureIndex(db.cards, 'setCode');
      await ensureIndex(db.cards, 'id', true);

      await createDatabase('collection');
      await ensureIndex(db.collection, 'setCode');
      await ensureIndex(db.collection, 'cardId', true);

      await createDatabase('updates');
      await ensureIndex(db.updates, 'key', true);

      console.log('Databases finished');

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

//*********************//
// Private functions   //
//*********************//
function createDatabase(name) {
  return new Promise((resolve, reject) => {
    db[name] = new DataStore({
      autoload: true,
      filename: `./databases/${name}.db`,
      onload: error => {
        if (error) {
          console.log(`${name} database failed to load: ${error}`);
          reject(error);
        } else {
          resolve();
        }
      }
    });
  });
}

function ensureIndex(databaseTable, index, unique) {
  return new Promise((resolve, reject) => {
    databaseTable.ensureIndex({ fieldName: index, unique: unique }, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
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
