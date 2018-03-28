const datastore = require('nedb');

function createDatabase(name) {
  return new datastore({
    autoload: true,
    filename: `./databases/${name}.db`,
    onload: error => {
      if (error) {
        console.log(`${name} database failed to load: ${error}`);
      }
    }
  });
}

let db = {
  sets: createDatabase('sets'),
  updates: createDatabase('updates')
};

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
  db
};
