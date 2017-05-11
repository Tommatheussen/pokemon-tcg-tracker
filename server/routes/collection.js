const express = require('express');
const router = express.Router();

var diskdb = require('diskdb');
db = diskdb.connect('./server/database/', ['collected']);

/* GET api listing. */
router.get('/', (req, res) => {
  let setCode = req.query.setCode;

  res.send(db.collected.find({
    setCode: setCode
  }));
});

router.put('/', (req, res) => {
  let setCode = req.body.setCode;
  let card = req.body.card;

  var existing = db.collected.find({
    setCode: setCode,
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
      setCode: setCode,
      card: card,
      collectedOn: Date.now()
    });
  }
  
  res.send();
});

module.exports = router;