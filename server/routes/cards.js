const express = require('express');
const router = express.Router();

const request = require('request-promise');

/* GET api listing. */
router.get('/', (req, res) => {
  request({
    uri: 'https://api.pokemontcg.io/v1/cards',
    qs: req.query,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  }).then(function (cards) {
    return res.send({
      cards: cards.cards,
      total: cards.totalCards
    });
  }).catch(function (err) {
    return res.send(err);
  });
});

module.exports = router;