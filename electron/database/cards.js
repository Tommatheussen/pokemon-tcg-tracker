const { db } = require('./database');

const { getLatestUpdate, setLatestUpdate } = require('./updates');

const { getSet } = require('./sets');

const pokemon = require('pokemontcgsdk');

const moment = require('moment');

async function loadCards(params) {
  return new Promise((resolve, reject) => {
    const cardPromises = [];

    let cardEmitter = pokemon.card.all(
      Object.assign({}, params, { pageSize: 1000 })
    );

    cardEmitter.on('data', card => {
      cardPromises.push(upsertCard(card));
    });
    cardEmitter.on('end', () => {
      Promise.all(cardPromises).then(() => {
        resolve();
      });
    });
    cardEmitter.on('error', error => {
      console.log(`Error! ${error}`);
      reject(error);
    });
  });
}

function upsertCard(card) {
  return new Promise(async (resolve, reject) => {
    db.cards.update(
      {
        id: card.id
      },
      {
        $set: {
          name: card.name,
          setCode: card.setCode,
          number: card.number,
          rarity: card.rarity,
          supertype: card.supertype
          //TODO: Store images
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

function getCards(setCode) {
  return new Promise(async (resolve, reject) => {
    try {
      let latestUpdate = await getLatestUpdate(setCode);

      if (latestUpdate) {
        console.log(`Last update: ${latestUpdate.date}`);

        let set = await getSet(setCode);

        const latestLocalUpdate = moment(latestUpdate.date);
        const latestSetUpdate = moment(set.updatedAt);

        if (latestLocalUpdate.isBefore(latestSetUpdate)) {
          console.log(`Wil update cards!`);

          await loadCards({
            setCode: setCode,
            updatedSince: latestLocalUpdate.format('MM/DD/YYYY HH:mm:ss')
          });

          await setLatestUpdate(setCode);

          resolve();
        } else {
          console.log(`Sets are good`);
          resolve();
        }
      } else {
        console.log("doesn't have cards yet");
        await loadCards({ setCode: setCode });
        await setLatestUpdate(setCode);
        resolve();
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

//****************//
//  IPC functions //
//****************//
const { handler, notify } = require('../communicate');

handler('cards:load', async (event, args) => {
  await getCards(args.setCode);
  db.cards.find({ setCode: args.setCode }, (err, docs) => {
    notify('cards:list', docs);
  });
});

handler('sets:count', (event, args) => {
  // TODO: Count!
  notify(`sets:count:${args.code}`, 0);
});
