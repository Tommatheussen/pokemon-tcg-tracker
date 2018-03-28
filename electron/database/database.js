const datastore = require('nedb');

const databaseOptions = {
  autoload: true,
  onload: error => {
    console.log(error);
  }
};

function getDatabaseOptions(name) {
  return {
    autoload: true,
    filename: `./databases/${name}.db`
  };
}

let db = {
  sets: new datastore(getDatabaseOptions('sets')),
  updates: new datastore(getDatabaseOptions('updates'))
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
