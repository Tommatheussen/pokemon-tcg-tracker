const express = require('express');
const router = express.Router();

var diskdb = require('diskdb');
db = diskdb.connect('./server/database/', ['collected']);

/* GET api listing. */
router.get('/', (req, res) => {
  let set = req.query.set;

  res.send(db.collected.find({
    set: set
  }));
});

router.put('/', (req, res) => {
  let set = req.body.set;
  let card = req.body.card;

  var existing = db.collected.find({
    set: set,
    card: card
  });

  if (existing.length) {
    db.collected.update({
      _id: existing[0]._id
    }, {
        collectedOn: Date.now()
      });
  } else {
    db.collected.save({
      set: set,
      card: card,
      collectedOn: Date.now()
    });
  }
  
  res.send();
});

module.exports = router;