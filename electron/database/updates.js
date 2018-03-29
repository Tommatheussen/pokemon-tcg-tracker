const { db } = require('./database');

function getLatestUpdate(key) {
  return new Promise((resolve, reject) => {
    db.updates.findOne({ key: key }, (err, doc) => {
      if (err) {
        reject(err);
      } else {
        resolve(doc);
      }
    });
  });
}

function setLatestUpdate(key) {
  return new Promise((resolve, reject) => {
    db.updates.update(
      { key: key },
      { $set: { date: new Date() } },
      { upsert: true },
      (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

module.exports = {
  getLatestUpdate,
  setLatestUpdate
};
